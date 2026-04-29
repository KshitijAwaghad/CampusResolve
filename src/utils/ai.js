import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const CATEGORIES = [
  "Electrical",
  "Network",
  "Classroom",
  "Security",
  "Laboratory",
  "Hostel",
  "Library",
  "Washroom",
  "Building",
];

export async function analyzeComplaintWithAI(description, locationType) {
  if (!apiKey) {
    console.warn("No Gemini API key found, using fallback logic.");
    return fallbackAnalysis(description, locationType);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI assistant for a university campus grievance management system.
      Analyze the following complaint from a student or staff member.

      Complaint Description: "${description}"
      Location Type: "${locationType || 'Unknown'}"

      Task:
      1. Categorize the complaint into exactly one of these categories: ${CATEGORIES.join(", ")}. Choose the most relevant one. If none fit well, choose "Building".
      2. Calculate a priority score from 0 to 100 based on urgency. 
         - Critical safety/fire/security hazards should be 80-100.
         - Major disruptions to learning (e.g. no internet, projector broken) should be 50-79.
         - Minor annoyances (e.g. dirty washroom, squeaky door) should be 10-49.

      Return ONLY a valid JSON object in exactly this format, with no markdown formatting or other text:
      {
        "category": "String",
        "score": Number
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Strip markdown code block if present
    let jsonString = responseText;
    if (jsonString.startsWith("\`\`\`json")) {
      jsonString = jsonString.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (jsonString.startsWith("\`\`\`")) {
      jsonString = jsonString.replace(/\`\`\`/g, "").trim();
    }

    const parsed = JSON.parse(jsonString);
    
    return {
      category: CATEGORIES.includes(parsed.category) ? parsed.category : "Building",
      score: Math.min(Math.max(parsed.score || 10, 0), 100),
    };
  } catch (error) {
    console.error("Gemini AI Analysis Failed:", error);
    return fallbackAnalysis(description, locationType);
  }
}

function fallbackAnalysis(description, locationType) {
  const text = (description || "").toLowerCase();
  let category = "Building";
  let score = 10;

  if (text.includes("fire") || text.includes("spark") || text.includes("shock")) {
    category = "Electrical";
    score = 90;
  } else if (text.includes("internet") || text.includes("wifi")) {
    category = "Network";
    score = 60;
  } else if (text.includes("theft") || text.includes("unsafe")) {
    category = "Security";
    score = 85;
  } else if (text.includes("water") || text.includes("leak") || text.includes("toilet")) {
    category = "Washroom";
    score = 40;
  } else if ((locationType || "").toLowerCase().includes("hostel")) {
    category = "Hostel";
    score = 30;
  }

  return { category, score };
}

export function detectCategory(description = "", selectedCategory = "") {
  const text = description.toLowerCase();
  const normalizedCategory = selectedCategory.toLowerCase().includes("hostel") ? "Hostel" : selectedCategory;
  let bestCategory = normalizedCategory || "Building";
  let maxMatches = -1;

  const CATEGORY_KEYWORDS = {
    Electrical: ["spark", "short circuit", "fire", "power", "current", "voltage", "burning", "electrical"],
    Network: ["internet", "wifi", "router", "network", "slow", "latency", "disconnect"],
    Classroom: ["fan", "projector", "board", "classroom", "lecture"],
    Security: ["theft", "unsafe", "security", "intruder", "cctv", "gate"],
    Laboratory: ["chemical", "lab", "equipment", "experiment"],
    Hostel: ["hostel", "room", "mess", "warden"],
    Library: ["library", "book", "reading"],
    Washroom: ["washroom", "toilet", "leak", "smell"],
    Building: ["lift", "stair", "corridor", "building"]
  };

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, words]) => {
    const score = words.reduce((acc, word) => (text.includes(word) ? acc + 1 : acc), 0);
    if (score > maxMatches) {
      maxMatches = score;
      bestCategory = category;
    }
  });

  return bestCategory;
}

export function calculatePriorityScore({ category, description, locationType }) {
  const text = (description || "").toLowerCase();
  let score = 0;

  if (category === "Electrical") score += 50;
  if (category === "Security") score += 50;
  if (category === "Network" || category === "Laboratory" || category === "Computer Lab") score += 35;
  if (category === "Classroom") score += 25;
  if (category === "Hostel") score += 15;

  if (text.includes("fire")) score += 40;
  if (text.includes("smoke") || text.includes("urgent") || text.includes("danger")) score += 25;
  if (text.includes("injury") || text.includes("shock")) score += 30;

  if ((locationType || "").toLowerCase().includes("hostel")) score += 10;

  return Math.min(score, 100);
}

export function scoreToPriority(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function deriveBuilding(locationType, specificLocation) {
  if (locationType?.includes("Hostel")) return locationType;
  if (specificLocation?.includes("Block A")) return "Block A";
  if (specificLocation?.includes("Block B")) return "Block B";
  if (specificLocation?.includes("Library")) return "Main Library";
  if (specificLocation?.includes("Hostel 1")) return "Hostel 1";
  if (specificLocation?.includes("Hostel 2")) return "Hostel 2";
  if (specificLocation?.includes("Hostel 3")) return "Hostel 3";
  if (specificLocation?.includes("Lab")) return "Lab Complex";
  return locationType || "Campus";
}
