import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import setupStore from '../store/store';

export function renderWithProvider(
  component,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
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
