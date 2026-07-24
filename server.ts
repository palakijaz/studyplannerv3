import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// --- API ENDPOINTS ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. Generate Structured AI Study Plan
app.post("/api/ai/study-plan", async (req, res) => {
  try {
    const { subject, examDate, availableHoursPerDay, topics, goal } = req.body;

    if (!subject || !examDate) {
      return res.status(400).json({ error: "Subject and Exam Date are required" });
    }

    const ai = getGeminiClient();
    const prompt = `Create a realistic, structured multi-day study plan for the subject: "${subject}".
Target exam/goal date: ${examDate}.
Available study time per day: ${availableHoursPerDay || 2} hours.
Topics/Syllabus to cover: ${Array.isArray(topics) ? topics.join(", ") : topics || "All key fundamentals"}.
Main goal: ${goal || "Ace the final exam with high comprehension"}.

Generate a 5-day structured plan in valid JSON format.
Each day should have a title, clear objectives, and 2-3 focused study sessions with estimated duration in minutes and activity types (reading, practice, review, or quiz).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  objectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  sessions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        topic: { type: Type.STRING },
                        durationMinutes: { type: Type.INTEGER },
                        activityType: { type: Type.STRING, description: "reading, practice, review, or quiz" },
                        description: { type: Type.STRING },
                      },
                      required: ["topic", "durationMinutes", "activityType", "description"],
                    },
                  },
                },
                required: ["dayNumber", "title", "objectives", "sessions"],
              },
            },
            studyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["title", "overview", "days", "studyTips"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json({ success: true, plan: data });
  } catch (error: any) {
    console.error("Study Plan AI Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate study plan" });
  }
});

// 2. AI Tutor & Explanation Chat
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { question, subject, contextNotes, history } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getGeminiClient();

    let systemInstruction = `You are StudyFlow AI, an exceptionally clear, patient, and engaging academic tutor.
Your goal is to break down concepts into intuitive, easy-to-digest steps using:
1. Clear headers and structured markdown formatting.
2. Real-world analogies or practical examples.
3. Key takeaways / bullet highlights.
4. A quick 1-question check-for-understanding at the end.`;

    if (subject) {
      systemInstruction += `\nSubject context: ${subject}.`;
    }
    if (contextNotes) {
      systemInstruction += `\nStudent reference notes/material:\n${contextNotes}`;
    }

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push(`${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`);
      }
    }
    contents.push(`Student Question: ${question}`);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents.join("\n\n"),
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    res.status(500).json({ error: error.message || "Failed to get AI response" });
  }
});

// 3. AI Flashcards Generator
app.post("/api/ai/generate-flashcards", async (req, res) => {
  try {
    const { topicOrNotes, count = 6, difficulty = "medium" } = req.body;

    if (!topicOrNotes) {
      return res.status(400).json({ error: "Topic or study notes are required" });
    }

    const ai = getGeminiClient();
    const prompt = `Generate ${count} high-quality study flashcards for topic/notes:
"${topicOrNotes}"
Target Difficulty: ${difficulty}.

Ensure questions test key definitions, formulas, principles, core concepts, or problem-solving.
Answers should be clear, concise, and educational.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: "Question, term, or prompt on front" },
              back: { type: Type.STRING, description: "Detailed answer or explanation on back" },
              category: { type: Type.STRING, description: "Subtopic tag" },
            },
            required: ["front", "back", "category"],
          },
        },
      },
    });

    const jsonText = response.text || "[]";
    const cards = JSON.parse(jsonText);
    res.json({ success: true, cards });
  } catch (error: any) {
    console.error("Flashcard AI Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate flashcards" });
  }
});

// 4. AI Quiz Generator
app.post("/api/ai/generate-quiz", async (req, res) => {
  try {
    const { topicOrNotes, numQuestions = 5 } = req.body;

    if (!topicOrNotes) {
      return res.status(400).json({ error: "Topic or study notes required" });
    }

    const ai = getGeminiClient();
    const prompt = `Generate a ${numQuestions}-question multiple choice quiz on:
"${topicOrNotes}"

For each question:
- Provide 4 distinct options (A, B, C, D).
- Specify 0-indexed correct option (correctIndex).
- Provide a clear, educational explanation of why that answer is correct.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctIndex", "explanation"],
          },
        },
      },
    });

    const jsonText = response.text || "[]";
    const questions = JSON.parse(jsonText);
    res.json({ success: true, questions });
  } catch (error: any) {
    console.error("Quiz AI Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// 5. AI Notes Summarizer & Term Extractor
app.post("/api/ai/summarize-notes", async (req, res) => {
  try {
    const { notesContent } = req.body;

    if (!notesContent) {
      return res.status(400).json({ error: "Notes content is required" });
    }

    const ai = getGeminiClient();
    const prompt = `Analyze and summarize the following student study notes:
"""
${notesContent}
"""

Provide:
1. Executive summary paragraph.
2. Main key takeaways bullet list.
3. Essential key terms with clear definitions.
4. Suggested review questions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ["term", "definition"],
              },
            },
            reviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["summary", "keyTakeaways", "keyTerms", "reviewQuestions"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    res.json({ success: true, result });
  } catch (error: any) {
    console.error("Summarize Notes Error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize notes" });
  }
});

// --- VITE MIDDLEWARE & SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyFlow Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
