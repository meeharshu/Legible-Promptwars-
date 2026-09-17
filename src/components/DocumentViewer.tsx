import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../lib/store';
import { FileText, Search, ZoomIn, ZoomOut } from 'lucide-react';

export function DocumentViewer() {
  const { documentText, documentName, selectedClause } = useAppStore();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedClause && contentRef.current) {
      // Scroll to the highlighted element
      const highlightEl = contentRef.current.querySelector('mark');
      if (highlightEl) {
        highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedClause]);

  if (!documentText) return null;

  const renderContent = () => {
    if (!selectedClause?.sourceText) return <p className="whitespace-pre-wrap">{documentText}</p>;

    // Simple highlighting logic
    const parts = documentText.split(selectedClause.sourceText);
    
    // If exact match not found (e.g. formatting diffs in our mock), just return text
    if (parts.length === 1) {
      return <p className="whitespace-pre-wrap">{documentText}</p>;
    }

    return (
      <p className="whitespace-pre-wrap">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <mark className="bg-amber-200 text-amber-900 rounded-sm px-1 py-0.5 transition-colors duration-500 shadow-sm border border-amber-300">
                {selectedClause.sourceText}
              </mark>
            )}
          </React.Fragment>
        ))}
      </p>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] border-l border-neutral-200 shadow-inner">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 shadow-sm z-10">
        <div className="flex items-center space-x-2 truncate">
          <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="text-sm font-medium text-neutral-700 truncate">{documentName}</span>
        </div>
        <div className="flex items-center space-x-3 text-neutral-400 ml-4 shrink-0">
          <button className="hover:text-neutral-900 transition-colors"><Search className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-neutral-200" />
          <button className="hover:text-neutral-900 transition-colors"><ZoomOut className="w-4 h-4" /></button>
          <span className="text-xs font-medium text-neutral-500 w-8 text-center">100%</span>
          <button className="hover:text-neutral-900 transition-colors"><ZoomIn className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 lg:p-12" ref={contentRef}>
        <div className="max-w-2xl mx-auto bg-white p-10 lg:p-16 shadow-sm border border-neutral-200 rounded-sm font-serif text-[15px] leading-loose text-neutral-800">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
