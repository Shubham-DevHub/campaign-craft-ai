import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  const suggestions = [
    "Product launch for sustainable sneakers",
    "Seasonal summer sale for a boutique hotel",
    "Newsletter about AI trends in healthcare",
    "B2B service offering for cybersecurity"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your campaign (e.g. 'Flash sale for luxury coffee beans')..."
          className="w-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 pr-16 text-lg min-h-[120px] focus:outline-none focus:border-orange-500/50 transition-all resize-none font-sans placeholder:text-white/20"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="absolute bottom-4 right-4 p-3 bg-orange-500 hover:bg-orange-600 disabled:bg-white/5 disabled:text-white/20 text-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
        </button>
      </form>

      <AnimatePresence>
        {!isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-xs text-white/60 transition-all font-mono"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
