import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, GitMerge, FileSearch, HelpCircle, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 font-sans selection:bg-neutral-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 max-w-7xl mx-auto border-b border-neutral-200/40">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 font-serif text-2xl font-medium tracking-tight cursor-pointer"
        >
          <div className="w-6 h-6 bg-neutral-900 rounded-sm flex items-center justify-center">
            <span className="text-[#FDFBF7] text-xs font-sans font-bold">L</span>
          </div>
          Legible
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <Button 
            onClick={() => navigate('/how-it-works')} 
            variant="ghost" 
            className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
          >
            How it works
          </Button>
          <Button 
            onClick={() => navigate('/onboarding')} 
            className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-5 md:px-6 text-sm"
          >
            Explore the demo
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 text-amber-900 text-xs font-semibold rounded-full uppercase tracking-wider mb-5 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5" /> Intelligent Multi-Contract Analysis
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] tracking-tight mb-6 text-neutral-950">
                Understand your legal documents.
              </h1>
              <h2 className="text-2xl md:text-3xl text-neutral-600 font-medium mb-6">
                See what changed. Know what to ask next.
              </h2>
              <p className="text-lg text-neutral-600 mb-10 leading-relaxed max-w-lg">
                Legible organizes complex legal documents into clear explanations, relevant provisions, document differences, questions, and practical next steps.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Button 
                  onClick={() => navigate('/onboarding')} 
                  size="lg" 
                  className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-8 h-14 text-base shadow-sm hover:shadow"
                >
                  Explore the demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => navigate('/how-it-works')}
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 h-14 text-base border-neutral-300 hover:bg-neutral-100/80 text-neutral-800"
                >
                  See how it works
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-neutral-500 font-medium pt-2 border-t border-neutral-200/60">
                <span className="flex items-center gap-1.5"><FileSearch className="w-4 h-4 text-neutral-700" /> Document understanding</span>
                <span className="hidden md:inline text-neutral-300">•</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-neutral-700" /> Verifiable citations</span>
                <span className="hidden md:inline text-neutral-300">•</span>
                <span className="flex items-center gap-1.5"><GitMerge className="w-4 h-4 text-neutral-700" /> Version comparison</span>
                <span className="hidden md:inline text-neutral-300">•</span>
                <span className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-neutral-700" /> Lawyer questions</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Hero Product Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200/80 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
              <div className="border-b border-neutral-100 bg-neutral-50/80 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-300/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-300/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-300/80"></div>
                </div>
                <div className="text-xs font-mono text-neutral-400">legible.app/workspace</div>
                <div className="w-12"></div>
              </div>
              <div className="p-7 md:p-8">
                <div className="mb-6 pb-5 border-b border-neutral-100 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Your Context</div>
                    <div className="text-xl font-medium text-neutral-900">Thinking about resigning</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                    Live Analysis
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Linked Document Bundle (5 Documents)</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-neutral-700 p-2 rounded bg-neutral-50 border border-neutral-100">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-600" /> Initial Offer Letter</span>
                      <span className="text-xs text-neutral-400">Year 1</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-neutral-700 p-2 rounded bg-neutral-50 border border-neutral-100">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-600" /> Employment Agreement — Original</span>
                      <span className="text-xs text-neutral-400">Year 1</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-neutral-700 p-2 rounded bg-amber-50/50 border border-amber-100">
                      <span className="flex items-center gap-2 font-medium text-neutral-900"><FileText className="w-4 h-4 text-amber-600" /> Revised Agreement (Amendment)</span>
                      <span className="text-xs text-amber-800 font-medium">Changed</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/80 rounded-xl p-5 border border-amber-200/80">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Discrepancy: Notice Period</div>
                    <span className="text-xs bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-medium">Critical</span>
                  </div>
                  <div className="text-2xl font-serif text-neutral-900 mb-1">60 days notice</div>
                  <div className="text-xs text-neutral-600 mb-3">Current Agreement · Section 9.1</div>
                  
                  <div className="h-px bg-amber-200/80 w-full my-3"></div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 uppercase tracking-wider">Silently modified from:</span>
                    <span className="line-through font-semibold text-neutral-500">30 days notice</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Original Offer Letter & Agreement · Section 8.1</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
