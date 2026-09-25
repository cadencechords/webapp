import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupStore } from '../store/store';

export function renderWithProvider(
  component,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }) {
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

export function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
