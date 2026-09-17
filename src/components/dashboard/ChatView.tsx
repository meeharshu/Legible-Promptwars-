import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export function ChatView() {
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
