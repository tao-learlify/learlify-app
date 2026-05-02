import { createContext, useContext } from 'react';
import type { UnitProgressAPI } from './useUnitProgress';

export const UnitProgressContext = createContext<UnitProgressAPI | null>(null);

export function useUnitProgressContext(): UnitProgressAPI {
  const ctx = useContext(UnitProgressContext);
  if (!ctx) {
    throw new Error(
      'useUnitProgressContext must be used inside <UnitProgressContext.Provider>',
    );
  }
  return ctx;
}
