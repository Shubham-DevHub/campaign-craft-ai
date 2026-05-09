import React from 'react';
import { motion } from 'motion/react';
import { Mail, Copy, Check, Info, Layout, Smartphone, Target } from 'lucide-react';
import { GeneratedCampaign } from '../types';
import Markdown from 'react-markdown';

interface CampaignPreviewProps {
  campaign: GeneratedCampaign;
}

export const CampaignPreview: React.FC<CampaignPreviewProps> = ({ campaign }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto py-12"
    >
      {/* Sidebar Info */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono flex items-center gap-2">
            <Target className="w-4 h-4" /> Strategy
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-white/30 uppercase mb-1">Target Audience</p>
              <p className="text-sm text-white/80 leading-relaxed font-medium">{campaign.targetAudience}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase mb-1">Brand Tone</p>
              <p className="text-sm text-white/80 leading-relaxed font-medium">{campaign.tone}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono flex items-center gap-2">
            <Layout className="w-4 h-4" /> Visual Identity
          </h3>
          {campaign.imageUrl ? (
            <div className="rounded-xl overflow-hidden aspect-[16/9] relative group border border-white/10">
              <img
                src={campaign.imageUrl}
                alt="AI Generated Campaign Visual"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-end items-end">
                <p className="text-[10px] text-white/60 font-mono italic truncate">{campaign.imagePrompt}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-[16/9] animate-pulse bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
              <p className="text-xs text-white/20">Rendering visual...</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Campaign Content */}
      <div className="lg:col-span-8 space-y-8">
        {/* Subject Lines */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">Subject Variations</h3>
          <div className="space-y-2">
            {campaign.subjectLines.map((subject, i) => (
              <div key={i} className="group relative flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-orange-500/30 transition-all">
                <span className="text-sm md:text-base text-white/90">{subject}</span>
                <button
                  onClick={() => copyToClipboard(subject, i)}
                  className="p-2 text-white/40 hover:text-orange-500 transition-colors"
                >
                  {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Body Copy Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">Campaign Draft</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white/80 transition-colors">
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(campaign.bodyCopy, 99)}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg text-xs hover:bg-orange-500/20 transition-all font-mono"
              >
                {copiedIndex === 99 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copy Body
              </button>
            </div>
          </div>

          <div className="glass-panel p-8 md:p-12 min-h-[400px]">
             {campaign.imageUrl && (
                <div className="mb-8 rounded-lg overflow-hidden border border-white/5">
                   <img src={campaign.imageUrl} className="w-full" referrerPolicy="no-referrer" alt="Campaign Banner" />
                </div>
             )}
             <div className="max-w-none">
               <div className="markdown-body">
                <Markdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-display font-bold mb-6 text-white" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-display font-semibold mt-8 mb-4 text-white" {...props} />,
                    p: ({node, ...props}) => <p className="text-white/70 leading-relaxed mb-4 text-sm md:text-base" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-white/70" {...props} />,
                    li: ({node, ...props}) => <li className="text-sm md:text-base" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-orange-500 font-semibold" {...props} />,
                  }}
                >
                  {campaign.bodyCopy}
                </Markdown>
               </div>
             </div>
             
             <div className="mt-12 flex justify-center">
                <button className="px-8 py-4 bg-orange-500 text-black font-display rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-orange-500/20 active:scale-95">
                  {campaign.callToAction}
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
