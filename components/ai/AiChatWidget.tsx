'use client';
/* eslint-disable react-hooks/purity */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, X, Send, Sparkles, User, Calendar, Copy, Check, RotateCcw, Plus, History, MessageSquare, Loader2,
  Mic, MicOff, Square
} from 'lucide-react';
import BookMeetingModal from '@/components/modals/BookMeetingModal';
import {
  getOrCreateActiveSessionId,
  createNewChatSession,
  loadVisitorChatSessions,
  saveSessionMessage,
  ChatSession,
  SavedChatMessage,
} from '@/lib/chatStore';

// Code Block component with language header and copy button
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-xl bg-black/80 border border-white/10 overflow-hidden shadow-lg font-mono text-[11px]">
      <div className="px-3 py-1.5 bg-white/[0.04] border-b border-white/10 flex justify-between items-center text-[10px] text-white/50 select-none">
        <span className="font-semibold uppercase tracking-wider text-violet-400">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-emerald-300 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Inline Text Formatter supporting bold, bullets, inline code
function renderTextWithFormatting(text: string) {
  const lines = text.split('\n');
  return (
    <span>
      {lines.map((line, lIdx) => {
        const formattedLine = line.split(/(\*\*.*?\*\*|`.*?`)/g).map((chunk, cIdx) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) {
            return <strong key={cIdx} className="font-bold text-white">{chunk.slice(2, -2)}</strong>;
          }
          if (chunk.startsWith('`') && chunk.endsWith('`') && chunk.length > 2) {
            return <code key={cIdx} className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-[11px]">{chunk.slice(1, -1)}</code>;
          }
          return chunk;
        });

        const isBullet = line.trim().startsWith('• ') || line.trim().startsWith('* ') || line.trim().startsWith('- ');

        return (
          <span key={lIdx} className={isBullet ? 'block pl-3 my-0.5 text-violet-200' : 'block'}>
            {isBullet ? '• ' : ''}
            {formattedLine}
          </span>
        );
      })}
    </span>
  );
}

