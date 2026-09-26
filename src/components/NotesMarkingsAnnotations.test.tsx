import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import AddMarkingsModal from './AddMarkingsModal';
import Annotations from './Annotations';
import AnnotationsToolbar from './AnnotationsToolbar';
import ColorDialog from './ColorDialog';
import ColorPicker from './ColorPicker';
import Marking from './Marking';
import MarkupPopover from './MarkupPopover';
import Note from './Note';
import NoteColorOption from './NoteColorOption';
import NotesApi from '../api/notesApi';
import ThemeProvider from '../contexts/ThemeProvider';
import { PerformanceModeContext } from '../contexts/PerformanceModeProvider';
import type {
  PerformanceMode,
  PerformanceModeContextValue,
} from '../contexts/PerformanceModeProvider';
import AnnotationsToolbarProvider from '../contexts/AnnotationsToolbarProvider';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import type { AnnotationPath, Marking as MarkingModel } from '../types';

// Pins the behavior of the notes, markings, annotations and colour pickers
// converted to TypeScript in CAD-133.

vi.mock('../api/notesApi');

const createMarking = vi.fn();
const createMarkingOptions: { onSuccess?: (marking: MarkingModel) => void } =
  {};
vi.mock('../hooks/api/markings.hooks', () => ({
  useCreateMarking: (options: typeof createMarkingOptions) => {
    createMarkingOptions.onSuccess = options.onSuccess;
    return { isLoading: false, run: createMarking };
  },
  useUpdateMarking: () => ({ run: vi.fn() }),
  useDeleteMarking: () => ({ run: vi.fn() }),
}));

// Modal renders a dialog (not a bottom sheet) from the sm breakpoint up.
vi.mock('../hooks/useBreakPoints', () => ({
  default: () => ({ isSm: true }),
}));

// headlessui's Dialog can use ResizeObserver, which jsdom doesn't have.
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

function Providers({
  mode = 'perform',
  setMode = vi.fn(),
  children,
}: {
  mode?: PerformanceMode;
  setMode?: PerformanceModeContextValue['setMode'];
  children?: ReactNode;
}) {
  return (
    <ThemeProvider>
      <PerformanceModeContext.Provider value={{ mode, setMode }}>
        <AnnotationsToolbarProvider>{children}</AnnotationsToolbarProvider>
      </PerformanceModeContext.Provider>
    </ThemeProvider>
  );
}

/** A utensil's button label (the icons' svg titles hold the same words). */
function utensilLabel(name: string) {
  return screen.getByText(name, { selector: 'span' });
}

/** Shows the annotations toolbar's state as text. */
function ToolbarState() {
  const { color, strokeWidth, utensil } = useAnnotationsToolbar();
  return <output>{`${utensil} ${strokeWidth} ${color}`}</output>;
}

