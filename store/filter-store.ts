// src/store/filter-store.ts
import { create } from "zustand"

interface FilterStore {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  sort: string
  page: number

  setSearch: (search: string) => void
  setCategory: (category: string) => void
  setPriceRange: (min: number, max: number) => void
  setSort: (sort: string) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  search: "",
  category: "",
  minPrice: 0,
  maxPrice: 10000,
  sort: "newest",
  page: 1,

  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 10000,
      sort: "newest",
      page: 1,
    }),
}))