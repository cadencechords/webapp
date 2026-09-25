// Spring physics for interruptible and gesture-driven motion (sheets, drag),
// using the M3 Expressive spring tokens. For simple state changes, prefer the
// CSS transition utilities in src/styles/motion.css.
//
//   const spring = createSpring(0, { spec: SPRINGS.defaultSpatial, onUpdate: v => (el.style.translate = `0 ${v}px`) });
//   spring.to(300);   // animate
//   spring.to(0);     // retarget mid-flight; velocity carries over
//   spring.stop();

// Damping ratio and stiffness from androidx ExpressiveMotionTokens.kt.
// Spatial springs (ratio < 1) overshoot; effects springs (ratio 1) don't.
export const SPRINGS = {
  fastSpatial: { dampingRatio: 0.6, stiffness: 800 },
  defaultSpatial: { dampingRatio: 0.8, stiffness: 380 },
  slowSpatial: { dampingRatio: 0.8, stiffness: 200 },
  fastEffects: { dampingRatio: 1, stiffness: 3800 },
  defaultEffects: { dampingRatio: 1, stiffness: 1600 },
  slowEffects: { dampingRatio: 1, stiffness: 800 },
};

const STEP = 1 / 240; // integration step, seconds

// Advances a unit-mass spring by `dt` seconds. Pure; returns the new state.
export function stepSpring(
  { value, velocity },
  target,
  { dampingRatio, stiffness },
  dt
) {
  const damping = 2 * dampingRatio * Math.sqrt(stiffness);
  let v = velocity;
  let x = value;
  for (let t = 0; t < dt; t += STEP) {
    const h = Math.min(STEP, dt - t);
    // Semi-implicit Euler: stable for these stiffness values at 240Hz.
    v += (-stiffness * (x - target) - damping * v) * h;
    x += v * h;
  }
  return { value: x, velocity: v };
}

export function isSettled({ value, velocity }, target, precision = 0.01) {
  return (
    Math.abs(value - target) < precision && Math.abs(velocity) < precision * 10
  );
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

// An animated value driven by requestAnimationFrame. Spatial springs jump
// straight to the target when the user prefers reduced motion.
export function createSpring(
  initial,
  { spec = SPRINGS.defaultSpatial, onUpdate, onRest, precision } = {}
) {
  let state = { value: initial, velocity: 0 };
  let target = initial;
  let frame = null;
  let last = null;
  const spatial = spec.dampingRatio < 1;

  const tick = now => {
    const dt = last == null ? STEP : Math.min((now - last) / 1000, 1 / 15);
    last = now;
    state = stepSpring(state, target, spec, dt);
    if (isSettled(state, target, precision)) {
      state = { value: target, velocity: 0 };
      frame = null;
      onUpdate?.(state.value);
      onRest?.(state.value);
      return;
    }
    onUpdate?.(state.value);
    frame = requestAnimationFrame(tick);
  };

  return {
    get value() {
      return state.value;
    },
    get velocity() {
      return state.velocity;
    },
    // Animate to a new target. Retargeting keeps the current velocity.
    to(next, { velocity } = {}) {
      target = next;
      if (velocity != null) state = { ...state, velocity };
      if (spatial && prefersReducedMotion()) return this.set(next);
      if (frame == null) {
        last = null;
        frame = requestAnimationFrame(tick);
      }
      return this;
    },
    // Jump to a value without animating (e.g. while dragging).
    set(next) {
      this.stop();
      target = next;
      state = { value: next, velocity: 0 };
      onUpdate?.(next);
      return this;
    },
    stop() {
      if (frame != null) cancelAnimationFrame(frame);
      frame = null;
      return this;
    },
  };
}
