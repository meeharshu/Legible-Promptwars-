import React from 'react';
import { AnalyzedClause } from '../../lib/context-engine';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

export function ClauseDetailView({ clause, onBack }: { clause: AnalyzedClause, onBack: () => void }) {
  return (
    <div className="p-8 lg:p-12 max-w-3xl mx-auto animate-in slide-in-from-left-4 duration-300">
      <button onClick={onBack} className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 flex items-center mb-10 transition-colors bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full">
        <ArrowRight className="w-4 h-4 mr-1.5 rotate-180" /> Back to Overview
      </button>

      <div className="mb-8">
         <Badge variant={clause.attention === 'high' ? 'destructive' : clause.attention === 'medium' ? 'secondary' : 'default'} className="mb-4 text-xs px-2.5 py-0.5">
           {clause.attention} attention
         </Badge>
         <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950">{clause.title}</h1>
      </div>

      <div className="grid gap-10">
        <section>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">In plain English</h3>
          <p className="text-xl text-neutral-800 leading-relaxed font-medium">{clause.plainEnglish}</p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Why it matters to you</h3>
          <p className="text-[17px] text-neutral-800 leading-relaxed">{clause.whyItMatters}</p>
        </section>

        {clause.questions.length > 0 && (
          <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" /> Questions you could ask
            </h3>
            <ul className="space-y-4">
              {clause.questions.map((q, i) => (
                <li key={i} className="flex items-start">
                  <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0 border border-blue-200 text-blue-700">{i+1}</span>
                  <span className="text-blue-950 font-medium text-[16px] leading-snug">{q}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
