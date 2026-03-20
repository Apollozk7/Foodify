'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "O que é um crédito?",
    answer: "1 crédito = 1 imagem gerada. Você envia uma foto do seu prato e o Estúdio IA Pro transforma em uma imagem profissional. Cada geração consome 1 crédito."
  },
  {
    question: "Quanto tempo leva pra gerar uma foto?",
    answer: "Em média menos de 30 segundos. Assim que a geração for concluída, a imagem já fica disponível para download."
  },
  {
    question: "A IA remove o fundo automaticamente?",
    answer: "Sim. A IA identifica o prato e aplica um fundo limpo e profissional automaticamente, sem que você precise fazer nada."
  },
  {
    question: "Posso usar as fotos no iFood, Rappi e outros apps de delivery?",
    answer: "Sim, as imagens geradas são suas e podem ser usadas em qualquer plataforma — iFood, Rappi, Aiqfome, WhatsApp, Instagram e onde mais precisar."
  },
  {
    question: "Os créditos expiram?",
    answer: "Não. Seus créditos ficam disponíveis até serem utilizados, sem data de vencimento."
  },
  {
    question: "Como funciona a compra de créditos?",
    answer: "Você compra o pacote que preferir e os créditos caem na sua conta na hora. Não há assinatura nem cobrança recorrente — você compra quando precisar."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "PIX, cartão de crédito e débito. O pagamento é processado de forma segura via Stripe."
  },
  {
    question: "Que tipo de foto devo enviar pra ter melhor resultado?",
    answer: "Fotos com boa iluminação e o prato em destaque geram os melhores resultados. Evite fotos muito escuras, borradas ou com muita bagunça ao redor do prato. Quanto mais limpa a foto original, mais profissional fica o resultado."
  },
  {
    question: "A ferramenta funciona com qualquer tipo de comida?",
    answer: "Sim. Funciona com pratos quentes, lanches, açaí, pizzas, marmitas, bebidas e qualquer outro item de cardápio."
  },
  {
    question: "Posso refazer uma geração se não gostar do resultado?",
    answer: "Cada geração consome 1 crédito. Se o resultado não ficou como esperado, você pode gerar novamente com uma foto melhor ou em outro ângulo."
  },
  {
    question: "Minhas fotos ficam armazenadas?",
    answer: "Suas imagens ficam salvas na sua conta para que você possa baixá-las quando quiser. Não compartilhamos suas fotos com terceiros."
  },
  {
    question: "Ainda tenho dúvidas. Como entro em contato?",
    answer: "Fala com a gente pelo Instagram [@estudioia.pro] ou pelo e-mail suporte@estudioiapro.com.br. Respondemos em até 24 horas."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto font-poppins">
      <div className="text-center mb-16 space-y-4">
        <p className="text-sm font-bold tracking-widest text-blue-500 uppercase">Dúvidas Frequentes</p>
        <h2 className="text-3xl md:text-5xl font-bold font-work-sans tracking-tight text-white">
          Tudo o que você precisa saber
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div key={index} className="group">
              <button 
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "w-full flex items-center justify-between p-6 text-left transition-all duration-300 rounded-[24px] border",
                  isOpen 
                    ? "bg-white/10 border-white/20" 
                    : "bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10"
                )}
              >
                <span className="text-base md:text-lg font-semibold text-slate-200 pr-8">{faq.question}</span>
                <div className={cn(
                  "shrink-0 size-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isOpen ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400"
                )}>
                  {isOpen ? <X className="size-4" /> : <Plus className="size-4" />}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 py-6">
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base font-inter">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
