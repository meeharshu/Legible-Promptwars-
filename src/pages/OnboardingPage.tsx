import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, FileText, UploadCloud, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppStore } from '../lib/store';
import { Situation } from '../types';

const SITUATIONS: { id: Situation; title: string; description: string }[] = [
  { id: 'before_signing', title: 'Reviewing before signing', description: 'Understand what you\'re agreeing to.' },
  { id: 'comparing', title: 'Comparing two versions', description: 'Find meaningful changes between documents.' },
  { id: 'resigning', title: 'Thinking about resigning', description: 'Understand relevant obligations before leaving.' },
  { id: 'issue', title: 'Responding to an employment issue', description: 'Find the provisions relevant to your situation.' },
  { id: 'lawyer', title: 'Preparing for a lawyer', description: 'Organize documents, evidence, and questions.' },
  { id: 'exploring', title: 'Just exploring', description: 'Get a structured overview.' }
];

const FOCUS_OPTIONS = [
  'Notice', 'Intellectual property', 'Side projects', 'Confidentiality', 
  'Termination', 'Restrictions after leaving', 'Compensation', 
  'Changes between documents', 'Conflicting information', 'Everything important'
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const store = useAppStore();
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [processingState, setProcessingState] = useState(0);

  const handleNext = () => setStep(s => s + 1);

  useEffect(() => {
    if (step === 4) {
      // Simulate processing
      const interval = setInterval(() => {
        setProcessingState(prev => {
          if (prev >= 5) {
            clearInterval(interval);
            setTimeout(() => {
              store.setSituation(selectedSituation || 'exploring');
              store.setFocus(selectedFocus);
              navigate('/dashboard');
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step, navigate, store, selectedSituation, selectedFocus]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto w-full">
            <h1 className="text-4xl font-serif mb-8 text-neutral-900">What are you trying to figure out?</h1>
            <div className="grid gap-3">
              {SITUATIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSituation(s.id)}
                  className={`text-left p-5 rounded-xl border transition-all ${selectedSituation === s.id ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400 bg-white'}`}
                >
                  <div className="font-medium text-lg text-neutral-900 mb-1">{s.title}</div>
                  <div className="text-neutral-500">{s.description}</div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button disabled={!selectedSituation} onClick={handleNext} className="rounded-full px-8 bg-neutral-900 text-white">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto w-full">
            <h1 className="text-4xl font-serif mb-8 text-neutral-900">Add your legal documents</h1>
            <div className="grid gap-6">
              <button disabled className="border-2 border-dashed border-neutral-200 rounded-2xl p-12 text-center hover:bg-neutral-50 transition-colors opacity-60 cursor-not-allowed">
                <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-4" />
                <div className="font-medium text-neutral-900 mb-1">Upload documents</div>
                <div className="text-sm text-neutral-500">PDF, DOCX, TXT (Disabled for demo)</div>
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
                <div className="relative flex justify-center"><span className="bg-[#FDFBF7] px-4 text-sm text-neutral-500">OR</span></div>
              </div>

              <button 
                onClick={() => {
                  store.loadSampleDocuments();
                  handleNext();
                }}
                className="bg-white border border-neutral-200 rounded-2xl p-8 text-left hover:border-neutral-900 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded uppercase tracking-wider mb-3">
                      Synthetic demonstration documents
                    </div>
                    <div className="font-medium text-xl text-neutral-900 mb-2">Try the sample case</div>
                    <div className="text-neutral-500 mb-4">Alex Morgan, Software Engineer at Northstar Labs</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-600"><FileText className="w-4 h-4" /> Offer Letter</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600"><FileText className="w-4 h-4" /> Employment Agreement — Original</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600"><FileText className="w-4 h-4" /> Employment Agreement — Revised</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600"><FileText className="w-4 h-4" /> NDA</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600"><FileText className="w-4 h-4" /> Company Policy</div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto w-full">
            <h1 className="text-4xl font-serif mb-4 text-neutral-900">What matters to you?</h1>
            <p className="text-neutral-600 mb-8 text-lg">Select the topics you want Legible to focus on.</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    if (selectedFocus.includes(opt)) setSelectedFocus(selectedFocus.filter(f => f !== opt));
                    else setSelectedFocus([...selectedFocus, opt]);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFocus.includes(opt) ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-8">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Optional concern</label>
              <textarea 
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900" 
                placeholder="e.g., I build software projects outside work."
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleNext} className="rounded-full px-8 bg-neutral-900 text-white">
                Start Review <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-8 shadow-lg">
              <span className="text-[#FDFBF7] text-2xl font-sans font-bold">L</span>
            </div>
            <h1 className="text-2xl font-serif mb-8 text-neutral-900">Preparing your Legible view</h1>
            
            <div className="space-y-4 text-left max-w-sm mx-auto">
              {[
                'Documents added',
                'Document structure organized',
                'Relevant provisions identified',
                'Related sections connected',
                'Differences prepared',
                'Building your situation view'
              ].map((text, idx) => (
                <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${processingState >= idx ? 'opacity-100' : 'opacity-30'}`}>
                  {processingState > idx ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check className="w-3 h-3" /></div>
                  ) : processingState === idx ? (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-200 border-t-neutral-900 animate-spin"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-200"></div>
                  )}
                  <span className={`text-sm ${processingState > idx ? 'text-neutral-900' : 'text-neutral-500'}`}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <header className="p-6">
        <div className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight">
          <div className="w-5 h-5 bg-neutral-900 rounded-sm flex items-center justify-center">
            <span className="text-[#FDFBF7] text-[10px] font-sans font-bold">L</span>
          </div>
          Legible
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
        <AnimatePresence mode="wait">
          <div key={step} className="w-full">
            {renderStepContent()}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
