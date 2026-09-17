import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Navigate } from 'react-router-dom';
import { FileText, ArrowRight, AlertCircle, MessageSquare, Briefcase, ChevronRight, GitCompare, Compass, Printer, Copy, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AnalyzedClause, analyzeDocumentContext } from '../lib/context-engine';
import { cn } from '../lib/utils';
import { HelpCircle } from 'lucide-react';
import { DocumentViewer } from '../components/DocumentViewer';
import { comparisonData } from '../data/sample-agreement';

export function DashboardPage() {
  const { userContext, setUserContext, documentName, clauses, setClauses, selectedClause, setSelectedClause } = useAppStore();
  const [activeTab, setActiveTab] = useState<'attention' | 'ask' | 'commitments' | 'compare' | 'nextsteps'>('attention');

  if (!userContext || !clauses.length) {
    return <Navigate to="/" />;
  }

  const highAttention = clauses.filter(c => c.attention === 'high');
  const mediumAttention = clauses.filter(c => c.attention === 'medium');
  const lowAttention = clauses.filter(c => c.attention === 'low');

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    if (tab !== 'attention') {
      setSelectedClause(null);
    }
  }

  return (
    <div className="h-screen bg-neutral-50 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex flex-col z-20 shrink-0">
        <div className="p-6 border-b border-neutral-200 flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
             <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-lg leading-tight">Legible</h2>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">{userContext.role}</p>
          </div>
        </div>
        
        <div className="p-4 flex-1 space-y-1 overflow-y-auto">
          <NavItem active={activeTab === 'attention'} onClick={() => handleTabChange('attention')} icon={<AlertCircle className="w-4 h-4"/>} label="Attention Map" />
          <NavItem active={activeTab === 'commitments'} onClick={() => handleTabChange('commitments')} icon={<Briefcase className="w-4 h-4"/>} label="Commitments" />
          <NavItem active={activeTab === 'ask'} onClick={() => handleTabChange('ask')} icon={<MessageSquare className="w-4 h-4"/>} label="Ask Legible" />
          <NavItem active={activeTab === 'compare'} onClick={() => handleTabChange('compare')} icon={<GitCompare className="w-4 h-4"/>} label="Compare" />
          <NavItem active={activeTab === 'nextsteps'} onClick={() => handleTabChange('nextsteps')} icon={<Compass className="w-4 h-4"/>} label="Next Steps" />
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
          <div className="bg-white rounded-lg p-3 border border-neutral-200 shadow-sm">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Change Scenario</h4>
            <select 
              className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-2 text-sm font-medium text-neutral-800 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition-all cursor-pointer"
              value={userContext.intent}
              onChange={(e) => {
                const newContext = { ...userContext, intent: e.target.value };
                setUserContext(newContext);
                const newClauses = analyzeDocumentContext(newContext, clauses);
                setClauses(newClauses);
                setActiveTab('attention');
                setSelectedClause(null);
              }}
            >
              <option value="sign">About to sign</option>
              <option value="current">Already employed</option>
              <option value="resign">Thinking about resigning</option>
              <option value="hr">Discussing with HR</option>
              <option value="lawyer">Preparing for a lawyer</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left/Middle Pane: Analysis */}
        <div className={cn(
          "flex-1 h-full overflow-y-auto bg-neutral-50 transition-all duration-500",
          selectedClause ? "lg:max-w-[55%]" : "w-full"
        )}>
          {selectedClause ? (
            <ClauseDetailView clause={selectedClause} onBack={() => setSelectedClause(null)} />
          ) : (
            <div className="p-8 lg:p-12 max-w-4xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
              {activeTab === 'attention' && (
                <>
                  <header className="mb-10">
                    {userContext.intent === 'resign' ? (
                      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">If you're thinking about resigning</h1>
                    ) : (
                      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">What deserves your attention</h1>
                    )}
                    <p className="text-neutral-500 text-lg">
                      Prioritized based on your role as a <span className="font-semibold text-neutral-700">{userContext.role}</span> and your specific situation.
                    </p>
                  </header>

                  <div className="space-y-12">
                    <Section title="🔴 High attention" items={highAttention} onSelect={setSelectedClause} />
                    <Section title="🟠 Worth reviewing" items={mediumAttention} onSelect={setSelectedClause} />
                    <Section title="🟢 Informational" items={lowAttention} onSelect={setSelectedClause} />
                  </div>
                </>
              )}

              {activeTab === 'ask' && <ChatView />}
              {activeTab === 'commitments' && <CommitmentsView clauses={clauses} />}
              {activeTab === 'compare' && <CompareView />}
              {activeTab === 'nextsteps' && <NextStepsView userContext={userContext} />}
            </div>
          )}
        </div>

        {/* Right Pane: Document Viewer (Hidden on mobile unless selected) */}
        <div className={cn(
          "hidden lg:block h-full transition-all duration-500 shrink-0",
          selectedClause ? "w-[45%]" : "w-0 opacity-0 overflow-hidden"
        )}>
          <DocumentViewer />
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn("w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200", active ? "bg-neutral-900 text-white shadow-md" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Section({ title, items, onSelect }: { title: string, items: AnalyzedClause[], onSelect: (c: AnalyzedClause) => void }) {
  if (items.length === 0) return null;
  
  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-xl font-bold mb-5 flex items-center">{title}</h2>
      <div className="space-y-4">
        {items.map(clause => (
          <Card key={clause.id} className="p-6 cursor-pointer border-neutral-200 hover:border-neutral-400 hover:shadow-lg transition-all duration-300 group bg-white">
            <div className="flex justify-between items-start" onClick={() => onSelect(clause)}>
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
            </div>
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

function ClauseDetailView({ clause, onBack }: { clause: AnalyzedClause, onBack: () => void }) {
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

function ChatView() {
   const [query, setQuery] = useState('');
   const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string, sources?: string}[]>([{
     role: 'assistant',
     content: 'I can answer questions based on the uploaded agreement. What would you like to know?'
   }]);
   const [isTyping, setIsTyping] = useState(false);

   const handleSend = () => {
     if (!query.trim()) return;
     setMessages([...messages, { role: 'user', content: query }]);
     const userQ = query;
     setQuery('');
     setIsTyping(true);
     
     setTimeout(() => {
       const qLower = userQ.toLowerCase();
       let answer = "I couldn't find specific information about that in the agreement. This may require information outside the document.";
       let sources = "";
       
       if (qLower.includes('resign') || qLower.includes('quit') || qLower.includes('leave')) {
         answer = "According to the agreement, you must provide 60 days' written notice if you intend to resign. The company has the option to pay you for this period instead of requiring you to work.";
         sources = "Section 9";
       } else if (qLower.includes('project') || qLower.includes('ip') || qLower.includes('own software') || qLower.includes('side')) {
         answer = "The agreement states that the company owns any inventions you create during employment. It also restricts activities that create a conflict of interest. \n\nHowever, the agreement does not clearly establish whether all independently developed personal projects created on your own time are excluded. A useful question to clarify with HR would be: 'Can independently developed projects created outside work be explicitly excluded?'";
         sources = "Sections 6.1 and 7";
       } else if (qLower.includes('bonus') || qLower.includes('pay') || qLower.includes('salary')) {
         answer = "Your base salary is $120,000. You may be eligible for an annual performance bonus of up to 10% of your base salary. However, this is at the 'sole discretion of the Company' and is not guaranteed.";
         sources = "Section 2.1 and 2.2";
       }

       setMessages(prev => [...prev, { role: 'assistant', content: answer, sources }]);
       setIsTyping(false);
     }, 1200);
   };

   return (
     <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-2">Ask Legible</h1>
          <p className="text-neutral-500 text-lg">Answers are grounded strictly in the uploaded document.</p>
        </header>

        <Card className="flex-1 bg-white border-neutral-200 shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {messages.map((m, i) => (
               <div key={i} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                 <div className={cn("max-w-[85%] rounded-2xl p-5 text-[15px] leading-relaxed", m.role === 'user' ? "bg-neutral-900 text-white rounded-tr-sm" : "bg-neutral-100 text-neutral-900 rounded-tl-sm")}>
                   {m.content.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br/></React.Fragment>)}
                 </div>
                 {m.sources && (
                   <div className="mt-2 flex items-center text-xs font-bold text-neutral-400 uppercase tracking-wider pl-1">
                     <FileText className="w-3 h-3 mr-1" /> Sources: {m.sources}
                   </div>
                 )}
               </div>
             ))}
             {isTyping && (
               <div className="flex items-start">
                 <div className="bg-neutral-100 rounded-2xl rounded-tl-sm p-4 flex space-x-1.5">
                   <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
             )}
          </div>
          <div className="p-4 border-t border-neutral-200 bg-white flex gap-3">
             <input 
               type="text" 
               className="flex-1 rounded-full border border-neutral-300 px-6 py-4 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200 transition-all text-[15px]"
               placeholder="Ask a question about the agreement..."
               value={query}
               onChange={e => setQuery(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
             />
             <Button className="rounded-full px-8 h-[54px] font-semibold" onClick={handleSend}>Send</Button>
          </div>
        </Card>
     </div>
   )
}

function CommitmentsView({ clauses }: { clauses: AnalyzedClause[] }) {
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

function CompareView() {
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

function NextStepsView({ userContext }: { userContext: any }) {
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
                <p className="text-neutral-800 font-medium">Intellectual Property, Side Projects</p>
                <p className="text-neutral-600 mt-1 italic">"{userContext.concern}"</p>
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
