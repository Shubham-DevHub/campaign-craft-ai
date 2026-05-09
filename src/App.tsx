import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Layers, History, ArrowRight } from 'lucide-react';
import { PromptInput } from './components/PromptInput';
import { CampaignPreview } from './components/CampaignPreview';
import { MonetizationSection } from './components/MonetizationSection';
import { generateCampaignContent, generateCampaignVisual } from './services/geminiService';
import { GeneratedCampaign } from './types';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<GeneratedCampaign | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setCampaign(null);
    setError(null);

    try {
      const content = await generateCampaignContent(prompt);
      const newCampaign: GeneratedCampaign = {
        ...content,
        id: Math.random().toString(36).substring(7),
        createdAt: Date.now(),
      };
      setCampaign(newCampaign);

      // Async image generation to not block text display if we wanted to show text early
      // But for total campaign feel, we can await it or update it later
      try {
        const imageUrl = await generateCampaignVisual(content.imagePrompt);
        setCampaign(prev => prev ? { ...prev, imageUrl } : null);
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
        // We still have the text content
      }

    } catch (err) {
      console.error(err);
      setError('System failure. Could not orchestrate campaign generation.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 md:py-24">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full opacity-50" />
      </div>

      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] uppercase tracking-widest font-mono"
        >
          <Terminal className="w-3 h-3" /> System Engine Ready
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white">
          Campaign<span className="text-orange-500">Craft</span>
        </h1>
        <p className="text-white/40 max-w-xl mx-auto text-lg">
          Transform a single spark an idea into a complete, strategic email marketing offensive.
        </p>
      </div>

      {/* Core Interaction */}
      <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-red-400 font-mono text-sm uppercase tracking-tighter"
        >
          {error}
        </motion.p>
      )}

      {/* Results Rendering */}
      <div className="w-full mt-12">
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-24 space-y-8"
            >
              <div className="relative">
                 <div className="w-24 h-24 rounded-full border-2 border-white/5 border-t-orange-500 animate-spin" />
                 <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-orange-500 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">Analyzing Market Intent</p>
                <div className="flex items-center gap-1">
                   <div className="w-1 h-3 bg-orange-500/40 animate-[bounce_1s_infinite_0ms]" />
                   <div className="w-1 h-5 bg-orange-500/60 animate-[bounce_1s_infinite_200ms]" />
                   <div className="w-1 h-4 bg-orange-500 animate-[bounce_1s_infinite_400ms]" />
                </div>
              </div>
            </motion.div>
          )}

          {campaign && !isGenerating && (
             <CampaignPreview key="result" campaign={campaign} />
          )}
        </AnimatePresence>
      </div>

      {/* Monetization / Commercial Strategy */}
      <MonetizationSection />

      {/* Footer / Meta */}
      <footer className="mt-auto pt-24 pb-8 w-full border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
        <div className="flex gap-8 mb-4 md:mb-0">
          <span className="flex items-center gap-2"><Layers className="w-3 h-3" /> Multi-Model Synth</span>
          <span className="flex items-center gap-2"><History className="w-3 h-3" /> Auto-Archived</span>
        </div>
        <p>&copy; 2026 CampaignCraft Logic Engines</p>
      </footer>
    </div>
  );
}
