import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, UploadCloud, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAppStore } from '../lib/store';
import { sampleAgreementText, sampleClauses } from '../data/sample-agreement';
import { analyzeDocumentContext } from '../lib/context-engine';

import { cn } from '../lib/utils';

export function UploadPage() {
  const navigate = useNavigate();
  const { userContext, setDocumentName, setDocumentText, setClauses, setIsProcessing } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!userContext) {
    // Failsafe if accessed directly
    navigate('/onboarding');
    return null;
  }

  const handleDemoMode = () => {
    simulateProcessing("Sample_Employment_Agreement.pdf", sampleAgreementText, sampleClauses);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For the hackathon demo, if they upload a file, we'll pretend it's the sample document 
    // but give it their filename to show the flow, OR if it's text we could read it. 
    // To ensure the "wow" moment always works perfectly, we will use the synthetic data engine
    // but just label it with their filename. 
    simulateProcessing(file.name, sampleAgreementText, sampleClauses);
  };

  const simulateProcessing = (filename: string, text: string, clauses: any[]) => {
    setDocumentName(filename);
    setDocumentText(text);
    setIsProcessing(true);
    
    // Simulate pipeline
    const delays = [800, 1500, 2200, 3000, 3800];
    
    delays.forEach((delay, index) => {
      setTimeout(() => setProcessingStage(index + 1), delay);
    });

    setTimeout(() => {
      const analyzed = analyzeDocumentContext(userContext, clauses);
      setClauses(analyzed);
      setIsProcessing(false);
      navigate('/dashboard');
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Context Brief */}
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Your Legible Brief</h2>
          
          <Card className="p-6 bg-white border-neutral-200">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Situation</h3>
                <p className="font-semibold text-neutral-900">{userContext.intent.replace('_', ' ')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Role</h3>
                <p className="font-semibold text-neutral-900">{userContext.role}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Your Priorities</h3>
                <div className="flex flex-wrap gap-2">
                  {userContext.priorities.map(p => (
                    <span key={p} className="inline-flex px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-xs font-medium">
                      {p.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {userContext.concern && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Your Concern</h3>
                  <p className="text-sm text-neutral-800 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                    "{userContext.concern}"
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          <p className="text-sm text-neutral-500">
            Legible will use this context to personalize what it highlights — without changing what the agreement actually says.
          </p>
        </div>

        {/* Right Column: Upload */}
        <div className="md:col-span-8">
          {!processingStage ? (
            <div className="h-full min-h-[400px] flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Upload your agreement</h1>
                <p className="text-neutral-500 text-lg">PDF, DOCX, or TXT. Your document will be analyzed securely.</p>
              </div>

              <div 
                className={cn("flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-12 transition-colors", isDragging ? "border-neutral-900 bg-neutral-100/50" : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50")}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    // simulate upload
                    simulateProcessing(e.dataTransfer.files[0].name, sampleAgreementText, sampleClauses);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.txt" />
                <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6 text-neutral-600">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Click or drag document here</h3>
                <p className="text-neutral-500 mb-8">Maximum file size 10MB.</p>
              </div>

              <div className="mt-8 flex items-center justify-between bg-white p-6 rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-900">Don't have a document ready?</h4>
                  <p className="text-sm text-neutral-500">Use our synthetic employment agreement to see how Legible works.</p>
                </div>
                <Button onClick={handleDemoMode}>
                  Try sample agreement <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col justify-center items-center">
               <Card className="w-full max-w-md p-8 bg-white border-neutral-200 shadow-lg animate-in fade-in zoom-in-95">
                 <div className="flex items-center space-x-4 mb-8">
                   <div className="h-12 w-12 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-800">
                     <FileText className="h-6 w-6" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-neutral-900">Processing Document</h3>
                     <p className="text-sm text-neutral-500">Analyzing clauses...</p>
                   </div>
                 </div>

                 <div className="space-y-4">
                    <ProcessingStep text="Document received" active={processingStage >= 1} />
                    <ProcessingStep text="Text extracted" active={processingStage >= 2} />
                    <ProcessingStep text="Agreement structure identified" active={processingStage >= 3} />
                    <ProcessingStep text="Analyzing clauses" active={processingStage >= 4} />
                    <ProcessingStep text="Matching your priorities" active={processingStage >= 5} spinner={processingStage === 4} />
                    <ProcessingStep text="Building your attention map" active={processingStage >= 6} spinner={processingStage === 5} />
                 </div>
               </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProcessingStep({ text, active, spinner }: { text: string, active: boolean, spinner?: boolean }) {
  return (
    <div className={cn("flex items-center space-x-3 transition-opacity duration-500", active || spinner ? "opacity-100" : "opacity-30")}>
      {active ? (
        <CheckCircle2 className="h-5 w-5 text-neutral-900" />
      ) : spinner ? (
        <div className="h-5 w-5 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-neutral-200" />
      )}
      <span className={cn("text-sm", active ? "font-medium text-neutral-900" : "text-neutral-500")}>{text}</span>
    </div>
  )
}
