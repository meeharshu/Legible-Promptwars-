export type Situation = 
  | 'before_signing'
  | 'comparing'
  | 'resigning'
  | 'issue'
  | 'lawyer'
  | 'exploring';

export interface DocumentInfo {
  id: string;
  title: string;
  summary: string;
  type: string;
  content: string; // The full text or sections
  sections: DocumentSection[];
}

export interface DocumentSection {
  id: string;
  documentId: string;
  title: string;
  text: string;
  page?: number;
  tags: string[]; // 'notice', 'ip', 'compensation', 'termination', etc.
}

export interface ProvisionInsight {
  id: string;
  title: string;
  relevance: 'high' | 'medium' | 'low';
  summary: string;
  explanation: string;
  sources: { documentId: string; sectionId: string; label: string; text: string; }[];
  tags: string[];
}

export interface DocumentDifference {
  id: string;
  title: string;
  originalText: string;
  currentText: string;
  explanation: string;
  whyItMatters: string;
  originalSource: { documentId: string; sectionId: string; label: string; };
  currentSource: { documentId: string; sectionId: string; label: string; };
  tags: string[];
}

export interface Inconsistency {
  id: string;
  title: string;
  explanation: string;
  unclearDescription: string;
  suggestedQuestion: string;
  sources: { documentId: string; sectionId: string; label: string; text: string; }[];
  tags: string[];
}

export interface NextStep {
  id: string;
  title: string;
  action: string;
  description: string;
}

export interface ContextState {
  situation: Situation;
  personaRole: string;
  personaCompany: string;
  selectedFocus: string[];
  documents: DocumentInfo[];
}

export interface AppStore extends ContextState {
  setSituation: (situation: Situation) => void;
  setFocus: (focus: string[]) => void;
  addDocument: (doc: DocumentInfo) => void;
  loadSampleDocuments: () => void;
  reset: () => void;
}
