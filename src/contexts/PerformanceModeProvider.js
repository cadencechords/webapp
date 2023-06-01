import React, { createContext, useState } from 'react';
import { performanceModes } from '../utils/constants';

export const PerformanceModeContext = createContext();

export default function PerformanceModeProvider(props) {
  const [mode, setMode] = useState(performanceModes.PERFORM);

  return (
    <PerformanceModeContext.Provider {...props} value={{ mode, setMode }} />
  );
}
