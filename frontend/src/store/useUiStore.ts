import { create } from 'zustand';

interface ToastState {
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
}

interface UiStore {
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  toast: ToastState;
  showToast: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isProfileModalOpen: false,
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),
  toast: { message: '', severity: 'info', open: false },
  showToast: (message, severity = 'info') => 
    set({ toast: { message, severity, open: true } }),
  hideToast: () => 
    set((state) => ({ toast: { ...state.toast, open: false } })),
}));
