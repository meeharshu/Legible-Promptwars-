import React from 'react';
import { ArrowRight, FileText, Scale, Target, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdfdfd] font-sans text-neutral-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="bg-neutral-900 p-1.5 rounded-lg">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Legible</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-neutral-500 hidden md:block">How it works</span>
          <span className="text-sm font-medium text-neutral-500 hidden md:block">Safety</span>
          <Button variant="outline" className="hidden sm:inline-flex rounded-full px-6 font-semibold border-neutral-300" onClick={() => navigate('/onboarding')}>
            Try interactive demo
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-8 pt-24 pb-20 text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-neutral-950 mb-8 leading-[1.1]">
          Understand what you're signing.<br />
          <span className="text-neutral-400">Know what to ask next.</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Legible turns complex employment agreements into clear, contextual explanations so you can understand important terms and prepare better questions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-14 px-8 text-lg rounded-full font-bold shadow-lg" onClick={() => navigate('/onboarding')}>
            Analyze an agreement
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full font-bold border-neutral-300" onClick={() => navigate('/onboarding')}>
            Try interactive demo <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <p className="mt-12 text-xs text-neutral-400 font-bold tracking-widest uppercase flex items-center justify-center space-x-3">
          <span>Document understanding</span> <span className="w-1 h-1 rounded-full bg-neutral-300"/> <span>Contextual insights</span> <span className="w-1 h-1 rounded-full bg-neutral-300"/> <span>Evidence-backed</span>
        </p>
      </main>

      {/* Hero Visual Preview */}
      <section className="max-w-4xl mx-auto px-8 mb-32">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden flex flex-col md:flex-row h-[400px]">
           <div className="w-full md:w-1/2 p-10 bg-neutral-50 border-r border-neutral-200">
             <div className="w-24 h-3 bg-neutral-200 rounded-full mb-6"></div>
             <div className="w-full h-2 bg-neutral-200 rounded-full mb-3"></div>
             <div className="w-full h-2 bg-neutral-200 rounded-full mb-3"></div>
             <div className="w-3/4 h-2 bg-neutral-200 rounded-full mb-10"></div>
             <div className="w-32 h-3 bg-neutral-300 rounded-full mb-6"></div>
             <div className="w-full h-2 bg-amber-200 rounded-full mb-3"></div>
             <div className="w-full h-2 bg-amber-200 rounded-full mb-3"></div>
             <div className="w-5/6 h-2 bg-amber-200 rounded-full mb-3"></div>
           </div>
           <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
             <div className="inline-flex px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded border border-red-100 w-fit mb-4">High Attention</div>
             <h3 className="text-3xl font-extrabold mb-4">Intellectual Property</h3>
             <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 mb-6">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Why this matters to you</p>
                <p className="text-sm font-medium text-neutral-800">You indicated that you maintain personal software projects.</p>
             </div>
             <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Source: Section 7.2 · Page 8
             </div>
           </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-32 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <Step number="01" title="Tell Legible your situation" icon={<Target />} />
            <Step number="02" title="Add your agreement" icon={<FileText />} />
            <Step number="03" title="See what matters" icon={<Scale />} />
            <Step number="04" title="Ask questions" icon={<HelpCircle />} />
            <Step number="05" title="Know what to do next" icon={<ArrowUpRight />} />
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-neutral-50 py-24 border-t border-neutral-200 text-center">
         <div className="max-w-2xl mx-auto px-8">
           <h2 className="text-2xl font-extrabold mb-4">Built to clarify, not replace legal advice.</h2>
           <p className="text-neutral-500 text-lg leading-relaxed font-medium">Legible is designed to help you understand and navigate legal documents. It does not provide legal advice or replace a qualified legal professional.</p>
         </div>
      </section>
    </div>
  );
}

function Step({ number, title, icon }: { number: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 mb-6 border border-neutral-200">
        {icon}
      </div>
      <div className="text-xs font-bold text-neutral-400 mb-3 tracking-widest uppercase">{number}</div>
      <h3 className="text-lg font-bold text-neutral-900 leading-snug">{title}</h3>
    </div>
  );
}
