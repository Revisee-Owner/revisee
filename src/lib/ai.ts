const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const FREE_TIER_MONTHLY_LIMIT = 5;

type AIAction = "summarize" | "quiz" | "study_guide";

interface AIResult {
  content: string;
}

const SYSTEM_PROMPTS: Record<AIAction, string> = {
  summarize: `You are a study assistant. Summarize the following notes into clear, concise bullet points that a student can quickly review. Focus on key concepts, definitions, and important relationships. Keep it under 300 words.`,

  quiz: `You are a study assistant. Generate 5 multiple-choice quiz questions based on the following notes. For each question, provide 4 options (A-D) and indicate the correct answer with a brief explanation. Format clearly.`,

  study_guide: `You are a study assistant. Create a structured study guide from the following notes. Include: 1. Key Topics with brief explanations, 2. Important Terms and Definitions, 3. Connections Between Concepts, 4. Suggested Review Questions. Keep it organized and scannable.`,
};

export async function generateAI(
  action: AIAction,
  noteContent: string
): Promise<AIResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPTS[action]}\n\nHere are my notes:\n\n${noteContent.slice(0, 4000)}`
        }]
      }]
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return { content: text };
}

export function canUseAI(plan: string, creditsUsed: number): boolean {
  if (plan === "PRO") return true;
  return creditsUsed < FREE_TIER_MONTHLY_LIMIT;
}

export function getAICreditsRemaining(plan: string, creditsUsed: number): number {
  if (plan === "PRO") return Infinity;
  return Math.max(0, FREE_TIER_MONTHLY_LIMIT - creditsUsed);
}