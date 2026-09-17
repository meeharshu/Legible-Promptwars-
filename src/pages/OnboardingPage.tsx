import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ArrowRight, ArrowLeft, FileText, UploadCloud, 
  Trash2, Plus, FileEdit, Sparkles, Building, User, ChevronRight, FastForward
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppStore } from '../lib/store';
import { Situation, DocumentInfo } from '../types';
import { PRESET_SCENARIOS } from '../data/documents';

const SITUATIONS: { id: Situation; title: string; description: string; iconTag: string }[] = [
  { id: 'resigning', title: 'Thinking about resigning', description: 'Understand notice periods, return of property, and post-employment obligations.', iconTag: 'High Priority' },
  { id: 'comparing', title: 'Comparing two versions', description: 'Find meaningful changes, addendums, and subtle restrictions between agreements.', iconTag: 'Comparison' },
  { id: 'before_signing', title: 'Reviewing before signing', description: 'Spot restrictive covenants, IP traps, and ambiguous clauses before putting pen to paper.', iconTag: 'Pre-Sign' },
  { id: 'lawyer', title: 'Preparing for a lawyer', description: 'Organize scattered contracts, evidence, and pre-formulated questions for counsel.', iconTag: 'Counsel' },
  { id: 'issue', title: 'Responding to an employment issue', description: 'Find governing provisions regarding disputes, performance, or severance.', iconTag: 'Resolution' },
  { id: 'exploring', title: 'Just exploring documents', description: 'Get a structured multi-document overview with verbatim citations.', iconTag: 'Overview' }
];