describe('Note', () => {
  const note = { id: 7, content: 'Slow down', color: 'blue', line_number: 2 };

  test('saves typed content 1200ms after the last change', () => {
    vi.useFakeTimers();
    const onUpdate = vi.fn();
    render(
      <Note songId={3} note={note} onDelete={vi.fn()} onUpdate={onUpdate} />
    );

    const textarea = screen.getByPlaceholderText('Type here');
    expect(textarea).toHaveValue('Slow down');
    expect(textarea.className).toContain('bg-blue-200');
    expect(textarea).toHaveAttribute('rows', '2');

    fireEvent.change(textarea, { target: { value: 'a\nb\nc' } });
    expect(textarea).toHaveAttribute('rows', '3');

    act(() => {
      vi.advanceTimersByTime(1199);
    });
    expect(NotesApi.update).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(NotesApi.update).toHaveBeenCalledWith(3, 7, { content: 'a\nb\nc' });
    // The debounced save calls onUpdate without the note's id.
    expect(onUpdate).toHaveBeenCalledWith({ content: 'a\nb\nc' });
    expect(onUpdate.mock.calls[0]).toHaveLength(1);
  });

  test('NoteColorOption passes its color to onClick', () => {
    const onClick = vi.fn();
    render(<NoteColorOption color="bg-pink-200" selected onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('ring-2');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith('bg-pink-200');
  });
});

describe('Marking', () => {
  const marking = {
    id: 5,
    marking_type: 'dynamics',
    content: 'mf',
    // Decimal strings, as the API sends them.
    x: '12.5',
    y: '30',
    scale: '1.5',
    rotation: '45',
  };

  test('reads its position, scale and rotation with parseFloat', () => {
    render(<Marking marking={marking} song={{ id: 3 }} onDeleted={vi.fn()} />);

    const text = screen.getByText('mf');
    expect(text.style.transform).toBe('rotate(45deg) scale(1.5)');
    expect(text.style.fontFamily).toBe('Times New Roman');
    expect(text.parentElement?.style.transform).toBe('translate(12.5px,30px)');
  });

  test('sets no font for markings other than dynamics', () => {
    render(
      <Marking
        marking={{ ...marking, marking_type: 'roadmap', content: '2X' }}
        song={{ id: 3 }}
        onDeleted={vi.fn()}
      />
    );
    expect(screen.getByText('2X').style.fontFamily).toBe('');
  });
});

describe('AddMarkingsModal', () => {
  test('creates the picked marking and reports it once saved', () => {
    const onClose = vi.fn();
    const onMarkingAdded = vi.fn();
    render(
      <AddMarkingsModal
        open
        onClose={onClose}
        onMarkingAdded={onMarkingAdded}
        song={{ id: 3 }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'pp' }));
    expect(createMarking).toHaveBeenCalledWith({
      marking: { content: 'pp', marking_type: 'dynamics' },
      songId: 3,
    });

    fireEvent.click(screen.getByRole('button', { name: 'LOUD' }));
    expect(createMarking).toHaveBeenLastCalledWith({
      marking: { content: 'LOUD', marking_type: 'volume' },
      songId: 3,
    });

    const created = { id: 9, marking_type: 'volume', content: 'LOUD' };
    act(() => createMarkingOptions.onSuccess?.(created));
    expect(onMarkingAdded).toHaveBeenCalledWith(created);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Annotations', () => {
  const path: AnnotationPath = {
    id: 1,
    path: 'M 1 2 L 3 4',
    color: 'rgba(0,0,0,1)',
    stroke_width: 4,
  };

  test('renders nothing without annotations', () => {
    const { container } = render(
      <Providers>
        <Annotations />
      </Providers>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('draws saved paths when performing', () => {
    const { container } = render(
      <Providers>
        <Annotations annotations={[path]} />
      </Providers>
    );
    const drawn = container.querySelector('path');
    expect(drawn).toHaveAttribute('d', 'M 1 2 L 3 4');
    expect(drawn).toHaveAttribute('stroke-width', '4');
    expect(drawn).toHaveAttribute('stroke', 'rgba(0,0,0,1)');
  });

  test('draws them on the canvas when annotating', () => {
    const { container } = render(
      <Providers mode="annotate">
        <Annotations annotations={[path]} />
      </Providers>
    );
    const svg = container.querySelector('svg');
    // AnnotationCanvas's svg (jsdom drops its touch-action style).
    expect(svg).toHaveClass('z-10');
    expect(container.querySelector('path')).toHaveAttribute('d', 'M 1 2 L 3 4');
  });
});

describe('AnnotationsToolbar', () => {
  test('renders nothing unless annotating', () => {
    const { container } = render(
      <Providers>
        <AnnotationsToolbar />
      </Providers>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('the highlighter and pen set the alpha and stroke width', () => {
    render(
      <Providers mode="annotate">
        <AnnotationsToolbar />
        <ToolbarState />
      </Providers>
    );
    const state = screen.getByRole('status');
    expect(state).toHaveTextContent('pen 2 rgba(0,0,0,1)');

    fireEvent.click(utensilLabel('highlighter'));
    expect(state).toHaveTextContent('highlighter 16 rgba(0,0,0,0.5)');

    // Clicking the current utensil changes nothing.
    fireEvent.click(utensilLabel('highlighter'));
    expect(state).toHaveTextContent('highlighter 16 rgba(0,0,0,0.5)');

    fireEvent.click(utensilLabel('pen'));
    expect(state).toHaveTextContent('pen 2 rgba(0,0,0,1)');

    fireEvent.click(utensilLabel('eraser'));
    expect(state).toHaveTextContent('eraser 2 rgba(0,0,0,1)');
  });

  test('MarkupPopover starts annotating', () => {
    const setMode = vi.fn();
    const onAddNote = vi.fn();
    render(
      <Providers setMode={setMode}>
        <MarkupPopover onAddNote={onAddNote} onShowMarkingsModal={vi.fn()} />
      </Providers>
    );
    // The popover's button, around the icon Button.
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getByText('Sticky note'));
    expect(onAddNote).toHaveBeenCalled();

    // The menu stays open.
    fireEvent.click(screen.getByText('Annotate'));
    expect(setMode).toHaveBeenCalledWith('annotate');
  });
});

describe('colour pickers', () => {
  test('ColorPicker confirms the staged color or cancels to its own', () => {
    const onChange = vi.fn();
    render(<ColorPicker color="rgba(1, 2, 3, 1)" onChange={onChange} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    // The popover's unlabelled button makes the staged color transparent.
    const makeTransparent = screen
      .getAllByRole('button')
      .find(button => button.className.includes('w-8 h-8'));
    if (!makeTransparent) throw new Error('No make-transparent button');

    fireEvent.click(makeTransparent);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onChange).toHaveBeenLastCalledWith('rgba(1, 2, 3, 1)');

    // The popover stays open.
    fireEvent.click(makeTransparent);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onChange).toHaveBeenLastCalledWith('rgba(255, 255, 255, 0)');
  });

  test('ColorDialog confirms the binder color unless another is picked', () => {
    const onChange = vi.fn();
    const onCloseDialog = vi.fn();
    const { rerender } = render(
      <ColorDialog
        open
        onCloseDialog={onCloseDialog}
        binderColor="blue"
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onChange).toHaveBeenLastCalledWith('blue');
    expect(onCloseDialog).toHaveBeenCalled();

    rerender(
      <ColorDialog
        open
        onCloseDialog={onCloseDialog}
        binderColor="blue"
        onChange={onChange}
      />
    );
    // The swatches are divs with the color's background class.
    const green = document.querySelector('.grid .bg-green-400');
    if (!green) throw new Error('No green swatch');
    fireEvent.click(green);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onChange).toHaveBeenLastCalledWith('green');
  });
});
