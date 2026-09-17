import { create } from 'zustand';
import { AppStore, Situation, DocumentInfo } from '../types';
import { SAMPLE_DOCUMENTS, PRESET_SCENARIOS } from '../data/documents';

export const useAppStore = create<AppStore>((set) => ({
  situation: 'resigning',
  personaRole: 'Staff Software Engineer',
  personaCompany: 'Northstar Labs',
  selectedFocus: ['Notice', 'Intellectual property', 'Side projects', 'Restrictions after leaving'],
  documents: SAMPLE_DOCUMENTS,
  customConcern: '',

  setSituation: (situation: Situation) => set({ situation }),
  setFocus: (focus: string[]) => set({ selectedFocus: focus }),
  setCustomConcern: (concern: string) => set({ customConcern: concern }),
  setPersona: (role: string, company: string) => set({ personaRole: role, personaCompany: company }),
  
  addDocument: (doc: DocumentInfo) => set((state) => ({ 
    documents: [...state.documents, doc] 
  })),

  removeDocument: (docId: string) => set((state) => ({
    documents: state.documents.filter(d => d.id !== docId)
  })),

  setDocuments: (docs: DocumentInfo[]) => set({ documents: docs }),

  loadSampleDocuments: (scenarioIndex: number = 0) => {
    const scenario = PRESET_SCENARIOS[scenarioIndex] || PRESET_SCENARIOS[0];
    set({
      documents: scenario.documents,
      personaRole: scenario.role,
      personaCompany: scenario.company,
      situation: scenario.defaultSituation,
      selectedFocus: scenario.defaultFocus
    });
  },

  reset: () => set({
    situation: 'exploring',
    personaRole: 'Employee',
    personaCompany: 'Company',
    selectedFocus: [],
    documents: [],
    customConcern: ''
  })
}));
