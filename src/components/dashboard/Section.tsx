import React from 'react';
import { AnalyzedClause } from '../../lib/context-engine';
import { ChevronRight, FileText } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function Section({ title, items, onSelect }: { title: string, items: AnalyzedClause[], onSelect: (c: AnalyzedClause) => void }) {
  if (items.length === 0) return null;
  
  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-xl font-bold mb-5 flex items-center">{title}</h2>
      <div className="space-y-4">
        {items.map(clause => (
          <Card key={clause.id} className="p-6 border-neutral-200 hover:border-neutral-400 hover:shadow-lg transition-all duration-300 group bg-white">
            <button className="w-full text-left flex justify-between items-start outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-sm" onClick={() => onSelect(clause)} aria-label={`View details for ${clause.title}`}>
              <div className="pr-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">{clause.title}</h3>
                <p className="text-neutral-600 text-[15px] mb-5 leading-relaxed line-clamp-2">{clause.plainEnglish}</p>
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 mb-4">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Why Legible highlighted it</p>
                  <p className="text-[14px] text-neutral-800 font-medium">{clause.attentionReason}</p>
                </div>
              </div>
              <div className="flex-shrink-0 mt-1">
                 <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                   <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                 </div>
              </div>
            </button>
            <div className="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Source: Section {clause.section} · Page {clause.page}
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-neutral-500 hover:text-neutral-900" onClick={(e) => { e.stopPropagation(); onSelect(clause); }}>
                Examine clause
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
