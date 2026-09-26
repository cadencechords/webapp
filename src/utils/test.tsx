import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupStore, type AppStore, type RootState } from '../store/store';

/** T with every field optional, at any depth. */
export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export interface RenderWithProviderOptions extends Omit<
  RenderOptions,
  'queries' | 'wrapper'
> {
  /** Only the state the test reads, e.g. `{ auth: { currentUser: { id: 1 } } }`. */
  preloadedState?: DeepPartial<RootState>;
  /** Defaults to a fresh store holding `preloadedState`. */
  store?: AppStore;
}

export function renderWithProvider(
  component: ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    // `as`: a fixture fills in only the fields its test reads. The store
    // holds it as given, and the components under test read only those.
    store = setupStore(preloadedState as Partial<RootState>),
    ...renderOptions
  }: RenderWithProviderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { children?: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function delay(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}
