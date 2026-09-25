import { SPRINGS, createSpring, isSettled, stepSpring } from './spring';

// Runs a spring from 0 to 1 and returns its peak value and settle time (s).
function simulate(spec, seconds = 3) {
  let state = { value: 0, velocity: 0 };
  let peak = 0;
  let settledAt = null;
  for (let t = 0; t < seconds; t += 1 / 60) {
    state = stepSpring(state, 1, spec, 1 / 60);
    peak = Math.max(peak, state.value);
    if (settledAt == null && isSettled(state, 1, 0.001)) settledAt = t;
  }
  return { peak, settledAt, final: state.value };
}

test.each(Object.keys(SPRINGS))('%s settles on the target', name => {
  const { final, settledAt } = simulate(SPRINGS[name]);
  expect(final).toBeCloseTo(1, 3);
  expect(settledAt).not.toBeNull();
});

test('spatial springs overshoot and effects springs do not', () => {
  expect(simulate(SPRINGS.fastSpatial).peak).toBeGreaterThan(1.05);
  expect(simulate(SPRINGS.defaultSpatial).peak).toBeGreaterThan(1);
  for (const name of ['fastEffects', 'defaultEffects', 'slowEffects']) {
    expect(simulate(SPRINGS[name]).peak).toBeLessThanOrEqual(1.0001);
  }
});

test('faster springs settle sooner', () => {
  const t = name => simulate(SPRINGS[name]).settledAt;
  expect(t('fastSpatial')).toBeLessThan(t('slowSpatial'));
  expect(t('fastEffects')).toBeLessThan(t('defaultEffects'));
  expect(t('defaultEffects')).toBeLessThan(t('slowEffects'));
});

describe('createSpring', () => {
  let frames;
  let now;
  const flush = (count = 1) => {
    for (let i = 0; i < count && frames.length; i++) {
      now += 1000 / 60;
      frames.shift()(now);
    }
  };

  beforeEach(() => {
    frames = [];
    now = 0;
    vi.stubGlobal('requestAnimationFrame', cb => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', () => frames.splice(0));
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
  });
  afterEach(() => vi.unstubAllGlobals());

  test('animates to the target and calls onRest once', () => {
    const updates = [];
    const onRest = vi.fn();
    const spring = createSpring(0, { spec: SPRINGS.defaultEffects, onUpdate: v => updates.push(v), onRest });
    spring.to(100);
    flush(600);
    expect(spring.value).toBe(100);
    expect(onRest).toHaveBeenCalledTimes(1);
    expect(updates.length).toBeGreaterThan(5);
    expect(frames).toHaveLength(0);
  });

  test('retargeting mid-flight keeps the velocity', () => {
    const spring = createSpring(0, { spec: SPRINGS.defaultSpatial });
    spring.to(100);
    flush(5);
    const velocity = spring.velocity;
    expect(velocity).toBeGreaterThan(0);
    spring.to(0);
    expect(spring.velocity).toBe(velocity);
    flush(1);
    expect(spring.value).toBeGreaterThan(0); // still moving forward before turning back
  });

  test('spatial springs jump to the target when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const onUpdate = vi.fn();
    createSpring(0, { spec: SPRINGS.defaultSpatial, onUpdate }).to(50);
    expect(onUpdate).toHaveBeenLastCalledWith(50);
    expect(frames).toHaveLength(0);
  });

  test('effects springs still animate with reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    createSpring(0, { spec: SPRINGS.defaultEffects }).to(1);
    expect(frames).toHaveLength(1);
  });
});