const FOCUS_OPTIONS = [
  'Notice', 'Intellectual property', 'Side projects', 'Confidentiality', 
  'Termination', 'Restrictions after leaving', 'Compensation', 
  'Changes between documents', 'Conflicting information', 'Everything important'
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const store = useAppStore();
  
  const [step, setStep] = useState(1);
  const [selectedSituation, setSelectedSituation] = useState<Situation>(store.situation || 'resigning');
  const [selectedFocus, setSelectedFocus] = useState<string[]>(store.selectedFocus.length > 0 ? store.selectedFocus : ['Notice', 'Intellectual property', 'Side projects']);
  const [customConcernText, setCustomConcernText] = useState(store.customConcern || '');
  
  // Document mode: 'preset' or 'custom'
  const [docMode, setDocMode] = useState<'preset' | 'custom'>('preset');
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  
  // Custom document state
  const [customDocs, setCustomDocs] = useState<DocumentInfo[]>(store.documents);
  const [roleInput, setRoleInput] = useState(store.personaRole || 'Staff Software Engineer');
  const [companyInput, setCompanyInput] = useState(store.personaCompany || 'Northstar Labs');
  const [isPasting, setIsPasting] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');

  // Step 4 processing
  const [processingState, setProcessingState] = useState(0);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    if (step === 1) navigate('/');
    else setStep(s => s - 1);
  };

  // Complete processing and redirect to dashboard
  const finalizeAndGo = () => {
    store.setSituation(selectedSituation);
    store.setFocus(selectedFocus);
    store.setCustomConcern(customConcernText);
    store.setPersona(roleInput, companyInput);
    if (docMode === 'preset') {
      store.loadSampleDocuments(selectedScenarioIdx);
    } else {
      store.setDocuments(customDocs.length > 0 ? customDocs : PRESET_SCENARIOS[0].documents);
    }
    navigate('/dashboard');
  };

  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setProcessingState(prev => {
          if (prev >= 5) {
            clearInterval(interval);
            setTimeout(finalizeAndGo, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Handle local file uploads (PDF, TXT, MD, DOCX)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const newDoc: DocumentInfo = {
          id: `custom_doc_${Date.now()}_${idx}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          summary: `Uploaded ${file.name} (${Math.round(file.size / 1024)} KB)`,
          type: 'Uploaded Document',
          content: text || `Content from ${file.name}`,
          sections: [
            {
              id: `sec_${Date.now()}_1`,
              documentId: `custom_doc_${Date.now()}_${idx}`,
              title: 'Primary Terms',
              text: text.slice(0, 500) || 'Contract terms extracted from uploaded file.',
              tags: ['general', 'notice', 'ip']
            }
          ]
        };
        setCustomDocs(prev => [...prev, newDoc]);
        setDocMode('custom');
      };
      reader.readAsText(file);
    });
  };

  // Handle manual contract text pasting
  const handleAddPastedDocument = () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;
    const newDoc: DocumentInfo = {
      id: `pasted_doc_${Date.now()}`,
      title: pasteTitle.trim(),
      summary: `Pasted document with ${pasteContent.split('\n').length} lines of text.`,
      type: 'Pasted Agreement',
      content: pasteContent,
      sections: [
        {
          id: `sec_p_${Date.now()}`,
          documentId: `pasted_doc_${Date.now()}`,
          title: 'Section 1. Terms & Conditions',
          text: pasteContent.slice(0, 400),
          tags: ['notice', 'ip', 'compensation']
        }
      ]
    };
    setCustomDocs(prev => [...prev, newDoc]);
    setPasteTitle('');
    setPasteContent('');
    setIsPasting(false);
    setDocMode('custom');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </button>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Step 1 of 4</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif mb-3 text-neutral-900">
              What are you trying to figure out?
            </h1>
            <p className="text-neutral-600 mb-8 text-sm md:text-base">
              Selecting your current situation helps Legible instantly identify which clauses matter and filter out irrelevant boilerplate.
            </p>

            <div className="grid gap-3 mb-8">
              {SITUATIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSituation(s.id)}
                  className={`text-left p-4 md:p-5 rounded-xl border transition-all ${
                    selectedSituation === s.id 
                      ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-sm' 
                      : 'border-neutral-200 hover:border-neutral-400 bg-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-base md:text-lg text-neutral-900">{s.title}</div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      selectedSituation === s.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {s.iconTag}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 leading-relaxed">{s.description}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-neutral-600 text-sm">
                Cancel
              </Button>
              <Button 
                onClick={handleNext} 
                className="rounded-full px-8 bg-neutral-900 text-white hover:bg-neutral-800 text-sm"
              >
                Continue to Documents <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Situation
              </button>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Step 2 of 4</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900">
              Add your legal documents
            </h1>
            <p className="text-neutral-600 mb-6 text-sm md:text-base">
              You can test with custom real documents (upload files or paste contract text) or select a verified benchmark scenario.
            </p>

            {/* Mode Selector Tabs */}
            <div className="flex bg-neutral-200/60 p-1 rounded-xl mb-6 max-w-md">
              <button
                onClick={() => setDocMode('preset')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  docMode === 'preset' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Fixed Benchmark Datasets
              </button>
              <button
                onClick={() => setDocMode('custom')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  docMode === 'custom' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Upload / Custom Contracts ({customDocs.length})
              </button>
            </div>

            {docMode === 'preset' ? (
              <div className="space-y-4 mb-8">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Select a standardized multi-document scenario:
                </div>

                <div className="grid gap-3">
                  {PRESET_SCENARIOS.map((scenario, idx) => (
                    <div
                      key={scenario.id}
                      onClick={() => {
                        setSelectedScenarioIdx(idx);
                        setRoleInput(scenario.role);
                        setCompanyInput(scenario.company);
                      }}
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${
                        selectedScenarioIdx === idx
                          ? 'border-neutral-900 bg-white ring-2 ring-neutral-900 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white/70'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-lg text-neutral-900">{scenario.name}</div>
                          <div className="text-xs text-neutral-500 font-medium">{scenario.tagline}</div>
                        </div>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          selectedScenarioIdx === idx ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {scenario.documents.length} Docs Linked
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-neutral-100">
                        {scenario.documents.map((d) => (
                          <span key={d.id} className="inline-flex items-center gap-1 text-xs bg-neutral-50 border border-neutral-200/80 px-2 py-1 rounded text-neutral-700">
                            <FileText className="w-3 h-3 text-emerald-600" /> {d.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {/* Upload or Paste Controls */}
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl p-6 text-center bg-white cursor-pointer transition-all hover:shadow-xs group">
                    <input 
                      type="file" 
                      multiple 
                      accept=".txt,.pdf,.md,.docx,.doc" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    <UploadCloud className="w-7 h-7 text-neutral-400 group-hover:text-neutral-900 mx-auto mb-2 transition-colors" />
                    <div className="font-medium text-sm text-neutral-900 mb-1">Click to browse or drop files</div>
                    <div className="text-xs text-neutral-500">Supports .txt, .md, .pdf, .docx</div>
                  </label>

                  <button 
                    onClick={() => setIsPasting(true)}
                    className="border border-neutral-300 hover:border-neutral-900 rounded-2xl p-6 text-center bg-white transition-all hover:shadow-xs group"
                  >
                    <FileEdit className="w-7 h-7 text-neutral-400 group-hover:text-neutral-900 mx-auto mb-2 transition-colors" />
                    <div className="font-medium text-sm text-neutral-900 mb-1">Paste custom contract text</div>
                    <div className="text-xs text-neutral-500">Type or paste clauses directly</div>
                  </button>
                </div>

                {/* Paste modal inline */}
                {isPasting && (
                  <div className="bg-white border border-neutral-300 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="font-medium text-sm text-neutral-900">Add New Document via Direct Paste</div>
                    <input 
                      type="text"
                      placeholder="Document title (e.g. Master Consulting Agreement)"
                      value={pasteTitle}
                      onChange={(e) => setPasteTitle(e.target.value)}
                      className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <textarea 
                      placeholder="Paste contract text, clauses, or agreement text here..."
                      value={pasteContent}
                      onChange={(e) => setPasteContent(e.target.value)}
                      rows={4}
                      className="w-full text-xs font-mono border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsPasting(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleAddPastedDocument} className="bg-neutral-900 text-white">Add Document</Button>
                    </div>
                  </div>
                )}

                {/* Custom Documents List */}
                <div className="bg-white border border-neutral-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Active Custom Bundle ({customDocs.length} Documents)
                    </span>
                    {customDocs.length > 0 && (
                      <button 
                        onClick={() => setCustomDocs([])} 
                        className="text-xs text-red-600 hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {customDocs.length === 0 ? (
                    <div className="text-center py-6 text-xs text-neutral-400">
                      No custom documents added yet. Upload files or paste text above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customDocs.map((doc, idx) => (
                        <div key={doc.id} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-sm">
                          <div className="flex items-center gap-2 text-neutral-800 font-medium">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span>{doc.title}</span>
                            <span className="text-xs text-neutral-400">({doc.type})</span>
                          </div>
                          <button 
                            onClick={() => setCustomDocs(customDocs.filter(d => d.id !== doc.id))}
                            className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Editable Persona */}
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <User className="w-3 h-3" /> Your Role / Title
                    </label>
                    <input 
                      type="text" 
                      value={roleInput} 
                      onChange={(e) => setRoleInput(e.target.value)} 
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg p-2 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Building className="w-3 h-3" /> Company / Counterparty
                    </label>
                    <input 
                      type="text" 
                      value={companyInput} 
                      onChange={(e) => setCompanyInput(e.target.value)} 
                      placeholder="e.g. Acme Corp"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg p-2 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <Button variant="ghost" onClick={handleBack} className="text-neutral-600 text-sm">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Situation
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={docMode === 'custom' && customDocs.length === 0}
                className="rounded-full px-8 bg-neutral-900 text-white hover:bg-neutral-800 text-sm"
              >
                Continue to Focus Areas <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Documents
              </button>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Step 3 of 4</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900">
              What matters most to you?
            </h1>
            <p className="text-neutral-600 mb-6 text-sm md:text-base">
              Select key topics to prioritize in your analysis.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-8">
              {FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    if (selectedFocus.includes(opt)) {
                      setSelectedFocus(selectedFocus.filter(f => f !== opt));
                    } else {
                      setSelectedFocus([...selectedFocus, opt]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    selectedFocus.includes(opt) 
                      ? 'bg-neutral-900 text-white shadow-xs' 
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-8">
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Specific Question or Outside Activity (Optional)
              </label>
              <textarea 
                value={customConcernText}
                onChange={(e) => setCustomConcernText(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900" 
                placeholder="e.g. I build an open-source tool on weekends and need to know if the company claims ownership."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <Button variant="ghost" onClick={handleBack} className="text-neutral-600 text-sm">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="rounded-full px-8 bg-neutral-900 text-white hover:bg-neutral-800 text-sm"
              >
                Generate Workspace <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-6 shadow-md">
              <span className="text-[#FDFBF7] text-2xl font-sans font-bold">L</span>
            </div>
            <h1 className="text-2xl font-serif mb-2 text-neutral-900">
              Structuring your Legible view
            </h1>
            <p className="text-xs text-neutral-500 mb-8">
              Connecting documents, mapping discrepancies, and preparing citations...
            </p>
            
            <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
              {[
                'Documents ingested & tagged',
                'Timeline & amendment hierarchy aligned',
                'Relevant provisions extracted',
                'Cross-document discrepancies flagged',
                'Verifiable citations linked',
                'Synthesizing actionable lawyer brief'
              ].map((text, idx) => (
                <div key={idx} className={`flex items-center gap-3 transition-opacity duration-300 ${processingState >= idx ? 'opacity-100' : 'opacity-25'}`}>
                  {processingState > idx ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : processingState === idx ? (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin flex-shrink-0"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-neutral-300 flex-shrink-0"></div>
                  )}
                  <span className={`text-xs md:text-sm ${processingState > idx ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Skip button for seamless demo recording */}
            <Button
              onClick={finalizeAndGo}
              variant="outline"
              size="sm"
              className="rounded-full text-xs border-neutral-300 hover:bg-neutral-100 text-neutral-600 gap-1.5"
            >
              <FastForward className="w-3.5 h-3.5" /> Skip animation (Go directly to Dashboard)
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans selection:bg-neutral-200">
      {/* Header */}
      <header className="px-6 py-4 md:px-12 flex items-center justify-between border-b border-neutral-200/50">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight cursor-pointer"
        >
          <div className="w-5 h-5 bg-neutral-900 rounded-sm flex items-center justify-center">
            <span className="text-[#FDFBF7] text-[10px] font-sans font-bold">L</span>
          </div>
          Legible
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="hidden sm:inline">Legal Document Intelligence</span>
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-neutral-900 ml-2 underline text-neutral-400 hover:text-neutral-800"
          >
            Exit demo
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <AnimatePresence mode="wait">
          <div key={step} className="w-full">
            {renderStepContent()}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
