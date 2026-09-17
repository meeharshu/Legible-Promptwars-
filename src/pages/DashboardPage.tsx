import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { 
  generateInsights, generateDifferences, generateInconsistencies, 
  generateNextSteps, generateSuggestedQuestions, answerQuestionLocally 
} from '../lib/demo-engine';
import { 
  FileText, ChevronDown, CheckCircle, AlertCircle, FileDiff, 
  Sparkles, MessageSquare, ClipboardList, HelpCircle, ArrowRight, 
  ArrowLeft, Printer, Copy, Check, ExternalLink, X, Send, BookOpen, Layers
} from 'lucide-react';
import { Situation } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const store = useAppStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSituationDropdownOpen, setIsSituationDropdownOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  
  // Slide-over modal state for viewing verbatim document source
  const [viewingSource, setViewingSource] = useState<{ label: string; text: string; docTitle?: string } | null>(null);

  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; sources?: string[] }>>([
    {
      sender: 'user',
      text: 'What happens if I resign?'
    },
    {
      sender: 'assistant',
      text: 'When considering resignation, several provisions in your documents are directly relevant:\n\n• **Notice Requirement**: The revised agreement specifies a **60-day notice period**, conflicting with the original 30-day offer.\n• **Side Project IP**: Section 6 contains broad IP restrictions on outside software.\n• **Property Surrender**: All laptops and access credentials must be returned within 48 hours.\n• **Restrictive Covenants**: You are subject to a 12-month non-solicitation covenant.',
      sources: [
        'Employment Agreement — Revised · Section 9.1',
        'Offer Letter · Notice Clause',
        'Company Policy Handbook · Section 3'
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const insights = useMemo(() => generateInsights(store), [store]);
  const diffs = useMemo(() => generateDifferences(store), [store]);
  const inconsistencies = useMemo(() => generateInconsistencies(store), [store]);
  const steps = useMemo(() => generateNextSteps(store), [store]);
  const questions = useMemo(() => generateSuggestedQuestions(store), [store]);

  const situationLabel: Record<Situation, string> = {
    'before_signing': 'Reviewing before signing',
    'comparing': 'Comparing two versions',
    'resigning': 'Thinking about resigning',
    'issue': 'Responding to an issue',
    'lawyer': 'Preparing for a lawyer',
    'exploring': 'Exploring documents'
  };

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || chatInput;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    const response = answerQuestionLocally(q, store);
    const assistantMsg = { 
      sender: 'assistant' as const, 
      text: response.answer, 
      sources: response.sources 
    };

    setChatMessages(prev => [...prev, userMsg, assistantMsg]);
    if (!textToSend) setChatInput('');
  };

  const handleCopyBrief = () => {
    const briefText = `LEGIBLE LEGAL CONTEXT BRIEF
===========================
Client / Role: ${store.personaRole} (${store.personaCompany})
Situation: ${situationLabel[store.situation]}
Documents Analyzed: ${store.documents.map(d => d.title).join(', ')}

KEY PROVISIONS & RISKS:
${insights.map(i => `• ${i.title}: ${i.summary}\n  ${i.explanation}`).join('\n\n')}

DISCREPANCIES & CHANGES:
${diffs.map(d => `• ${d.title}: Changed from "${d.originalText}" to "${d.currentText}"\n  Why it matters: ${d.whyItMatters}`).join('\n\n')}

POTENTIAL CONFLICTS:
${inconsistencies.map(inc => `• ${inc.title}\n  Clarification Needed: ${inc.unclearDescription}\n  Suggested Question: ${inc.suggestedQuestion}`).join('\n\n')}

RECOMMENDED QUESTIONS FOR COUNSEL:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;

    navigator.clipboard.writeText(briefText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans selection:bg-neutral-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied to clipboard successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/onboarding')} 
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
            title="Return to setup to change documents or focus"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">New Analysis</span>
          </button>

          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight cursor-pointer"
          >
            <div className="w-5 h-5 bg-neutral-900 rounded-sm flex items-center justify-center">
              <span className="text-[#FDFBF7] text-[10px] font-sans font-bold">L</span>
            </div>
            Legible
          </div>

          <div className="h-4 w-px bg-neutral-200 hidden md:block"></div>

          {/* Interactive Situation Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsSituationDropdownOpen(!isSituationDropdownOpen)}
              className="flex items-center gap-1.5 text-xs md:text-sm font-medium bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full transition-colors text-neutral-800"
            >
              <span className="text-neutral-400 font-normal">Context:</span> 
              <span className="font-semibold text-neutral-900">{situationLabel[store.situation]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {isSituationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 z-30 space-y-1">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1">
                  Switch Situation View
                </div>
                {(['resigning', 'comparing', 'before_signing', 'lawyer', 'issue', 'exploring'] as Situation[]).map(sit => (
                  <button
                    key={sit}
                    onClick={() => {
                      store.setSituation(sit);
                      setIsSituationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      store.situation === sit ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{situationLabel[sit]}</span>
                    {store.situation === sit && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-500">
            <span>•</span>
            <span className="font-medium text-neutral-700">{store.personaRole}</span>
            <span>@</span>
            <span className="font-medium text-neutral-700">{store.personaCompany}</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('docs')}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>{store.documents.length} Docs Linked</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-56 md:w-64 bg-white border-r border-neutral-200 p-3 md:p-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 px-3">
            Synthesis
          </div>
          <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Sparkles className="w-4 h-4" />}>
            Executive Overview
          </NavButton>
          <NavButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}>
            Important ({insights.length})
          </NavButton>
          <NavButton active={activeTab === 'changes'} onClick={() => setActiveTab('changes')} icon={<FileDiff className="w-4 h-4 text-amber-600" />}>
            Changes ({diffs.length})
          </NavButton>
          <NavButton active={activeTab === 'inconsistencies'} onClick={() => setActiveTab('inconsistencies')} icon={<AlertCircle className="w-4 h-4 text-red-600" />}>
            Conflicts ({inconsistencies.length})
          </NavButton>

          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 mt-5 px-3">
            Action & Counsel
          </div>
          <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare className="w-4 h-4" />}>
            Ask Legible
          </NavButton>
          <NavButton active={activeTab === 'questions'} onClick={() => setActiveTab('questions')} icon={<HelpCircle className="w-4 h-4" />}>
            Questions ({questions.length})
          </NavButton>
          <NavButton active={activeTab === 'steps'} onClick={() => setActiveTab('steps')} icon={<CheckCircle className="w-4 h-4" />}>
            Next Steps
          </NavButton>
          <NavButton active={activeTab === 'brief'} onClick={() => setActiveTab('brief')} icon={<ClipboardList className="w-4 h-4 text-neutral-900" />}>
            Lawyer Brief
          </NavButton>

          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 mt-5 px-3">
            Evidence
          </div>
          <NavButton active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} icon={<BookOpen className="w-4 h-4" />}>
            Linked Documents ({store.documents.length})
          </NavButton>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <div className="max-w-3xl mx-auto">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl md:text-4xl font-serif text-neutral-900">
                    Your situation at a glance
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full">
                    {situationLabel[store.situation]}
                  </span>
                </div>
                <p className="text-neutral-600 mb-8 text-sm md:text-base">
                  Filtered cross-document intelligence for {store.personaRole} at {store.personaCompany}.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
                  <div 
                    onClick={() => setActiveTab('docs')}
                    className="bg-white border border-neutral-200 rounded-xl p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors"
                  >
                    <div className="text-3xl font-serif text-neutral-900 mb-0.5">{store.documents.length}</div>
                    <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Documents</div>
                  </div>
                  <div 
                    onClick={() => setActiveTab('insights')}
                    className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-100/60 transition-colors"
                  >
                    <div className="text-3xl font-serif text-emerald-950 mb-0.5">{insights.length}</div>
                    <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">Key Provisions</div>
                  </div>
                  <div 
                    onClick={() => setActiveTab('changes')}
                    className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center cursor-pointer hover:bg-amber-100/60 transition-colors"
                  >
                    <div className="text-3xl font-serif text-amber-950 mb-0.5">{diffs.length}</div>
                    <div className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">Modifications</div>
                  </div>
                  <div 
                    onClick={() => setActiveTab('inconsistencies')}
                    className="bg-red-50/80 border border-red-200 rounded-xl p-4 text-center cursor-pointer hover:bg-red-100/60 transition-colors"
                  >
                    <div className="text-3xl font-serif text-red-950 mb-0.5">{inconsistencies.length}</div>
                    <div className="text-[11px] text-red-800 font-semibold uppercase tracking-wider">Conflicts</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-serif text-neutral-900">
                    Highest Priority Attention Points
                  </h2>
                  <span className="text-xs text-neutral-400">Click card for detail</span>
                </div>

                <div className="grid gap-4 mb-8">
                  {insights.map(insight => (
                    <div 
                      key={insight.id} 
                      onClick={() => setActiveTab('insights')} 
                      className="bg-white border border-neutral-200 rounded-xl p-5 md:p-6 hover:border-neutral-400 hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {insight.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                      </div>
                      <div className="text-lg md:text-xl font-medium text-neutral-900 mb-1.5">
                        {insight.summary}
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                        {insight.explanation}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Source: {insight.sources[0]?.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Action callout */}
                <div className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                      Ready for next step
                    </div>
                    <div className="text-base font-medium">Export One-Page Brief for Legal Counsel</div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('brief')}
                    className="bg-white text-neutral-900 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    View Lawyer Brief <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* INSIGHTS TAB */}
            {activeTab === 'insights' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900">
                  What deserves your attention
                </h1>
                <p className="text-neutral-600 mb-8 text-sm">
                  Specific commitments, obligations, and restrictions relevant to "{situationLabel[store.situation]}".
                </p>

                <div className="space-y-5">
                  {insights.map(insight => (
                    <div key={insight.id} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-serif font-medium text-neutral-900">{insight.title}</h3>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                          {insight.relevance} Relevance
                        </span>
                      </div>
                      
                      <div className="text-base font-medium text-neutral-900 mb-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        {insight.summary}
                      </div>

                      <div className="mb-5">
                        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                          Contextual Impact
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed">{insight.explanation}</p>
                      </div>

                      <div className="bg-[#FDFBF7] rounded-lg p-3.5 border border-neutral-200/70">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
                          Verifiable Citations ({insight.sources.length})
                        </div>
                        {insight.sources.map((src, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded border border-neutral-200/80 mb-1.5 last:mb-0">
                            <div className="text-xs text-neutral-800 font-medium flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{src.label}</span>
                            </div>
                            <button 
                              onClick={() => setViewingSource({ label: src.label, text: src.text })}
                              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 transition-colors self-start sm:self-auto flex items-center gap-1"
                            >
                              View Source Clause <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CHANGES TAB */}
            {activeTab === 'changes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900">
                  What changed between documents?
                </h1>
                <p className="text-neutral-600 mb-8 text-sm">
                  Detecting stealth additions, modified durations, and updated covenants across your contract timeline.
                </p>

                <div className="space-y-6">
                  {diffs.map(diff => (
                    <div key={diff.id} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-serif font-medium text-neutral-900">{diff.title}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase tracking-wider">
                          Modified
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-3 mb-5">
                        <div className="bg-red-50/70 border border-red-200 rounded-lg p-4">
                          <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Prior: {diff.originalSource.label}</span>
                          </div>
                          <div className="text-xs text-neutral-700 line-through font-mono leading-relaxed opacity-80">
                            "{diff.originalText}"
                          </div>
                        </div>
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4">
                          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Active: {diff.currentSource.label}</span>
                          </div>
                          <div className="text-xs text-neutral-900 font-mono font-medium leading-relaxed">
                            "{diff.currentText}"
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-neutral-700 mb-2">
                        <span className="font-semibold text-neutral-900">Summary of Change:</span> {diff.explanation}
                      </div>
                      <div className="text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded border border-amber-200/80">
                        <span className="font-bold">Why it matters to your situation:</span> {diff.whyItMatters}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* INCONSISTENCIES / CONFLICTS TAB */}
            {activeTab === 'inconsistencies' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900">
                  Things that require clarification
                </h1>
                <p className="text-neutral-600 mb-8 text-sm">
                  Clauses across separate documents that contradict each other or lack explicit integration priority.
                </p>

                <div className="space-y-6">
                  {inconsistencies.map(inc => (
                    <div key={inc.id} className="bg-white border border-red-200 rounded-xl p-6 shadow-xs">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <h3 className="text-lg font-serif font-medium text-neutral-900">{inc.title}</h3>
                      </div>
                      
                      <div className="grid gap-2 mb-5">
                        {inc.sources.map((src, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-neutral-200/80 bg-neutral-50 text-xs">
                            <span className="font-semibold text-neutral-700 w-36 flex-shrink-0">{src.label}:</span>
                            <span className="font-mono text-neutral-900">"{src.text}"</span>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                          The Legal Ambiguity
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed">{inc.unclearDescription}</p>
                      </div>

                      <div className="bg-neutral-900 text-white p-4 rounded-xl">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                          Recommended Verbatim Question for HR / Counterparty
                        </div>
                        <div className="text-xs md:text-sm font-medium italic">
                          "{inc.suggestedQuestion}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ASK LEGIBLE INTERACTIVE CHAT TAB */}
            {activeTab === 'chat' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[640px]">
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-1">
                    Ask Legible
                  </h1>
                  <p className="text-neutral-600 text-xs md:text-sm">
                    Query your linked contracts with instant citations and contextual legal explanations.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    'What is my notice period?',
                    'Can I work on personal projects?',
                    'What happens if I resign?',
                    'What should I ask a lawyer?'
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-xs bg-white border border-neutral-200 hover:border-neutral-900 px-3 py-1.5 rounded-full text-neutral-700 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                
                {/* Chat Message Window */}
                <div className="flex-1 bg-white border border-neutral-200 rounded-xl flex flex-col overflow-hidden shadow-xs">
                  <div className="flex-1 p-5 overflow-y-auto space-y-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'assistant' && (
                          <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold mr-2 mt-1 flex-shrink-0">
                            L
                          </div>
                        )}
                        <div className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-neutral-900 text-white rounded-tr-xs' 
                            : 'bg-[#FDFBF7] border border-neutral-200/80 text-neutral-800 rounded-tl-xs'
                        }`}>
                          <div className="whitespace-pre-line">{msg.text}</div>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-neutral-200/80 text-[11px] text-neutral-500">
                              <span className="font-semibold text-neutral-700 block mb-1">Citations:</span>
                              {msg.sources.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-neutral-600">
                                  <FileText className="w-3 h-3 text-emerald-600" /> {s}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chat Input Bar */}
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center gap-2"
                  >
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask any question about your agreements (e.g., 'What are my post-employment covenants?')..."
                      className="flex-1 bg-white border border-neutral-300 rounded-full px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="w-9 h-9 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 disabled:opacity-40 transition-colors flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* QUESTIONS TAB */}
            {activeTab === 'questions' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900">
                  Questions to ask
                </h1>
                <p className="text-neutral-600 mb-8 text-sm">
                  Precision-worded questions to raise with HR, management, or legal counsel.
                </p>

                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div 
                      key={i} 
                      className="bg-white border border-neutral-200 rounded-xl p-4 md:p-5 flex items-start justify-between gap-4 group hover:border-neutral-400 transition-colors shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="font-medium text-neutral-900 text-sm md:text-base leading-snug">
                          "{q}"
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(q);
                          setCopiedToast(true);
                          setTimeout(() => setCopiedToast(false), 2000);
                        }}
                        title="Copy question text"
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* NEXT STEPS TAB */}
            {activeTab === 'steps' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900">
                  Recommended Next Steps
                </h1>
                <p className="text-neutral-600 mb-8 text-sm">
                  Actionable guidelines to safeguard your interests based on your situation.
                </p>

                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded uppercase">
                          Step {idx + 1}: {step.title}
                        </span>
                      </div>
                      <div className="text-base font-semibold text-neutral-900 mb-1">{step.action}</div>
                      <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LAWYER BRIEF TAB */}
            {activeTab === 'brief' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-1">
                      Legal Context Brief
                    </h1>
                    <p className="text-xs text-neutral-500">
                      Exportable executive briefing document ready for attorney consultation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopyBrief}
                      className="flex items-center gap-1.5 px-3.5 py-2 border border-neutral-300 bg-white rounded-lg hover:bg-neutral-50 transition-colors text-xs font-semibold text-neutral-800"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-xs font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Brief
                    </button>
                  </div>
                </div>

                {/* Printable Document Sheet */}
                <div className="bg-white border border-neutral-300 rounded-2xl p-8 md:p-12 shadow-sm font-sans text-neutral-900 space-y-8 print:border-none print:shadow-none">
                  <div className="border-b border-neutral-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Confidential Legal Summary</span>
                      <span className="text-xs text-neutral-400">Prepared by Legible</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-medium text-neutral-900">
                      Counsel Briefing: {store.personaRole}
                    </h2>
                    <div className="text-xs text-neutral-500 mt-1">
                      Counterparty: {store.personaCompany} · Context: {situationLabel[store.situation]}
                    </div>
                  </div>

                  {/* Section 1 */}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                      1. Documents Included in Scope ({store.documents.length})
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                      {store.documents.map(d => (
                        <div key={d.id} className="p-2 bg-neutral-50 rounded border border-neutral-100 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="font-medium">{d.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                      2. Highlighted Provisions & Material Obligations
                    </h3>
                    <ul className="space-y-2 text-xs text-neutral-700">
                      {insights.map(i => (
                        <li key={i.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                          <div className="font-semibold text-neutral-900 mb-0.5">{i.title} ({i.summary})</div>
                          <div>{i.explanation}</div>
                          <div className="text-neutral-400 mt-1">Citation: {i.sources[0]?.label}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                      3. Identified Discrepancies Across Document History
                    </h3>
                    <div className="space-y-2 text-xs text-neutral-700">
                      {diffs.map(d => (
                        <div key={d.id} className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80">
                          <div className="font-bold text-amber-950 mb-0.5">{d.title}</div>
                          <div>Original ({d.originalSource.label}): "{d.originalText}"</div>
                          <div className="font-medium mt-0.5">Amended ({d.currentSource.label}): "{d.currentText}"</div>
                          <div className="text-neutral-600 mt-1 italic">{d.whyItMatters}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                      4. Specific Questions for Attorney Review
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs text-neutral-800 font-medium">
                      {questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LINKED DOCUMENTS TAB */}
            {activeTab === 'docs' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-1">
                      Linked Document Bundle
                    </h1>
                    <p className="text-neutral-600 text-xs md:text-sm">
                      Full repository of the {store.documents.length} legal contracts currently active in this workspace.
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/onboarding')}
                    className="text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 px-3 py-1.5 rounded-lg"
                  >
                    Add / Change Docs
                  </button>
                </div>

                <div className="space-y-4">
                  {store.documents.map(doc => (
                    <div key={doc.id} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <h3 className="font-medium text-base text-neutral-900">{doc.title}</h3>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mb-3">{doc.summary}</p>
                      
                      {doc.sections && doc.sections.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            Extracted Sections ({doc.sections.length})
                          </div>
                          {doc.sections.map(sec => (
                            <div key={sec.id} className="text-xs bg-neutral-50 p-2.5 rounded border border-neutral-100">
                              <div className="font-semibold text-neutral-800 mb-1">{sec.title}</div>
                              <div className="text-neutral-600 font-mono text-[11px]">"{sec.text}"</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>

      {/* Slide-over Drawer for Verbatim Source Inspection */}
      <AnimatePresence>
        {viewingSource && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="font-serif font-medium text-lg text-neutral-900">Verbatim Clause Citation</span>
                  </div>
                  <button 
                    onClick={() => setViewingSource(null)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Document Source
                  </div>
                  <div className="text-base font-semibold text-neutral-900">{viewingSource.label}</div>
                </div>

                <div className="bg-[#FDFBF7] border-2 border-emerald-500/30 rounded-xl p-5 mb-6 shadow-inner">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Exact Contractual Text
                  </div>
                  <blockquote className="text-sm font-mono text-neutral-800 leading-relaxed whitespace-pre-wrap">
                    "{viewingSource.text}"
                  </blockquote>
                </div>

                <div className="text-xs text-neutral-500 leading-relaxed">
                  Legible links all analysis points directly to verbatim source clauses so you and your attorney can verify contractual enforceability with 100% confidence.
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={() => setViewingSource(null)}
                  className="px-5 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-medium hover:bg-neutral-800"
                >
                  Close Source Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ 
  active, 
  onClick, 
  icon, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 md:py-2.5 rounded-xl flex items-center gap-2.5 text-xs md:text-sm font-medium transition-all ${
        active 
          ? 'bg-neutral-900 text-white shadow-xs' 
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
    >
      <div className={active ? 'text-white' : 'text-neutral-400'}>{icon}</div>
      <span className="truncate">{children}</span>
    </button>
  );
}
