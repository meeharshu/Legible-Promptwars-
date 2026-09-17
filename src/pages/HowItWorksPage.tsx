import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, FileText, GitCompare, 
  HelpCircle, ShieldAlert, Sparkles, Scale, BookOpen, Layers
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function HowItWorksPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Context & Situation Framing',
      subtitle: 'Why generic contract summaries fail',
      description: 'Legal terms are meaningless in a vacuum. A 60-day notice clause means nothing until you are resigning; an IP assignment clause is benign until you develop an open-source tool on weekends. Legible starts by asking your specific situation to filter out 90% of irrelevant legal boilerplate.',
      icon: <Layers className="w-6 h-6 text-amber-600" />,
      tag: 'Step 1: Input Context',
      preview: (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Selected Context</div>
          <div className="font-serif text-xl font-medium text-neutral-900 mb-2">Thinking about resigning</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full font-medium">Notice obligations</span>
            <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full font-medium">Side project IP</span>
            <span className="bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full font-medium">Non-compete</span>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
            Filters 50+ pages down to the exact 4 clauses that legally impact your departure.
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Multi-Document Ingestion & Mapping',
      subtitle: 'Connecting the scattered puzzle pieces',
      description: 'You rarely sign just one document. You have an initial Offer Letter, an Employment Agreement, an amendment signed two years later, an Employee Handbook, and an NDA. Legible stitches these separate documents together into a single unified knowledge graph.',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      tag: 'Step 2: Connect Documents',
      preview: (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Connected Document Bundle</div>
          <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg text-sm">
            <span className="flex items-center gap-2 font-medium text-neutral-800"><FileText className="w-4 h-4 text-emerald-600" /> Offer Letter</span>
            <span className="text-xs text-neutral-400">Year 1 · Signed</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg text-sm">
            <span className="flex items-center gap-2 font-medium text-neutral-800"><FileText className="w-4 h-4 text-emerald-600" /> Initial Employment Agmt</span>
            <span className="text-xs text-neutral-400">Year 1 · Signed</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg text-sm">
            <span className="flex items-center gap-2 font-medium text-neutral-800"><FileText className="w-4 h-4 text-blue-600" /> Revised Agmt (Addendum)</span>
            <span className="text-xs text-neutral-400">Year 3 · Active</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg text-sm">
            <span className="flex items-center gap-2 font-medium text-neutral-800"><FileText className="w-4 h-4 text-neutral-500" /> Handbook & NDA</span>
            <span className="text-xs text-neutral-400">Company Wide</span>
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Cross-Document Conflict & Change Detection',
      subtitle: 'Catching stealth modifications & contradictory clauses',
      description: 'When companies issue revised agreements or addendums, restrictive covenants often slip in quietly. Legible compares clauses across your timeline, highlighting changes (e.g. 30 days notice increased to 60 days) and spotting contradictions that leave you legally vulnerable.',
      icon: <GitCompare className="w-6 h-6 text-amber-600" />,
      tag: 'Step 3: Comparative Analysis',
      preview: (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded w-fit uppercase">
            <ShieldAlert className="w-3.5 h-3.5" /> Discrepancy Flagged
          </div>
          <div className="text-sm font-medium text-neutral-900">Notice Period Mismatch</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-red-50 text-red-900 rounded border border-red-100">
              <span className="font-semibold block mb-1">Original Contract</span>
              <span className="line-through">30 days written notice</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded border border-emerald-100">
              <span className="font-semibold block mb-1">Revised Agreement</span>
              <span className="font-bold">60 days written notice</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            The revised agreement quietly doubled your notice requirement, while the original Offer Letter was never formally terminated.
          </p>
        </div>
      )
    },
    {
      number: '04',
      title: 'Actionable Next Steps & Legal Brief',
      subtitle: 'Empowering you with concrete questions and lawyer preparation',
      description: 'Legible never gives blind legal advice. Instead, it generates the exact, professionally framed questions you should ask HR, plus an executive one-page Legal Context Brief you can hand straight to an attorney to save thousands in billable consultation hours.',
      icon: <Scale className="w-6 h-6 text-emerald-600" />,
      tag: 'Step 4: Empowered Action',
      preview: (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Generated Lawyer Brief</div>
          <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50 space-y-2 text-xs">
            <div className="font-semibold text-neutral-900">Summary for Legal Counsel</div>
            <div className="text-neutral-600">• Client: Alex Morgan (Senior Software Engineer)</div>
            <div className="text-neutral-600">• Intent: Resigning to launch independent software venture</div>
            <div className="text-neutral-600">• Key Ambiguity: Conflicting notice periods & broad pre-invention assignment</div>
            <div className="font-medium text-neutral-800 pt-1">Suggested Question for HR:</div>
            <div className="italic text-neutral-700 bg-white p-2 rounded border border-neutral-200">
              "Could you clarify whether the 60-day notice in Section 9.1 supersedes the 30-day term stated in the initial offer?"
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 font-sans selection:bg-neutral-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 max-w-7xl mx-auto border-b border-neutral-200/60">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3.5 py-1.5 rounded-full hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>
          <div className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight">
            <div className="w-5 h-5 bg-neutral-900 rounded-sm flex items-center justify-center">
              <span className="text-[#FDFBF7] text-[10px] font-sans font-bold">L</span>
            </div>
            Legible
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/onboarding')} 
            className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6 text-sm"
          >
            Start Interactive Demo
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 text-amber-900 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5" /> Architecture & Workflow
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium leading-tight tracking-tight mb-6">
            How Legible clarifies complex legal documents.
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Most contract tools summarize documents in isolation. Legible operates on your entire legal context—connecting scattered agreements, unmasking stealth revisions, and arming you with clear evidence and questions.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {steps.map((step, idx) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left border transition-all ${
                activeStep === idx
                  ? 'bg-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                  : 'bg-white/60 border-neutral-200 hover:bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${activeStep === idx ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {step.number}
                </span>
                {activeStep === idx && <CheckCircle2 className="w-4 h-4 text-neutral-900" />}
              </div>
              <div className="font-serif font-medium text-sm text-neutral-900 leading-tight">
                {step.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Deep-Dive */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-neutral-200 rounded-2xl p-8 md:p-12 shadow-sm grid md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {steps[activeStep].icon}
              {steps[activeStep].tag}
            </div>
            <h2 className="text-3xl font-serif font-medium text-neutral-900">
              {steps[activeStep].title}
            </h2>
            <div className="text-base font-medium text-amber-800 bg-amber-50/70 border border-amber-100 p-3 rounded-lg">
              {steps[activeStep].subtitle}
            </div>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
              {steps[activeStep].description}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Button 
                onClick={() => {
                  if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
                  else navigate('/onboarding');
                }}
                className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6 text-sm"
              >
                {activeStep < steps.length - 1 ? 'Next Step' : 'Try the Experience'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2"
                >
                  Previous Step
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-6 bg-[#FDFBF7] p-6 rounded-xl border border-neutral-200/80">
            {steps[activeStep].preview}
          </div>
        </motion.div>

        {/* Video Recording & Methodology Box */}
        <div className="mt-16 bg-neutral-900 text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              Production-Grade Experience
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4">
              Designed for authentic live demonstrations.
            </h3>
            <p className="text-neutral-300 mb-8 leading-relaxed text-sm md:text-base">
              You can test with custom-uploaded files, manually pasted contracts, or our standardized multi-document scenario. All comparisons highlight verbatim citations with zero simulated fluff.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/onboarding')} 
                className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-8 h-12 font-medium"
              >
                Launch Legible Workspace
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="rounded-full px-6 h-12 text-white border-neutral-700 hover:bg-neutral-800"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