// Main Markdown Renderer with fenced code block support
function renderMarkdown(text: string) {
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {renderTextWithFormatting(text.substring(lastIndex, match.index))}
        </span>
      );
    }
    const lang = match[1] || 'code';
    const code = match[2].trim();
    parts.push(<CodeBlock key={`code-${match.index}`} language={lang} code={code} />);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {renderTextWithFormatting(text.substring(lastIndex))}
      </span>
    );
  }

  return <>{parts}</>;
}

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('session-ssr');
  const [historySessions, setHistorySessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<SavedChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: "Hi there! I'm **Abishek's AI Technical Assistant**. Speak 🎤 or type in **English, Tanglish, Tamil (தமிழ்), or Hindi (हिंदी)** for coding help, bug fixes, or booking a call!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');

  // Voice Input (Speech-to-Text) States
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const latestInputRef = useRef<string>('');

  // Check browser SpeechRecognition support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSpeechSupported(!!SpeechRecognition);
    }
  }, []);

  // Sync ref with input state for speech recognition callback
  useEffect(() => {
    latestInputRef.current = input;
  }, [input]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Stop Speech Recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
      setIsListening(false);
    }
  }, []);

  // Initialize Session ID & Load Persistent Chat History
  const loadChatHistory = useCallback(async () => {
    const activeId = getOrCreateActiveSessionId();
    setSessionId(activeId);

    const savedSessions = await loadVisitorChatSessions();
    setHistorySessions(savedSessions);

    const currentSession = savedSessions.find((s) => s.sessionId === activeId);
    if (currentSession && currentSession.messages.length > 0) {
      setMessages(currentSession.messages);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        loadChatHistory();
        scrollToBottom();
      }, 0);
      return () => clearTimeout(timer);
    } else {
      stopListening();
    }
  }, [isOpen, loadChatHistory, scrollToBottom, stopListening]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isGenerating, isTypingEffect, isListening, isOpen, scrollToBottom]);

  const handleNewChat = () => {
    stopListening();
    const newId = createNewChatSession();
    setSessionId(newId);
    setShowHistory(false);
    const initialMsg: SavedChatMessage = {
      id: `init-${Date.now()}`,
      sender: 'ai',
      text: "Started a **new conversation**! Ask or speak in **English, Tanglish, Tamil, or Hindi**.",
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMsg]);
  };

  const handleSwitchSession = (session: ChatSession) => {
    stopListening();
    setSessionId(session.sessionId);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simulate typing effect for AI response (Text only - NO voice output)
  const triggerTypingEffect = (aiMsgId: string, fullText: string, onComplete?: () => void) => {
    setIsTypingEffect(true);
    let currIndex = 0;
    const chunkSize = Math.max(1, Math.floor(fullText.length / 40));

    const interval = setInterval(() => {
      currIndex += chunkSize;
      if (currIndex >= fullText.length) {
        currIndex = fullText.length;
        clearInterval(interval);
        setIsTypingEffect(false);
        if (onComplete) onComplete();
      }

      const partialText = fullText.substring(0, currIndex);
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, text: partialText } : m))
      );
      scrollToBottom();
    }, 20);
  };

  const handleSend = async (customPrompt?: string) => {
    stopListening();

    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isGenerating || isTypingEffect) return;

    const timestamp = new Date().toISOString();
    const uniqueId = Math.random().toString(36).substring(2, 9);

    const userMsg: SavedChatMessage = {
      id: `user-msg-${uniqueId}`,
      sender: 'user',
      text: promptToSend.trim(),
      timestamp,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLastUserPrompt(promptToSend.trim());
    if (!customPrompt) setInput('');
    setIsGenerating(true);

    // Save user message to persistent session store
    saveSessionMessage(sessionId, userMsg, promptToSend.trim());

    try {
      const historyPayload = newMessages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      // Send to OpenRouter AI App Router Endpoint (/api/ai/chat)
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToSend.trim(), messages: historyPayload }),
      });

      const data = await res.json();

      if (data.openBookingModal) {
        setIsBookingOpen(true);
      }

      if (data.success && (data.reply || data.message)) {
        const fullReply = data.reply || data.message;
        const aiMsgId = `ai-msg-${Math.random().toString(36).substring(2, 9)}`;

        // Create empty AI message initially for typing effect
        const aiMsg: SavedChatMessage = {
          id: aiMsgId,
          sender: 'ai',
          text: '',
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsGenerating(false);

        // Trigger Typing Effect (Text only)
        triggerTypingEffect(aiMsgId, fullReply, () => {
          saveSessionMessage(sessionId, { ...aiMsg, text: fullReply });
        });
      } else {
        setIsGenerating(false);
        const errorText = data.error || 'OpenRouter AI service returned an error. Please try again.';
        const errMsg: SavedChatMessage = {
          id: `ai-err-${Math.random().toString(36).substring(2, 9)}`,
          sender: 'ai',
          text: errorText,
          isError: true,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch {
      setIsGenerating(false);
      const errMsg: SavedChatMessage = {
        id: `ai-err-${Math.random().toString(36).substring(2, 9)}`,
        sender: 'ai',
        text: 'Network failure connecting to OpenRouter AI service. Please check your network connection.',
        isError: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const retryCountRef = useRef<number>(0);

  // Start Web Speech API Speech-to-Text Listener
  const startListening = async () => {
    if (typeof window === 'undefined') return;

    // 1. Check HTTPS / Localhost Requirement
    const isSecureOrigin =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    console.log('🎤 [Voice AI] Origin Secure (HTTPS/localhost):', isSecureOrigin);
    console.log('🎤 [Voice AI] Browser User-Agent:', navigator.userAgent);

    if (!isSecureOrigin) {
      setVoiceNotice('Voice input requires HTTPS or localhost.');
      console.warn('🎤 [Voice AI] Error: Insecure origin. SpeechRecognition requires HTTPS or localhost.');
      return;
    }

    // 2. Detect SpeechRecognition API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    console.log('🎤 [Voice AI] SpeechRecognition Supported:', !!SpeechRecognition);

    if (!SpeechRecognition) {
      setVoiceNotice('Voice input is not supported in this browser.');
      console.warn('🎤 [Voice AI] Error: SpeechRecognition API not supported in browser.');
      return;
    }

    setVoiceNotice(null);

    // 3. Query Permission Status if Permissions API is available
    let permStatus = 'prompt';
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        permStatus = result.state;
        console.log('🎤 [Voice AI] Microphone Permission Status:', permStatus);
      } catch {
        console.log('🎤 [Voice AI] Permissions API query for microphone not supported.');
      }
    }

    if (permStatus === 'denied') {
      console.warn('🎤 [Voice AI] Microphone permission is blocked in browser settings.');
      setIsListening(false);
      setVoiceNotice('Microphone permission is blocked. Please enable it from your browser settings.');
      return;
    }

    // If permission is prompt (not yet granted), call getUserMedia to trigger permission popup once
    if (permStatus === 'prompt' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        console.log('🎤 [Voice AI] Prompting user for microphone permission via getUserMedia...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('🎤 [Voice AI] getUserMedia Success! Permission granted.');
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: unknown) {
        console.warn('🎤 [Voice AI] getUserMedia Error / Access Denied:', err);
        setIsListening(false);
        setVoiceNotice('Microphone permission is blocked. Please enable it from your browser settings.');
        return;
      }
    } else {
      console.log('🎤 [Voice AI] Microphone permission already granted or prompt handled.');
    }

    // 4. Initialize & Start Speech Recognition
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('🎤 [Voice AI] Recognition Started');
        setIsListening(true);
        setVoiceNotice(null);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          console.log('🎤 [Voice AI] Speech Result:', transcript);
          setInput(transcript);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.warn('🎤 [Voice AI] Recognition Error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setVoiceNotice('Microphone permission is blocked. Please enable it from your browser settings.');
        } else if (event.error === 'no-speech') {
          setVoiceNotice('No speech detected. Please try again.');
          // Auto retry once if no speech was detected
          if (retryCountRef.current < 1) {
            retryCountRef.current += 1;
            console.log('🎤 [Voice AI] Auto-retrying speech recognition once...');
            setTimeout(() => {
              startListening();
            }, 300);
          }
        } else if (event.error === 'audio-capture') {
          setVoiceNotice('No microphone found or audio capture failed.');
        } else {
          setVoiceNotice(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('🎤 [Voice AI] Recognition Ended. Final transcript:', latestInputRef.current);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('🎤 [Voice AI] Speech Start Exception:', msg);
      setIsListening(false);
      setVoiceNotice('Failed to start speech recognition. Please try again.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto">
        {/* Trigger Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="group relative p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/40 border border-white/20 flex items-center gap-2 font-semibold text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400"
              aria-label="Ask AI Assistant with Voice Input"
            >
              <Mic size={20} className="animate-pulse text-emerald-400 shrink-0" />
              <span className="hidden sm:inline font-bold">Ask AI Assistant</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-[calc(100vw-2rem)] max-w-[440px] h-[calc(100vh-5rem)] max-h-[590px] bg-neutral-900/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/[0.08] bg-neutral-950/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      AI Assistant <Sparkles size={12} className="text-violet-400" />
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Voice-to-Text Ready
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleNewChat}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-white/70 hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
                    title="New Chat Session"
                  >
                    <Plus size={13} /> New Chat
                  </button>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-white/70 hover:text-white text-[11px] flex items-center border border-white/10 transition-colors cursor-pointer"
                    title="Chat History"
                  >
                    <History size={14} />
                  </button>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="p-1.5 rounded-lg bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 text-[11px] font-semibold flex items-center gap-1 border border-violet-500/20 cursor-pointer"
                    title="Book Strategy Call"
                  >
                    <Calendar size={13} /> Call
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat History Drawer Overlay */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border-b border-white/[0.08] bg-neutral-950/95 max-h-56 overflow-y-auto space-y-2 text-xs z-20"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-white text-xs flex items-center gap-1">
                        <History size={13} className="text-violet-400" /> Saved Conversations ({historySessions.length})
                      </h5>
                      <button onClick={() => setShowHistory(false)} className="text-[10px] text-white/40 hover:text-white cursor-pointer">
                        Close
                      </button>
                    </div>
                    {historySessions.length === 0 ? (
                      <p className="text-[11px] text-white/40 italic">No saved history yet.</p>
                    ) : (
                      historySessions.map((s) => (
                        <button
                          key={s.sessionId}
                          onClick={() => handleSwitchSession(s)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            s.sessionId === sessionId
                              ? 'bg-violet-500/20 border-violet-500/40 text-white'
                              : 'bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="truncate pr-2 flex items-center gap-2">
                            <MessageSquare size={13} className="text-violet-400 flex-shrink-0" />
                            <span className="truncate text-[11px] font-medium">{s.title}</span>
                          </div>
                          <span className="text-[9px] text-white/40 flex-shrink-0 font-mono">
                            {new Date(s.updatedAt).toLocaleDateString()}
                          </span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex gap-2 max-w-[90%]">
                      {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot size={12} />
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-2xl leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-violet-600 text-white rounded-br-none shadow-md'
                            : msg.isError
                            ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-none'
                            : 'bg-white/[0.05] border border-white/[0.08] text-white/90 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {renderMarkdown(msg.text)}

                        {/* Copy Controls */}
                        {msg.sender === 'ai' && !msg.isError && msg.text && (
                          <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-end text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="text-white/40 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <><Check size={11} className="text-emerald-400" /> Copied Text</>
                              ) : (
                                <><Copy size={11} /> Copy Text</>
                              )}
                            </button>
                          </div>
                        )}

                        {msg.isError && (
                          <div className="mt-2 pt-1.5 border-t border-red-500/20 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleSend(lastUserPrompt)}
                              className="text-[10px] text-red-300 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                            >
                              <RotateCcw size={11} /> Retry Request
                            </button>
                          </div>
                        )}
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Voice Status Indicators */}
                {isListening && (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between animate-pulse">
                    <span className="flex items-center gap-2 font-mono font-semibold">
                      <Mic size={14} className="text-red-400 animate-ping" /> 🎤 Listening... Speak in English, Tanglish, Tamil, or Hindi
                    </span>
                    <button
                      type="button"
                      onClick={stopListening}
                      className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Square size={10} /> Stop Listening
                    </button>
                  </div>
                )}

                {isGenerating && (
                  <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs flex items-center gap-2 font-mono">
                    <Loader2 size={14} className="text-violet-400 animate-spin" />
                    <span>🤖 Thinking... Generating response code &amp; answer</span>
                  </div>
                )}

                {voiceNotice && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center justify-between gap-2 shadow-sm">
                    <span className="flex-1 leading-relaxed">{voiceNotice}</span>
                    <button
                      type="button"
                      onClick={startListening}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-[10px] cursor-pointer whitespace-nowrap border border-amber-500/30 transition-colors"
                    >
                      {voiceNotice.includes('blocked') ? 'Open Settings / Retry' : 'Retry'}
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Requirement 21 & 22: Shift+Enter for new line, Enter to send */}
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-white/[0.08] bg-neutral-950/90 flex items-end gap-2">
                {/* Voice Microphone Input Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={!isSpeechSupported}
                  className={`h-[42px] px-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    !isSpeechSupported
                      ? 'bg-white/[0.02] border-white/[0.04] text-white/20 cursor-not-allowed'
                      : isListening
                      ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-white/[0.04] border-white/[0.08] text-violet-400 hover:bg-violet-500/20 hover:text-white'
                  }`}
                  title={
                    !isSpeechSupported
                      ? 'Voice input is not supported in this browser.'
                      : isListening
                      ? 'Stop Listening'
                      : 'Click to Speak (English, Tanglish, Tamil, Hindi)'
                  }
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={
                    isListening
                      ? 'Listening to your voice...'
                      : 'Type message or click 🎤 to speak...'
                  }
                  className="flex-1 max-h-28 min-h-[42px] px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating || isTypingEffect}
                  className="h-[42px] px-3.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BookMeetingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
