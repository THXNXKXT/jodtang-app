// ponytail: keyword → category icon key. Match by substring, case-insensitive.
// Add keywords here when categories grow. Lazy: not a config file, hardcoded.
export const NOTE_KEYWORDS: Record<string, string[]> = {
  food: ["ข้าว", "อาหาร", "ก๋วย", "ส้มตำ", "หมู", "ไก่", "เส้น", "food", "eat", "lunch", "dinner"],
  transport: ["แก๊ส", "รถ", "เมล์", "BTS", "MRT", "น้ำมัน", "แท็กซี่", "transport", "taxi", "fuel"],
  shopping: ["ช้อป", "ซื้อ", "shopee", "lazada", "shopping"],
  entertainment: ["หนัง", "เพลง", "netflix", "game", "movie", "spotify"],
  utilities: ["ไฟ", "น้ำปะปา", "อินเทอร์เน็ต", "internet", "bill", "ค่าไฟ"],
  health: ["ยา", "หมอ", "โรงพยาบาล", "คลินิก", "doctor", "medicine"],
  phone: ["เครื่อง", "มือ", "โทร", "phone", "sim", "เติมเงิน"],
  coffee: ["กาแฟ", "โอเลี้ยง", "ชา", "tea", "coffee", "starbucks"],
  salary: ["เงินเดือน", "salary", "wage"],
  rent: ["เช่า", "rent", "หอ"],
};

export function suggestCategoryIcon(note: string): string | null {
  const n = note.toLowerCase().trim();
  if (!n) return null;
  for (const [icon, kws] of Object.entries(NOTE_KEYWORDS)) {
    if (kws.some((k) => n.includes(k.toLowerCase()))) return icon;
  }
  return null;
}
