# StudyFlow — AI Study Planner & Academic Assistant

> **Live Application URL:** [https://studyplannerv3-o9li.vercel.app/] 
> **GitHub Repository:** [https://github.com/palakijaz/studyplannerv3/tree/main](https://github.com/palakijaz/studyplannerv3)

---

## 📌 Project Overview & Problem Statement

### The Problem
Students often struggle with managing complex academic workloads, balancing multiple assignments, and staying consistent with study schedules. Standard calendar apps lack domain-specific tools for academic planning, while generic task managers don't adapt dynamically to upcoming deadlines, exam dates, or personal study pacing.

### The Solution
**StudyFlow** is an end-to-end AI-powered study planner designed specifically for modern students. It helps users organize subjects, build tailored daily study schedules, break down dense academic tasks, and leverage an AI tutor for real-time guidance—all inside a unified, distraction-free web dashboard.

---

## ✨ Key Features

* **Interactive Dashboard:** Real-time overview of active subjects, daily tasks, study streak, and upcoming exam deadlines.
* **AI Daily Study Planner:** Generates customized step-by-step study routines based on upcoming assignment dates and target goals.
* **AI Academic Tutor:** An integrated study assistant capable of explaining complex topics, summarizing notes, and generating practice questions.
* **Notes & Resource Library:** Store, organize, and revise study materials and lecture notes categorized by subject.
* **Focus Timer:** Built-in Pomodoro timer with study/break intervals to boost session productivity.
* **Subject & Task Manager:** Full CRUD capabilities to manage subjects, add specific assignments, and track progress.

---

## 🤖 AI Feature & Prompt Design

### How the AI Feature Works
StudyFlow incorporates an AI Tutor and AI Schedule Generator driven by Google Gemini API. The AI contextually adapts to user inputs, subject choices, and study goals to produce structured study plans and academic explanations.

### System Prompt / System Instructions
The AI engine is governed by the following core system prompt:

```text
You are an intelligent, supportive, and structured AI Academic Tutor and Study Assistant.
Your goal is to help students break down complex coursework, organize their study schedules, 
and learn efficiently.

When asked to generate study plans:
1. Provide action-oriented, structured daily or weekly breakdowns.
2. Estimate time per sub-task realistically based on standard student study patterns.
3. Keep formatting clean, scannable, and formatted clearly using Markdown headers and bullet points.

When explaining concepts:
1. Break down difficult subjects into clear, digestible steps.
2. Use analogies, concise summaries, and quick practice questions where appropriate.
3. Maintain an encouraging, focused, and academic tone.
🛠️ Tech Stack & Services Used
Frontend Framework: React (TypeScript) with Vite

Styling & UI: Tailwind CSS, Lucide React Icons

Deployment & Hosting: Vercel

AI Model: Google Gemini API (gemini-1.5-flash)

Version Control: Git & GitHub

📸 Screenshots
<img width="625" height="540" alt="Screenshot 2026-07-25 21 54 22" <img width="1022" height="620" alt="Screenshot 2026-07-25 21 55 58" src="https://github.com/user-attachments/assets/aaf0760c-23bf-4c1d-a451-d52a01298336" />
<img width="1022" height="524" alt="Screenshot 2026-07-25 21 55 32" src="https://github.com/user-attachments/assets/bf2f81a3-cba4-47df-840f-dbc576da09ae" />
src="https://github.com/user-attachments/assets/1c1cbd60-8268-47f9-ab07-7c1bda885dad" />


🚀 How to Run the Project Locally
Prerequisites
Node.js (v18 or higher)

npm or yarn

Setup Steps
Clone the repository:

Bash
git clone [https://github.com/palakijaz/studyplannerv3.git](https://github.com/palakijaz/studyplannerv3.git)
cd studyplannerv3
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory and add your Google Gemini API key:

Code snippet
VITE_GEMINI_API_KEY=your_gemini_api_key_here
Start the local development server:

Bash
npm run dev
Build for production:

Bash
npm run build

---

### Final Steps:
1. Open the **Chromebook Files app** next to GitHub.
2. Drag 3 screenshot images from your files and drop them directly under the **`## 📸 Screenshots`** heading in the editor.
3. Scroll down and click **Commit changes...**.
4. Open `[https://github.com/palakijaz/studyplannerv3](https://github.com/palakijaz/studyplannerv3)` in an **Incognito window** to confirm it is live and public!
