import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { cn } from '../lib/utils';

const intents = [
  { id: 'sign', label: "I'm about to sign it", sub: "Understand an agreement before signing." },
  { id: 'resign', label: "I'm thinking about resigning", sub: "Understand obligations related to leaving." },
  { id: 'terminated', label: "My employer is ending my employment", sub: "Review relevant termination provisions." },
  { id: 'current', label: "I'm already employed", sub: "Understand an agreement you're currently under." },
  { id: 'general', label: "I just want to understand it", sub: "Get a general overview of the document." },
];

const priorityOptions = [
  { id: 'compensation', label: 'Compensation' },
  { id: 'notice', label: 'Notice period' },
  { id: 'intellectual_property', label: 'Intellectual property' },
  { id: 'side_projects', label: 'Side projects' },
  { id: 'confidentiality', label: 'Confidentiality' },
  { id: 'post_employment', label: 'Restrictions after leaving' },
  { id: 'termination', label: 'Termination' },
  { id: 'working_conditions', label: 'Working conditions' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { setUserContext } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState('');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [concern, setConcern] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      setUserContext({ intent, priorities, role, concern });
      navigate('/upload');
    }
  };

  const togglePriority = (id: string) => {
    setPriorities(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      <div className="max-w-2xl mx-auto w-full px-8 py-16 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex items-center justify-between mb-16">
           <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
             Step {step} of 4
           </span>
           <div className="flex space-x-2">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className={cn("h-1.5 w-12 rounded-full transition-all", step >= i ? "bg-neutral-900" : "bg-neutral-200")} />
             ))}
           </div>
        </div>

        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-3">What brings you here?</h1>
                <p className="text-neutral-500 text-lg font-medium">Your situation helps Legible focus the experience.</p>
              </div>
              <div className="mt-10">
                <div className="grid gap-4">
                  {intents.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setIntent(opt.id)}
                      className={cn(
                        "text-left px-6 py-5 rounded-2xl border-2 transition-all flex flex-col",
                        intent === opt.id ? "border-neutral-900 bg-white shadow-md" : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                      )}
                    >
                      <span className="font-bold text-lg text-neutral-900 mb-1">{opt.label}</span>
                      <span className="text-sm font-medium text-neutral-500">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">What matters most to you?</h1>
              <p className="text-neutral-500 text-lg font-medium mb-10">Select anything you'd like Legible to pay particular attention to.</p>
              <div className="flex flex-wrap gap-3">
                {priorityOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => togglePriority(opt.id)}
                    className={cn(
                      "px-5 py-3 rounded-full border-2 transition-all font-bold text-[15px]",
                      priorities.includes(opt.id) ? "border-neutral-900 bg-neutral-900 text-white shadow-sm" : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600 hover:text-neutral-900"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {priorities.length > 0 && (
                <p className="text-sm font-bold text-neutral-400 mt-6">{priorities.length} priorities selected</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">Tell us a little about yourself</h1>
              <p className="text-neutral-500 text-lg font-medium mb-10">This helps Legible understand standard industry context.</p>
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Your Role</label>
                <input 
                  type="text"
                  placeholder="e.g. Software Engineer, Marketing Manager"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full text-lg font-medium px-6 py-5 rounded-2xl border-2 border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-all bg-white"
                  autoFocus
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Software Engineer', 'Designer', 'Product', 'Marketing', 'Sales'].map(s => (
                    <button key={s} onClick={() => setRole(s)} className="px-4 py-2 bg-neutral-100 rounded-full text-sm font-bold hover:bg-neutral-200 text-neutral-600 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl font-extrabold tracking-tight mb-3">Anything specific you're worried about?</h1>
              <p className="text-neutral-500 text-lg font-medium mb-10">Optional. Be as specific as you like.</p>
              <textarea 
                placeholder="Example: I build software projects outside work."
                value={concern}
                onChange={e => setConcern(e.target.value)}
                className="w-full text-lg font-medium px-6 py-5 rounded-2xl border-2 border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-all bg-white min-h-[200px] resize-none"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-12 pt-8">
          <Button variant="ghost" className="font-bold text-neutral-500 hover:text-neutral-900" onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
          <Button 
            size="lg" 
            className="rounded-full px-10 h-14 font-bold text-lg"
            onClick={handleNext}
            disabled={
              (step === 1 && !intent) ||
              (step === 2 && priorities.length === 0) ||
              (step === 3 && !role)
            }
          >
            {step === 4 ? 'Review Brief' : 'Continue'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
