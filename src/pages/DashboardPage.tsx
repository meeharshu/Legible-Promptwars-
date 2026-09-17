import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { generateInsights, generateDifferences, generateInconsistencies, generateNextSteps, generateSuggestedQuestions } from '../lib/demo-engine';
import { FileText, ChevronDown, CheckCircle, AlertCircle, FileDiff, Sparkles, MessageSquare, ClipboardList, HelpCircle, ArrowRight, Printer, Copy } from 'lucide-react';

export function DashboardPage() {
  const store = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const insights = useMemo(() => generateInsights(store), [store]);
  const diffs = useMemo(() => generateDifferences(store), [store]);
  const inconsistencies = useMemo(() => generateInconsistencies(store), [store]);
  const steps = useMemo(() => generateNextSteps(store), [store]);
  const questions = useMemo(() => generateSuggestedQuestions(store), [store]);

  const situationLabel = {
    'before_signing': 'About to sign',
    'comparing': 'Comparing agreements',
    'resigning': 'Thinking about resigning',
    'issue': 'Responding to an issue',
    'lawyer': 'Preparing for a lawyer',
    'exploring': 'Exploring documents'
  }[store.situation];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight">
            <div className="w-5 h-5 bg-neutral-900 rounded-sm flex items-center justify-center">
              <span className="text-[#FDFBF7] text-[10px] font-sans font-bold">L</span>
            </div>
            Legible
          </div>
          <div className="h-4 w-px bg-neutral-200"></div>
          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-1.5 text-neutral-900 font-medium hover:bg-neutral-50 px-2 py-1 rounded transition-colors group">
              <span className="text-neutral-500 font-normal">Situation:</span> {situationLabel} 
              <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900" />
            </button>
            <div className="text-neutral-400">•</div>
            <div className="text-neutral-600">{store.personaRole}</div>
            <div className="text-neutral-400">•</div>
            <div className="text-neutral-600 font-medium flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {store.documents.length} documents</div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-neutral-200 p-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 mt-4 px-3">Analysis</div>
          <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Sparkles className="w-4 h-4" />}>Overview</NavButton>
          <NavButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<CheckCircle className="w-4 h-4" />}>Important ({insights.length})</NavButton>
          <NavButton active={activeTab === 'changes'} onClick={() => setActiveTab('changes')} icon={<FileDiff className="w-4 h-4" />}>Changes ({diffs.length})</NavButton>
          <NavButton active={activeTab === 'inconsistencies'} onClick={() => setActiveTab('inconsistencies')} icon={<AlertCircle className="w-4 h-4" />}>Conflicts ({inconsistencies.length})</NavButton>
          
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 mt-6 px-3">Action</div>
          <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare className="w-4 h-4" />}>Ask Legible</NavButton>
          <NavButton active={activeTab === 'questions'} onClick={() => setActiveTab('questions')} icon={<HelpCircle className="w-4 h-4" />}>Questions ({questions.length})</NavButton>
          <NavButton active={activeTab === 'steps'} onClick={() => setActiveTab('steps')} icon={<CheckCircle className="w-4 h-4" />}>Next steps</NavButton>
          <NavButton active={activeTab === 'brief'} onClick={() => setActiveTab('brief')} icon={<ClipboardList className="w-4 h-4" />}>Lawyer Brief</NavButton>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-serif mb-8 text-neutral-900">Your legal situation at a glance</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center">
                    <div className="text-3xl font-serif text-neutral-900 mb-1">{store.documents.length}</div>
                    <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Documents</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-serif text-emerald-900 mb-1">{insights.length}</div>
                    <div className="text-xs text-emerald-700 font-medium uppercase tracking-wider">Relevant Areas</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-serif text-amber-900 mb-1">{diffs.length}</div>
                    <div className="text-xs text-amber-700 font-medium uppercase tracking-wider">Changes</div>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-serif text-red-900 mb-1">{inconsistencies.length}</div>
                    <div className="text-xs text-red-700 font-medium uppercase tracking-wider">Conflicts</div>
                  </div>
                </div>

                <h2 className="text-2xl font-serif mb-6 text-neutral-900">What matters right now</h2>
                <div className="grid gap-4">
                  {insights.map(insight => (
                    <div key={insight.id} onClick={() => setActiveTab('insights')} className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded uppercase tracking-wider">{insight.title}</div>
                        <ArrowRight className="w-4 h-4 text-neutral-300" />
                      </div>
                      <div className="text-xl font-medium text-neutral-900 mb-2">{insight.summary}</div>
                      <div className="text-sm text-neutral-500">Source: {insight.sources[0]?.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-serif mb-8 text-neutral-900">What deserves your attention</h1>
                <div className="space-y-6">
                  {insights.map(insight => (
                    <div key={insight.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h3 className="text-2xl font-medium text-neutral-900 mb-4">{insight.title}</h3>
                      <div className="mb-6">
                        <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Why this matters</div>
                        <p className="text-neutral-700 leading-relaxed">{insight.explanation}</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Sources</div>
                        {insight.sources.map((src, i) => (
                          <div key={i} className="flex justify-between items-center mb-2 last:mb-0">
                            <div className="text-sm text-neutral-600 font-medium">{src.label}</div>
                            <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100 transition-colors">
                              View Source
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'changes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-serif mb-8 text-neutral-900">What changed?</h1>
                <div className="space-y-6">
                  {diffs.map(diff => (
                    <div key={diff.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h3 className="text-xl font-medium text-neutral-900 mb-6">{diff.title}</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                          <div className="text-xs font-medium text-red-600 uppercase tracking-wider mb-2">Original • {diff.originalSource.label}</div>
                          <div className="text-neutral-700 line-through opacity-70">{diff.originalText}</div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">Current • {diff.currentSource.label}</div>
                          <div className="text-neutral-900 font-medium">{diff.currentText}</div>
                        </div>
                      </div>

                      <div className="text-sm text-neutral-600 mb-4">
                        <span className="font-medium text-neutral-900">What changed:</span> {diff.explanation}
                      </div>
                      <div className="text-sm text-neutral-600">
                        <span className="font-medium text-neutral-900">Why it matters:</span> {diff.whyItMatters}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'inconsistencies' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-serif mb-8 text-neutral-900">Things that may need clarification</h1>
                <div className="space-y-6">
                  {inconsistencies.map(inc => (
                    <div key={inc.id} className="bg-white border border-red-200 rounded-xl p-6 shadow-sm shadow-red-50">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="text-xl font-medium text-neutral-900">{inc.title}</h3>
                      </div>
                      
                      <div className="grid gap-3 mb-6">
                        {inc.sources.map((src, i) => (
                          <div key={i} className="flex gap-4 p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                            <div className="w-32 flex-shrink-0 text-sm font-medium text-neutral-600">{src.label}</div>
                            <div className="text-sm text-neutral-900">"{src.text}"</div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-1">What is unclear</div>
                        <p className="text-neutral-700">{inc.unclearDescription}</p>
                      </div>

                      <div className="bg-neutral-900 text-white p-4 rounded-lg">
                        <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Suggested question to ask</div>
                        <div className="font-medium">"{inc.suggestedQuestion}"</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
                <h1 className="text-4xl font-serif mb-2 text-neutral-900">Ask Legible</h1>
                <p className="text-neutral-600 mb-8 text-lg">Ask about the documents you're reviewing.</p>
                
                <div className="flex-1 bg-white border border-neutral-200 rounded-xl flex flex-col overflow-hidden h-[500px]">
                  <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div className="flex justify-end">
                      <div className="bg-neutral-100 text-neutral-900 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                        What happens if I resign?
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[#FDFBF7] text-xs font-sans font-bold">L</span>
                      </div>
                      <div className="bg-white border border-neutral-200 text-neutral-900 p-5 rounded-2xl rounded-tl-sm max-w-[85%]">
                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Based on your documents</div>
                        <p className="mb-3">Several provisions are relevant to resignation.</p>
                        
                        <div className="mb-2"><strong className="font-medium">Notice:</strong> The current agreement states a 60-day notice period.</div>
                        <div className="mb-2"><strong className="font-medium">Confidentiality:</strong> The NDA describes continuing confidentiality obligations.</div>
                        <div className="mb-2"><strong className="font-medium">Company property:</strong> The agreement describes return obligations when employment ends.</div>
                        <div className="mb-4"><strong className="font-medium">Post-employment provisions:</strong> Relevant restrictions appear in the revised agreement.</div>

                        <div className="bg-neutral-50 rounded p-3 text-sm text-neutral-600">
                          <div className="font-medium text-neutral-900 mb-1">Sources</div>
                          <div>• Employment Agreement · Section 9.1</div>
                          <div>• NDA · Section 4</div>
                          <div>• Employment Agreement · Section 11</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-neutral-200 bg-neutral-50">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Type a question... (Demo interaction)" 
                        className="w-full bg-white border border-neutral-200 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        readOnly
                      />
                      <button className="absolute right-2 top-1.5 w-9 h-9 bg-neutral-900 text-white rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'questions' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-serif mb-8 text-neutral-900">Questions to ask</h1>
                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 flex items-center justify-between group hover:border-neutral-400 transition-colors">
                      <div className="font-medium text-neutral-900 text-lg">{q}</div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'steps' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-serif mb-8 text-neutral-900">What you can do next</h1>
                <div className="space-y-4">
                  {steps.map(step => (
                    <div key={step.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h3 className="text-xl font-medium text-neutral-900 mb-2">{step.title}</h3>
                      <div className="text-neutral-900 font-medium mb-1">{step.action}</div>
                      <div className="text-neutral-600">{step.description}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'brief' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-4xl font-serif text-neutral-900">Prepare for a lawyer</h1>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 bg-white rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium">
                      <Printer className="w-4 h-4" /> Print brief
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-8 lg:p-12 shadow-sm font-serif">
                  <div className="text-center border-b border-neutral-200 pb-8 mb-8">
                    <h2 className="text-3xl font-medium text-neutral-900 mb-2">Legal Context Brief</h2>
                    <div className="text-neutral-500 font-sans">Generated by Legible</div>
                  </div>

                  <div className="space-y-8 font-sans">
                    <section>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Situation</h3>
                      <div className="text-lg text-neutral-900 font-medium">{situationLabel}</div>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Documents Reviewed</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        {store.documents.map(d => <li key={d.id}>{d.title}</li>)}
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Important Provisions Identified</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        {insights.map(i => <li key={i.id}>{i.title} — {i.summary}</li>)}
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Key Changes</h3>
                      <div className="text-neutral-700 mb-2">{diffs.length} meaningful changes found across document versions.</div>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Potential Inconsistencies</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        {inconsistencies.map(i => <li key={i.id}>{i.title}</li>)}
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Questions for Counsel</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                        {questions.map((q, i) => <li key={i}>{q}</li>)}
                      </ul>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, children }: { active: boolean, onClick: () => void, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors ${
        active 
          ? 'bg-neutral-100 text-neutral-900' 
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
      }`}
    >
      <div className={active ? 'text-neutral-900' : 'text-neutral-400'}>{icon}</div>
      {children}
    </button>
  );
}
