import { create } from 'zustand';
import { AppStore, Situation, DocumentInfo } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/documents';

export const useAppStore = create<AppStore>((set) => ({
  situation: 'exploring',
  personaRole: 'Software Engineer',
  personaCompany: 'Northstar Labs',
  selectedFocus: [],
  documents: [],

  setSituation: (situation) => set({ situation }),
  setFocus: (focus) => set({ selectedFocus: focus }),
  addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),
  loadSampleDocuments: () => set({ documents: SAMPLE_DOCUMENTS }),
  reset: () => set({
    situation: 'exploring',
    selectedFocus: [],
    documents: []
  })
}));
