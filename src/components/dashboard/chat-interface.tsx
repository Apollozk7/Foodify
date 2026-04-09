'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Paperclip,
  Image as ImageIcon,
  X,
  Sparkles,
  Loader2,
  User,
  Bot,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/hooks/use-generation';
import Image from 'next/image';
import { compressImage } from '@/lib/utils/compress-image';
import { BeforeAfterSlider } from '@/components/ui/before-after-slider';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, file: File | null) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedFile) || isLoading || isCompressing) return;

    onSendMessage(inputText, selectedFile);
    setInputText('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const lastUserImage = [...messages]
    .reverse()
    .find(m => m.role === 'user' && m.imageUrl)?.imageUrl;

  return (
    <div className="flex flex-col h-full flex-1 bg-black overflow-hidden min-h-0">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide min-h-0"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2"
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-heading font-extrabold text-white tracking-tighter leading-tight"
            >
              Sua foto simples com <br />
              <span className="text-primary">cara de profissional.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-500 text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed"
            >
              Mande uma foto do seu celular e deixe nossa IA criar o cenário perfeito para você
              vender muito mais.
            </motion.p>
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
            className="flex items-start gap-4"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-[#111111] border border-white/5 rounded-2xl rounded-tl-none p-3">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-8 md:px-10 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start px-2 mb-3"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#111111]">
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

        <div className="relative flex items-center bg-[#111111] border border-white/[0.03] rounded-[32px] pl-6 pr-1.5 py-1.5 shadow-2xl">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={
              isCompressing ? 'Otimizando imagem...' : 'Diga algo ou descreva um visual...'
            }
            disabled={isLoading || isCompressing}
            className="flex-1 bg-transparent text-white placeholder:text-neutral-600 text-base focus:outline-none disabled:opacity-50 h-10"
          />

          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isCompressing}
              className="p-2.5 text-neutral-600 hover:text-white transition-colors disabled:opacity-50"
            >
              {isCompressing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <button
              onClick={handleSend}
              disabled={(!inputText.trim() && !selectedFile) || isLoading || isCompressing}
              className="flex items-center justify-center w-10 h-10 bg-[#c8bfff] rounded-2xl text-[#1a0063] transition-all active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-600"
            >
              <ArrowUp className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message, beforeImageUrl }: { message: Message; beforeImageUrl?: string }) {
  const isAi = message.role === 'ai';

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `apetit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-start gap-4 md:gap-6', !isAi && 'flex-row-reverse')}
    >
      <div
        className={cn(
          'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 border',
          isAi ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/10'
        )}
      >
        {isAi ? (
          <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
        ) : (
          <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
        )}
      </div>

      <div
        className={cn('max-w-[85%] md:max-w-[80%] space-y-3', !isAi && 'flex flex-col items-end')}
      >
        <div
          className={cn(
            'p-4 rounded-2xl text-[13px] md:text-sm leading-relaxed font-medium',
            isAi
              ? 'bg-[#111111] border border-white/5 rounded-tl-none text-neutral-300'
              : 'bg-primary text-black font-bold rounded-tr-none shadow-lg'
          )}
        >
          {message.content}
        </div>

        {message.imageUrl && (
          <div className="relative w-40 md:w-48 aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-xl">
            <Image src={message.imageUrl} alt="User input" fill className="object-cover" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-black uppercase tracking-wide text-white">
              Original
            </div>
          </div>
        )}

        {isAi &&
          (message.generatedImageUrl ||
            message.status === 'pending' ||
            message.status === 'processing') && (
            <div className="relative w-full max-w-2xl rounded-[24px] overflow-hidden border border-white/5 bg-[#0A0A0A] shadow-2xl group mt-1">
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
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles className="w-4 h-4 text-primary absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[9px] font-black text-primary uppercase tracking-label">
                      {message.status === 'processing'
                        ? 'RENDERIZANDO HARDWARE'
                        : 'ANALISANDO COMPOSIÇÃO'}
                    </p>
                  </div>
                </div>
              )}

              {message.generatedImageUrl && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    onClick={() => handleDownload(message.generatedImageUrl!)}
                    className="px-4 py-2 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-wide shadow-xl hover:bg-primary transition-all flex items-center gap-2"
                  >
                    <Download className="w-3 h-3" />
                    RAW
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
    </motion.div>
  );
}
