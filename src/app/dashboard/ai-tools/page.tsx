"use client";

import { useState } from "react";
import { Sparkles, BookOpen, FileQuestion, GraduationCap, Crown, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const AI_TOOLS = [
  {
    id: "summarize",
    label: "Summarize Notes",
    description: "Turn messy notes into clear, concise summaries",
    icon: Sparkles,
    color: "text-brand-500",
    bgColor: "bg-brand-50",
  },
  {
    id: "quiz",
    label: "Generate Quiz",
    description: "Create practice questions from your notes",
    icon: FileQuestion,
    color: "text-accent-orange",
    bgColor: "bg-accent-orange/10",
  },
  {
    id: "study_guide",
    label: "Study Guide",
    description: "Build a structured review guide",
    icon: GraduationCap,
    color: "text-accent-green",
    bgColor: "bg-accent-green/10",
  },
];

const DEMO_SUMMARY = `## Key Concepts: Binary Trees

- **Definition**: Hierarchical data structure where each node has at most two children (left and right)
- **Types**: Full, Complete, Perfect, and Balanced binary trees
- **Core operations**: Insert, Delete, Search — all O(log n) average case for balanced trees
- **Traversals**: In-order (left-root-right), Pre-order (root-left-right), Post-order (left-right-root)
- **Applications**: Expression parsing, Huffman coding, BST for sorted data, heaps for priority queues

**Key takeaway**: Understanding traversal order is critical for exam questions. In-order on a BST gives sorted output.`;

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const creditsRemaining = 5;
  const plan = "FREE";

  const handleGenerate = async () => {
    if (!input.trim() || !activeTool) return;
    setLoading(true);
    setOutput("");

    // Simulate API call (replace with real /api/ai/[action] call)
    await new Promise((r) => setTimeout(r, 1500));
    setOutput(DEMO_SUMMARY);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-xl text-ink-0 flex items-center gap-2">
          <Sparkles size={22} className="text-brand-500" /> AI Study Tools
        </h1>
        <p className="text-sm text-ink-3 mt-1">
          Paste your notes and let AI help you study smarter.
        </p>
      </div>

      {/* Credits */}
      <div className="card px-5 py-3.5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
            <Sparkles size={18} className="text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-0">
              {plan === "FREE" ? `${creditsRemaining} AI credits remaining` : "Unlimited AI credits"}
            </p>
            <p className="text-[11px] text-ink-3">
              {plan === "FREE" ? "Free plan — 5 per month" : "Pro plan"}
            </p>
          </div>
        </div>
        {plan === "FREE" && (
          <Button size="sm" variant="secondary">
            <span className="flex items-center gap-1.5">
              <Crown size={13} /> Upgrade
            </span>
          </Button>
        )}
      </div>

      {/* Tool picker */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)} style={{ cursor: "pointer" }}
            className={cn(
              "card px-4 py-4 text-left transition-all cursor-pointer",
              activeTool === tool.id
                ? "border-brand-400 shadow-glow"
                : "hover:border-surface-4"
            )}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", tool.bgColor)}>
              <tool.icon size={20} className={tool.color} />
            </div>
            <h3 className="font-medium text-sm text-ink-0">{tool.label}</h3>
            <p className="text-[11px] text-ink-3 mt-1">{tool.description}</p>
          </button>
        ))}
      </div>

      {/* Input + output */}
      {activeTool && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-1 mb-1.5">
              Paste your notes
            </label>
            <textarea
              className="input-field h-40 resize-none font-mono text-sm"
              placeholder="Paste or type your notes here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            loading={loading}
            disabled={!input.trim() || loading}
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              {loading ? "Generating..." : `Generate ${AI_TOOLS.find((t) => t.id === activeTool)?.label}`}
            </span>
          </Button>

          {output && (
            <div className="card p-5 relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm text-ink-0">Result</h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink-0 transition-colors"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="text-sm text-ink-1 leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
