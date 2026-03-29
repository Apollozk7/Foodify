"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Image as ImageIcon, X, Sparkles, Loader2, User, Bot, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/use-generation";
import Image from "next/image";
import { compressImage } from "@/lib/utils/compress-image";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, file: File | null) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch (err) {
      console.error("Compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedFile) || isLoading || isCompressing) return;
    
    onSendMessage(inputText, selectedFile);
    setInputText("");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Find the last user image to show in the before/after slider
  const lastUserImage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user" && messages[i].imageUrl) {
        return messages[i].imageUrl;
      }
    }
    return undefined;
  }, [messages]);

  return (
    <div className="flex flex-col h-full flex-1 bg-white/[0.01] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-sm min-h-0">
      {/* Chat Header - Simplified */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-none">Aprimoramento de Imagens</h3>
            <p className="text-[9px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Nano Banana 2
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide min-h-0"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white font-medium">Pronto para começar</p>
              <p className="text-[10px] text-slate-400 max-w-[180px]">
                Envie uma foto e diga como quer o resultado.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} beforeImageUrl={lastUserImage} />
          ))
        )}
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3">
              <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area - Floating Glass style */}
      <div className="p-4 bg-gradient-to-t from-black/20 to-transparent">
        <div className="bg-white/[0.03] border border-white/10 rounded-[24px] p-2 backdrop-blur-xl shadow-2xl">
          <AnimatePresence>
            {previewUrl && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 80, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-2 pt-2 mb-2 relative group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  <button 
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isCompressing}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {isCompressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            
            <div className="flex-1 relative">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isCompressing ? "Otimizando imagem..." : "Descreva o que quer gerar..."}
                disabled={isLoading || isCompressing}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            <button 
              onClick={handleSend}
              disabled={(!inputText.trim() && !selectedFile) || isLoading || isCompressing}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:bg-slate-800"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message, beforeImageUrl }: { message: Message, beforeImageUrl?: string }) {
  const isAi = message.role === "ai";
  
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `estudio-ia-pro-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex items-start gap-3",
        !isAi && "flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border",
        isAi ? "bg-blue-600/20 border-blue-500/20" : "bg-white/10 border-white/10"
      )}>
        {isAi ? <Bot className="w-3.5 h-3.5 text-blue-400" /> : <User className="w-3.5 h-3.5 text-slate-300" />}
      </div>

      <div className={cn(
        "max-w-[85%] space-y-2",
        !isAi && "flex flex-col items-end"
      )}>
        {/* Content Bubble */}
        <div className={cn(
          "p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed",
          isAi 
            ? "bg-white/5 border border-white/5 rounded-tl-none text-slate-200" 
            : "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20"
        )}>
          {message.content}
        </div>

        {/* User Image Attachment */}
        {message.imageUrl && (
          <div className="relative w-40 aspect-square rounded-xl overflow-hidden border border-white/10 shadow-xl">
            <Image src={message.imageUrl} alt="User input" fill className="object-cover" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-medium text-white">
              Original
            </div>
          </div>
        )}

        {/* AI Result */}
        {isAi && (message.generatedImageUrl || message.status === "pending" || message.status === "processing") && (
          <div className="relative w-full max-w-sm rounded-[20px] overflow-hidden border border-white/5 bg-white/[0.02] shadow-2xl mt-1 group">
            {message.generatedImageUrl && beforeImageUrl ? (
              <div className="aspect-square md:aspect-video">
                <BeforeAfterSlider 
                  beforeImage={beforeImageUrl}
                  afterImage={message.generatedImageUrl}
                />
              </div>
            ) : message.generatedImageUrl ? (
              <div className="relative aspect-square md:aspect-video">
                <Image 
                  src={message.generatedImageUrl} 
                  alt="Generated result" 
                  fill 
                  className="object-cover" 
                />
              </div>
            ) : (
              <div className="aspect-square md:aspect-video flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                  <Sparkles className="w-4 h-4 text-blue-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                    {message.status === "processing" ? "Renderizando..." : "Analisando..."}
                  </p>
                </div>
              </div>
            )}
            
            {message.generatedImageUrl && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button 
                  onClick={() => handleDownload(message.generatedImageUrl!)}
                  className="px-3 py-1.5 rounded-lg bg-white text-black text-[10px] font-bold shadow-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
