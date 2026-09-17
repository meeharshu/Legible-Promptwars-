import React from 'react';
import { UserContext } from '../../lib/context-engine';
import { CheckCircle2, AlertCircle, Copy, Printer } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function NextStepsView({ userContext }: { userContext: UserContext }) {
  const isResigning = userContext.intent === 'resign';
  
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-2">What you can do next</h1>
          <p className="text-neutral-500 text-lg">Actionable steps based on your analysis.</p>
      </header>

      {isResigning ? (
        <Card className="p-8 bg-white border-neutral-200 shadow-sm mb-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <CheckCircle2 className="w-6 h-6 mr-3 text-neutral-900" />
            Before you resign
          </h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-lg text-neutral-700"><div className="w-5 h-5 rounded border-2 border-neutral-300 mr-4 shrink-0" /> Review the 60-day notice requirement</li>
            <li className="flex items-center text-lg text-neutral-700"><div className="w-5 h-5 rounded border-2 border-neutral-300 mr-4 shrink-0" /> Review continuing confidentiality obligations</li>
            <li className="flex items-center text-lg text-neutral-700"><div className="w-5 h-5 rounded border-2 border-neutral-300 mr-4 shrink-0" /> Review the 12-month post-employment restrictions</li>
            <li className="flex items-center text-lg text-neutral-700"><div className="w-5 h-5 rounded border-2 border-neutral-300 mr-4 shrink-0" /> Check company-property return policies</li>
            <li className="flex items-center text-lg text-neutral-700"><div className="w-5 h-5 rounded border-2 border-neutral-300 mr-4 shrink-0" /> Prepare transition documents</li>
          </ul>
        </Card>
      ) : (
        <Card className="p-8 bg-white border-neutral-200 shadow-sm mb-8">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-2xl font-bold text-neutral-900">Your Consultation Brief</h3>
             <div className="flex space-x-2">
               <Button variant="outline" size="sm"><Copy className="w-4 h-4 mr-2"/> Copy</Button>
               <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2"/> Print</Button>
             </div>
           </div>
           
           <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Situation</h4>
                <p className="text-neutral-800 font-medium">{userContext.role} — About to sign</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Main Concerns</h4>
                <p className="text-neutral-800 font-medium">{userContext.priorities.map(p => p.replace('_', ' ')).join(', ')}</p>
                {userContext.concern && <p className="text-neutral-600 mt-1 italic">"{userContext.concern}"</p>}
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Areas needing clarification</h4>
                <ul className="list-disc pl-5 space-y-2 text-neutral-800 font-medium">
                  <li>Treatment of independently developed software projects created outside work.</li>
                  <li>Scope of the 12-month non-solicitation clause.</li>
                  <li>Negotiability of the 60-day notice period.</li>
                </ul>
              </div>
           </div>
        </Card>
      )}

      <div className="bg-neutral-100 p-6 rounded-2xl flex items-start space-x-4">
         <AlertCircle className="w-6 h-6 text-neutral-500 shrink-0 mt-0.5" />
         <div>
           <h4 className="font-bold text-neutral-900 mb-1">Get professional help</h4>
           <p className="text-neutral-600">Consider qualified legal advice for significant or jurisdiction-specific issues. Legible does not provide legal advice or replace a qualified legal professional.</p>
         </div>
      </div>
    </div>
  )
}
