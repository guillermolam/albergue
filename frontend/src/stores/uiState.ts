import { map } from 'nanostores';

export type Theme = 'light' | 'dark';

export interface ModalConfig {
  id: string;
  type?: 'confirm' | 'info' | 'form' | 'custom';
  data?: Record<string, any>;
}

export interface UIState {
  activeModal: ModalConfig | null;
  drawerOpen: boolean;
  sidebarCollapsed: boolean;
  theme: Theme;
  isMobileMenuOpen: boolean;
}

export const uiState = map<UIState>({
  activeModal: null,
  drawerOpen: false,
  sidebarCollapsed: false,
  theme: 'light',
  isMobileMenuOpen: false,
});

export const uiActions = {
  openModal(id: string, type: ModalConfig['type'] = 'info', data?: Record<string, any>) {
    uiState.setKey('activeModal', { id, type, data });
  },

  closeModal() {
    uiState.setKey('activeModal', null);
  },

  toggleDrawer() {
    uiState.setKey('drawerOpen', !uiState.get().drawerOpen);
  },

  closeDrawer() {
    uiState.setKey('drawerOpen', false);
  },

  toggleSidebar() {
    uiState.setKey('sidebarCollapsed', !uiState.get().sidebarCollapsed);
  },

  setSidebarCollapsed(collapsed: boolean) {
    uiState.setKey('sidebarCollapsed', collapsed);
  },

  setTheme(theme: Theme) {
    uiState.setKey('theme', theme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  toggleTheme() {
    const current = uiState.get().theme;
    uiActions.setTheme(current === 'light' ? 'dark' : 'light');
  },

  toggleMobileMenu() {
    uiState.setKey('isMobileMenuOpen', !uiState.get().isMobileMenuOpen);
  },

  closeMobileMenu() {
    uiState.setKey('isMobileMenuOpen', false);
  },
};

export default uiState;
