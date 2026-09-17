import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Navigate } from 'react-router-dom';
import { AlertCircle, MessageSquare, Briefcase, GitCompare, Compass } from 'lucide-react';
import { AnalyzedClause, analyzeDocumentContext, UserContext } from '../lib/context-engine';
import { cn } from '../lib/utils';
import { DocumentViewer } from '../components/DocumentViewer';

import { ClauseDetailView } from '../components/dashboard/ClauseDetailView';
import { ChatView } from '../components/dashboard/ChatView';
import { CommitmentsView } from '../components/dashboard/CommitmentsView';
import { CompareView } from '../components/dashboard/CompareView';
import { NextStepsView } from '../components/dashboard/NextStepsView';
import { Section } from '../components/dashboard/Section';

type TabType = 'attention' | 'ask' | 'commitments' | 'compare' | 'nextsteps';

export function DashboardPage() {
  const { userContext, setUserContext, clauses, setClauses, selectedClause, setSelectedClause } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('attention');

  if (!userContext || !clauses.length) {
    return <Navigate to="/" />;
  }

  const highAttention = clauses.filter(c => c.attention === 'high');
  const mediumAttention = clauses.filter(c => c.attention === 'medium');
  const lowAttention = clauses.filter(c => c.attention === 'low');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'attention') {
      setSelectedClause(null);
    }
  }

  return (
    <div className="h-screen bg-neutral-50 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex flex-col z-20 shrink-0">
        <div className="p-6 border-b border-neutral-200 flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
             <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-lg leading-tight">Legible</h2>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">{userContext.role}</p>
          </div>
        </div>
        
        <div className="p-4 flex-1 space-y-1 overflow-y-auto">
          <NavItem active={activeTab === 'attention'} onClick={() => handleTabChange('attention')} icon={<AlertCircle className="w-4 h-4"/>} label="Attention Map" />
          <NavItem active={activeTab === 'commitments'} onClick={() => handleTabChange('commitments')} icon={<Briefcase className="w-4 h-4"/>} label="Commitments" />
          <NavItem active={activeTab === 'ask'} onClick={() => handleTabChange('ask')} icon={<MessageSquare className="w-4 h-4"/>} label="Ask Legible" />
          <NavItem active={activeTab === 'compare'} onClick={() => handleTabChange('compare')} icon={<GitCompare className="w-4 h-4"/>} label="Compare" />
          <NavItem active={activeTab === 'nextsteps'} onClick={() => handleTabChange('nextsteps')} icon={<Compass className="w-4 h-4"/>} label="Next Steps" />
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
          <div className="bg-white rounded-lg p-3 border border-neutral-200 shadow-sm">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Change Scenario</h4>
            <select 
              className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-2 text-sm font-medium text-neutral-800 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition-all cursor-pointer"
              value={userContext.intent}
              onChange={(e) => {
                const newContext = { ...userContext, intent: e.target.value };
                setUserContext(newContext);
                const newClauses = analyzeDocumentContext(newContext, clauses);
                setClauses(newClauses);
                setActiveTab('attention');
                setSelectedClause(null);
              }}
            >
              <option value="sign">About to sign</option>
              <option value="current">Already employed</option>
              <option value="resign">Thinking about resigning</option>
              <option value="hr">Discussing with HR</option>
              <option value="lawyer">Preparing for a lawyer</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left/Middle Pane: Analysis */}
        <div className={cn(
          "flex-1 h-full overflow-y-auto bg-neutral-50 transition-all duration-500",
          selectedClause ? "lg:max-w-[55%]" : "w-full"
        )}>
          {selectedClause ? (
            <ClauseDetailView clause={selectedClause} onBack={() => setSelectedClause(null)} />
          ) : (
            <div className="p-8 lg:p-12 max-w-4xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
              {activeTab === 'attention' && (
                <>
                  <header className="mb-10">
                    {userContext.intent === 'resign' ? (
                      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">If you're thinking about resigning</h1>
                    ) : (
                      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">What deserves your attention</h1>
                    )}
                    <p className="text-neutral-500 text-lg">
                      Prioritized based on your role as a <span className="font-semibold text-neutral-700">{userContext.role}</span> and your specific situation.
                    </p>
                  </header>

                  <div className="space-y-12">
                    <Section title="🔴 High attention" items={highAttention} onSelect={setSelectedClause} />
                    <Section title="🟠 Worth reviewing" items={mediumAttention} onSelect={setSelectedClause} />
                    <Section title="🟢 Informational" items={lowAttention} onSelect={setSelectedClause} />
                  </div>
                </>
              )}

              {activeTab === 'ask' && <ChatView />}
              {activeTab === 'commitments' && <CommitmentsView clauses={clauses} />}
              {activeTab === 'compare' && <CompareView />}
              {activeTab === 'nextsteps' && <NextStepsView userContext={userContext} />}
            </div>
          )}
        </div>

        {/* Right Pane: Document Viewer (Hidden on mobile unless selected) */}
        <div className={cn(
          "hidden lg:block h-full transition-all duration-500 shrink-0",
          selectedClause ? "w-[45%]" : "w-0 opacity-0 overflow-hidden"
        )}>
          <DocumentViewer />
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn("w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200", active ? "bg-neutral-900 text-white shadow-md" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
