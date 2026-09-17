import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserContext, AnalyzedClause } from './context-engine';

interface AppState {
  userContext: UserContext | null;
  setUserContext: (ctx: UserContext) => void;
  documentName: string | null;
  setDocumentName: (name: string) => void;
  documentText: string | null;
  setDocumentText: (text: string) => void;
  clauses: AnalyzedClause[];
  setClauses: (clauses: AnalyzedClause[]) => void;
  isProcessing: boolean;
  setIsProcessing: (status: boolean) => void;
  selectedClause: AnalyzedClause | null;
  setSelectedClause: (clause: AnalyzedClause | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [clauses, setClauses] = useState<AnalyzedClause[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClause, setSelectedClause] = useState<AnalyzedClause | null>(null);

  return (
    <AppContext.Provider
      value={{
        userContext,
        setUserContext,
        documentName,
        setDocumentName,
        documentText,
        setDocumentText,
        clauses,
        setClauses,
        isProcessing,
        setIsProcessing,
        selectedClause,
        setSelectedClause
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
