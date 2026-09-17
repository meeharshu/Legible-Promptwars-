import React from 'react';
import { AnalyzedClause } from '../../lib/context-engine';
import { FileText } from 'lucide-react';
import { Card } from '../ui/card';

export function CommitmentsView({ clauses }: { clauses: AnalyzedClause[] }) {
  const commitments = clauses.filter(c => ['notice', 'post_employment', 'confidentiality', 'property'].includes(c.category));

  return (
    <div className="max-w-4xl mx-auto">
       <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-2">What you're committing to</h1>
          <p className="text-neutral-500 text-lg">A clearer view of the obligations described in your agreement.</p>
       </header>

       <div className="space-y-6">
         {commitments.map(c => (
           <Card key={c.id} className="p-8 bg-white border-neutral-200 shadow-sm">
             <h3 className="text-2xl font-bold text-neutral-900 mb-6">{c.title}</h3>
             
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Requirement</p>
                 <p className="text-neutral-800 text-[16px] leading-relaxed">{c.plainEnglish}</p>
               </div>
               <div>
                 <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                   <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Source</p>
                   <p className="text-neutral-800 font-semibold flex items-center">
                     <FileText className="w-4 h-4 mr-2 text-neutral-500" />
                     Section {c.section} · Page {c.page}
                   </p>
                 </div>
               </div>
             </div>
           </Card>
         ))}
       </div>
    </div>
  )
}
