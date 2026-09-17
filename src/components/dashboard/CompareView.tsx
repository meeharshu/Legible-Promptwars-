import React from 'react';
import { FileText } from 'lucide-react';
import { Card } from '../ui/card';
import { comparisonData } from '../../data/sample-agreement';

export function CompareView() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-2">Compare agreements</h1>
          <p className="text-neutral-500 text-lg">See meaningful differences between two agreements.</p>
      </header>

      <Card className="p-8 bg-white border-neutral-200 shadow-sm mb-8">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">Notice Period</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50">
            <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Agreement A (Previous)</h4>
            <p className="font-serif text-neutral-600 leading-relaxed">"{comparisonData.clauseA.text}"</p>
            <p className="mt-4 text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1" /> {comparisonData.clauseA.source}
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/50">
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Agreement B (Current)</h4>
            <p className="font-serif text-neutral-900 leading-relaxed font-medium">"{comparisonData.clauseB.text}"</p>
            <p className="mt-4 text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1" /> {comparisonData.clauseB.source}
            </p>
          </div>
        </div>

        <div className="bg-neutral-900 text-white p-6 rounded-xl">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">What changed</h4>
          <p className="text-[16px] mb-4 font-medium">{comparisonData.whatChanged}</p>
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Why it may matter</h4>
          <p className="text-neutral-300 text-[15px]">{comparisonData.whyItMatters}</p>
        </div>
      </Card>
    </div>
  )
}
