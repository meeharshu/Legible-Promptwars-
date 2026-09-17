import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, GitMerge, FileSearch, HelpCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 font-sans selection:bg-neutral-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-serif text-2xl font-medium tracking-tight">
          <div className="w-6 h-6 bg-neutral-900 rounded-sm flex items-center justify-center">
            <span className="text-[#FDFBF7] text-xs font-sans font-bold">L</span>
          </div>
          Legible
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="hidden md:inline-flex">Sign in</Button>
          <Button onClick={() => navigate('/onboarding')} className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6">
            Explore the demo
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] tracking-tight mb-6">
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
                  className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-8 h-14 text-base"
                >
                  Explore the demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 h-14 text-base border-neutral-300 hover:bg-neutral-100"
                >
                  See how it works
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 font-medium">
                <span className="flex items-center gap-1"><FileSearch className="w-4 h-4" /> Document understanding</span>
                <span className="hidden md:inline text-neutral-300">•</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Evidence</span>
                <span className="hidden md:inline text-neutral-300">•</span>
                <span className="flex items-center gap-1"><GitMerge className="w-4 h-4" /> Comparison</span>
                <span className="hidden md:inline text-neutral-300">•</span>
                <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> Questions</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Hero Product Preview */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="border-b border-neutral-100 bg-neutral-50 p-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-200"></div>
                </div>
                <div className="text-xs font-medium text-neutral-400">legible.app/workspace</div>
              </div>
              <div className="p-8">
                <div className="mb-8">
                  <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Your current situation</div>
                  <div className="text-xl font-medium">Thinking about resigning</div>
                </div>
                
                <div className="mb-8">
                  <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">Your Legal Documents</div>
                  <div className="flex items-center gap-2 mb-2 text-neutral-700">
                    <FileText className="w-4 h-4 text-emerald-500" /> Offer Letter
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-neutral-700">
                    <FileText className="w-4 h-4 text-emerald-500" /> Employment Agreement
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-neutral-700">
                    <FileText className="w-4 h-4 text-emerald-500" /> Revised Agreement
                  </div>
                  <div className="text-xs text-neutral-400 mt-2">+ 2 more connected</div>
                </div>

                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Notice Period</div>
                  <div className="text-2xl font-serif mb-2">60 days</div>
                  <div className="text-sm text-neutral-600 mb-3">Current Agreement · Section 9.1</div>
                  <div className="h-px bg-amber-200 w-full my-3"></div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Changed from</div>
                  <div className="text-sm font-medium line-through text-neutral-400">30 days</div>
                  <div className="text-xs text-neutral-400 mt-1">Original Agreement · Section 8.1</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
