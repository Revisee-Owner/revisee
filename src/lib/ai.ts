const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const FREE_TIER_MONTHLY_LIMIT = 5;

type AIAction = "summarize" | "quiz" | "study_guide";

interface AIResult {
  content: string;
  tokensUsed: number;
}

const SYSTEM_PROMPTS: Record<AIAction, string> = {
  summarize: `You are a study assistant. Summarize the following notes into clear, concise bullet points that a student can quickly review. Focus on key concepts, definitions, and important relationships. Keep it under 300 words.`,

  quiz: `You are a study assistant. Generate 5 multiple-choice quiz questions based on the following notes. For each question, provide 4 options (A-D) and indicate the correct answer. Format as JSON array:
[{"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..."}]
Return ONLY the JSON array, no other text.`,

  study_guide: `You are a study assistant. Create a structured study guide from the following notes. Include:
1. Key Topics (with brief explanations)
2. Important Terms & Definitions
3. Connections Between Concepts
4. Suggested Review Questions
Keep it organized and scannable. Use markdown formatting.`,
};

export async function generateAI(
  action: AIAction,
  noteContent: string
): Promise<AIResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPTS[action],
      messages: [
        {
          role: "user",
          content: `Here are my notes:\n\n${noteContent.slice(0, 4000)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  return {
    content: text,
    tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
  };
}

export function canUseAI(plan: string, creditsUsed: number): boolean {
  if (plan === "PRO") return true;
  return creditsUsed < FREE_TIER_MONTHLY_LIMIT;
}

export function getAICreditsRemaining(plan: string, creditsUsed: number): number {
  if (plan === "PRO") return Infinity;
  return Math.max(0, FREE_TIER_MONTHLY_LIMIT - creditsUsed);
}
