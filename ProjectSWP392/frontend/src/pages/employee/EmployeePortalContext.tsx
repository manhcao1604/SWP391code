import { createContext, useContext } from 'react';
import type { EmployeePortalResponse } from '../../api';

interface EmployeePortalContextValue {
  portal: EmployeePortalResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export const EmployeePortalContext = createContext<EmployeePortalContextValue>({
  portal: null,
  loading: true,
  error: null,
  reload: async () => {},
});

export function useEmployeePortal() {
  return useContext(EmployeePortalContext);
}
