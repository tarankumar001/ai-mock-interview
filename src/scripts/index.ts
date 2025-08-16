import{
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  // switched to a larger-quota stable model to reduce free-tier 429s
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    }); 

// Sends a prompt via chatSession with quota/rate-limit aware retries.
export async function sendMessageWithRetry(prompt: string, maxRetries = 3) {
  let attempt = 0;

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  while (attempt <= maxRetries) {
    try {
      const aiResult = await chatSession.sendMessage(prompt);
      return aiResult;
    } catch (err: any) {
      attempt += 1;

      const message = String(err?.message || err);

      // If server returned RetryInfo like "retryDelay":"21s", try to extract seconds
      const retryMatch = message.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
      let waitMs = 0;
      if (retryMatch) {
        const seconds = parseInt(retryMatch[1], 10);
        if (!isNaN(seconds)) waitMs = (seconds + 1) * 1000; // add 1s buffer
      } else if (/quota|rate limit|429/.test(message)) {
        // Exponential backoff if no explicit retryDelay
        waitMs = Math.min(30000, 1000 * Math.pow(2, attempt));
      }

      // If we've exhausted retries, throw the error upward
      if (attempt > maxRetries) {
        throw err;
      }

      // Wait before next retry if we got a suggested delay or backoff computed
      if (waitMs > 0) {
        // eslint-disable-next-line no-console
        console.warn(`Chat API rate limited — retrying in ${waitMs}ms (attempt ${attempt}/${maxRetries})`);
        await sleep(waitMs);
        continue;
      }

      // If no clear path to retry, rethrow
      throw err;
    }
  }
}