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

export function detectCategory(description = "", selectedCategory = "") {
  const text = description.toLowerCase();
  let bestCategory = selectedCategory || "Building";
  let maxMatches = -1;

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

export function getSlaMinutes(priority) {
  if (priority === "Critical") return 2;
  if (priority === "High") return 3;
  if (priority === "Medium") return 4;
  return 5;
}

export function deriveBuilding(locationType, specificLocation) {
  if (specificLocation?.includes("Block A")) return "Block A";
  if (specificLocation?.includes("Block B")) return "Block B";
  if (specificLocation?.includes("Library")) return "Main Library";
  if (specificLocation?.includes("Hostel 1")) return "Hostel 1";
  if (specificLocation?.includes("Hostel 2")) return "Hostel 2";
  if (specificLocation?.includes("Lab")) return "Lab Complex";
  return locationType || "Campus";
}
