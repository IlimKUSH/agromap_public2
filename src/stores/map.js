import { create } from 'zustand'

export const useMapStore = create()((set, get) => ({
  region: null,
  districts: null,
  getRegion: () => {
    return get().region
  },
  getDistricts: () => {
    return get().districts
  },
  setDistricts: (districts) => set(() => ({ districts: districts })),
  setRegion: (region) => set(() => ({ region: region })),
  clear: () => set(() => () => ({ region: null })),
}))
