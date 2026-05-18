import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, 
  ExternalLink, 
  Download, 
  Sparkles, 
  X, 
  ArrowLeft, 
  Info,
  Send,
  Loader2,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { schools, School } from "./data";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Sidebar = ({ currentStep, totalSteps, logoUrl }: { currentStep: number; totalSteps: number; logoUrl: string }) => {
  return (
    <div className="w-80 h-full bg-brand-dark text-white p-8 flex flex-col hidden lg:flex">
      <div className="mb-12">
        <img src={logoUrl} alt="EMAD Logo" className="w-40 object-contain" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1">
        <h2 className="font-display text-2xl font-bold mb-8">EMAD Pathways</h2>
        <div className="space-y-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={cn(
                "w-3 h-3 rounded-full transition-colors duration-300",
                i <= currentStep ? "bg-white" : "bg-white/20"
              )} />
              <span className={cn(
                "text-sm transition-opacity duration-300 font-medium",
                i === currentStep ? "opacity-100" : "opacity-40"
              )}>
                {i === totalSteps - 1 ? "Resultats" : `Pas ${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto opacity-40 text-xs">
        <p>© 2026 EMAD Ajuntament de La Garriga</p>
      </div>
    </div>
  );
};

const Header = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="lg:hidden p-4 border-b bg-white flex items-center justify-between sticky top-0 z-20">
      <h1 className="font-display font-bold text-brand-dark">EMAD Pathways</h1>
      <span className="text-sm font-medium text-brand-dark/60">
        Pas {currentStep + 1} / {totalSteps}
      </span>
    </div>
  );
};

const Drawer = ({ isOpen, onClose, school }: { isOpen: boolean; onClose: () => void; school: School | null }) => {
  return (
    <AnimatePresence>
      {isOpen && school && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-lg bg-white z-50 p-8 shadow-2xl overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
            
            <div className="mt-8">
              <div className="inline-block px-3 py-1 bg-brand-dark/5 text-brand-dark text-xs font-bold rounded-full mb-4">
                {school.type}
              </div>
              <h2 className="text-4xl font-display font-black text-brand-dark mb-2 tracking-tight">{school.name}</h2>
              <p className="text-brand-dark/60 mb-8">{school.description}</p>
              
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-3 font-sans">Crèdits</h3>
                  <p className="text-lg font-medium">{school.credits}</p>
                </section>
                
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-3 font-sans">El teu perfil</h3>
                  <p className="text-gray-700 leading-relaxed">{school.perfil}</p>
                </section>
                
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-3 font-sans">Instal·lacions</h3>
                  <p className="text-gray-700 leading-relaxed">{school.instalacions}</p>
                </section>
                
                <div className="grid grid-cols-2 gap-8">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-3 font-sans">Networking i pràctiques</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500" />
                       <p className="font-semibold text-brand-dark">{school.networking}</p>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-3 font-sans">Erasmus i mobilitat</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{school.erasmus}</p>
                  </section>
                </div>
              </div>
              
              <div className="mt-12">
                <a 
                  href={school.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:gap-4 transition-all w-full justify-center group"
                >
                  Visitar Lloc Web
                  <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ResultCard = ({ school, onOpenDetail }: { school: School; onOpenDetail: (s: School) => void }) => {
  return (
    <motion.div 
      layout
      className="bg-white border-2 border-transparent hover:border-brand-dark/10 rounded-2xl p-6 shadow-sm flex flex-col transition-all cursor-default group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark/40">{school.type}</span>
          <h3 className="text-2xl font-display font-black text-brand-dark leading-none mt-1">{school.name}</h3>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">{school.description}</p>
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => onOpenDetail(school)}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-brand-dark hover:text-white transition-all group/btn"
        >
          <span className="font-bold flex items-center gap-2 truncate">
            Més informació
          </span>
          <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
        
        <a 
          href={school.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 p-4 border-2 border-brand-dark text-brand-dark rounded-xl font-bold hover:bg-brand-dark/5 transition-colors"
        >
          Lloc Web
          <ExternalLink size={16} />
        </a>
      </div>
    </motion.div>
  );
};

const ChatAssistant = ({ results }: { results: School[] }) => {
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: "user" as const, text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    
    // Get API key from env (VITE_ prefix is required for client side)
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
      setMessages([...newMessages, { role: "model" as const, text: "Error: No s'ha trobat la clau VITE_API_KEY a l'entorn." }]);
      setIsLoading(false);
      return;
    }
    
    try {
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: `Ets un assistent d'orientació acadèmica per a l'escola d'art i disseny EMAD. Sigues molt escurat i directe (màxim 2-3 frases). Parla sempre en català. Tens com a referència aquestes escoles que l'usuari ha rebut com a recomanació: ${results.map(s => s.name).join(", ")}.`
      });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      
      setMessages([...newMessages, { role: "model" as const, text: response.text() }]);
    } catch (error: any) {
      console.error(error);
      setMessages([...newMessages, { role: "model" as const, text: "Ho sento, he tingut un error al processar la teva pregunta: " + (error.message || "Error d'API") }]);
    } finally {
      setIsLoading(false);
    }
  };

  const preDefinedTags = [
    "Organitza-les segons millor a pitjor?",
    "No m'encaixen, quin plan B hi ha?",
    "Quin cost real tindria el primer any?",
    "Hi ha beques a les que acollir-me?"
  ];

  return (
    <div className="bg-white border rounded-2xl flex flex-col h-[700px] shadow-lg sticky top-8">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h3 className="font-display font-black text-lg text-brand-dark">Com et puc ajudar?</h3>
          <p className="text-sm text-brand-dark/50">Pregunta i afina les propostes finals</p>
        </div>
        <div className="w-10 h-10 rounded-full ai-gradient-bg flex items-center justify-center shadow-lg relative shrink-0">
          <Sparkles className="text-white" size={20} />
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full pulsing-dot" />
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-30">
            <Sparkles size={40} className="mx-auto mb-4" />
            <p className="text-sm">Inicia una conversa o clica un tag</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex flex-col max-w-[85%]",
            m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
          )}>
            <div className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              m.role === "user" ? "bg-brand-dark text-white rounded-tr-none" : "bg-gray-100 text-brand-dark rounded-tl-none"
            )}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-brand-dark/40 text-xs font-medium">
            <Loader2 size={14} className="animate-spin" />
            Generant resposta...
          </div>
        )}
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div className="flex flex-wrap gap-2">
          {preDefinedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => sendMessage(tag)}
              disabled={isLoading}
              className="px-3 py-1.5 border border-brand-dark/20 rounded-[4px] text-[11px] font-bold text-brand-dark hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-all disabled:opacity-50"
            >
              {tag}
            </button>
          ))}
        </div>
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="relative"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escriu aquí..."
            className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-dark focus:bg-white rounded-xl px-5 py-4 pr-14 text-sm font-medium transition-all outline-none"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-dark text-white rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const logoUrl = "https://res.cloudinary.com/dpznnlqsc/image/upload/v1771873044/emad_ajlagarriga_ojomld.png";
  const resultsRef = useRef<HTMLDivElement>(null);

  const questions = [
    {
      id: 1,
      title: "Hola! 👋 Quin tipus de formació estàs buscant principalment?",
      options: ["Grau Universitari Oficial", "Cicle Formatiu (CFGS)", "Títol propi o Diplomes", "Vull veure-ho tot"]
    },
    {
      id: 2,
      title: "Quina disciplina et crida més l'atenció?",
      options: ["Disseny Gràfic i Visual", "Disseny d'Interiors", "Moda i Tèxtil", "Disseny de Producte", "Audiovisual / Multimèdia"]
    },
    {
      id: 3,
      title: "Quina valoració mínima busques en les opinions dels centres?",
      options: ["Qualsevol valoració", "Més de 3 ⭐", "Més de 4 ⭐", "Només excel·lents (4.5+)"]
    },
    {
      id: 4,
      title: "Quina importància li dones a les instal·lacions i tallers?",
      options: ["Imprescindible, vull tallers Pro", "Molt important", "Important", "Busco un centre més teòric"]
    }
  ];

  const totalSteps = questions.length + 1;

  const handleAnswer = (val: string) => {
    setAnswers({ ...answers, [step]: val });
    setStep(step + 1);
  };

  const exportPDF = async () => {
    if (!resultsRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(resultsRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("EMAD-Recomanacions.pdf");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredSchools = Array.from(schools).sort(() => Math.random() - 0.5).slice(0, 3); // Simulated matching logic

  const openDrawer = (s: School) => {
    setSelectedSchool(s);
    setDrawerOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans bg-white">
      <Sidebar currentStep={step} totalSteps={totalSteps} logoUrl={logoUrl} />
      
      <main className="flex-1 overflow-y-auto relative bg-white">
        <Header currentStep={step} totalSteps={totalSteps} />
        
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
          <AnimatePresence mode="wait">
            {step < questions.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl"
              >
                <div className="inline-block bg-brand-dark/5 px-4 py-2 rounded-full mb-6 text-brand-dark font-bold text-sm">
                  Pas {step + 1} de {questions.length}
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-brand-dark mb-10 leading-tight tracking-tight">
                  {questions[step].title}
                </h2>
                <div className="grid gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="group flex items-center justify-between p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-brand-dark hover:bg-brand-dark hover:text-white transition-all text-left shadow-sm"
                    >
                      <span className="text-xl font-bold">{opt}</span>
                      <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="mt-8 flex items-center gap-2 text-brand-dark/40 hover:text-brand-dark font-bold px-4 py-2 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    Anterior
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16">
                  <div className="max-w-2xl">
                    <h2 className="text-5xl lg:text-7xl font-display font-black text-brand-dark mb-6 leading-none tracking-tighter">
                      Hem trobat el teu camí ideal.
                    </h2>
                    <p className="text-xl text-brand-dark/60 font-medium">
                      Basant-nos en les teves preferències, aquests són els centres que millor encaixen amb el teu perfil creatiu.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button 
                      onClick={exportPDF}
                      disabled={isExporting}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-brand-dark text-white px-8 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isExporting ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                      PDF
                    </button>
                    <button 
                      onClick={() => setStep(0)}
                      className="flex-1 lg:flex-none bg-brand-dark/5 text-brand-dark px-8 py-5 rounded-2xl font-black text-lg hover:bg-brand-dark/10 transition-all border-2 border-brand-dark/5"
                    >
                      Reiniciar Test
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                   <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6" ref={resultsRef}>
                      {filteredSchools.map((school) => (
                        <ResultCard key={school.id} school={school} onOpenDetail={openDrawer} />
                      ))}
                      
                      <div className="md:col-span-2 bg-gray-50 border-2 border-dashed border-brand-dark/10 rounded-2xl p-8 text-center">
                        <p className="text-brand-dark/40 font-bold">Encara tens dubtes? Consulta a l'assistent d'IA a la dreta →</p>
                      </div>
                   </div>
                   
                   <div className="relative">
                      <ChatAssistant results={filteredSchools} />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} school={selectedSchool} />
    </div>
  );
}

