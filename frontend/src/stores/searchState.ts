import { writable } from '@nanostores/persistent';
import { computed } from '@nanostores/lite';

export interface SearchFilters {
  [key: string]: string | string[] | boolean | null;
}

export interface SearchState {
  searchTerm: string;
  filters: SearchFilters;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

const DEFAULT_STATE: SearchState = {
  searchTerm: '',
  filters: {},
  sortBy: '',
  sortDir: 'asc',
  page: 1,
  pageSize: 10,
};

export const searchState = writable<SearchState>(DEFAULT_STATE, {
  key: 'albergue-search-state',
});

export const searchActions = {
  setSearchTerm(term: string) {
    searchState.set({ ...searchState.get(), searchTerm: term, page: 1 });
  },

  setFilter(key: string, value: string | string[] | boolean | null) {
    const state = searchState.get();
    const filters = { ...state.filters, [key]: value };
    searchState.set({ ...state, filters, page: 1 });
  },

  clearFilters() {
    const state = searchState.get();
    searchState.set({ ...state, filters: {}, page: 1 });
  },

  setSort(sortBy: string, sortDir: 'asc' | 'desc' = 'asc') {
    searchState.set({ ...searchState.get(), sortBy, sortDir });
  },

  setPage(page: number) {
    searchState.set({ ...searchState.get(), page });
  },

  setPageSize(size: number) {
    searchState.set({ ...searchState.get(), pageSize: size, page: 1 });
  },

  reset() {
    searchState.set(DEFAULT_STATE);
  },
};

export const filteredCount = computed(searchState, (s) => s.searchTerm.length);

export default searchState;
