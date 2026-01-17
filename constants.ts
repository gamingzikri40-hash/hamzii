
export const INITIAL_BALANCE = 1000000; // 1jt IDR
export const MAX_BOTS = 3140;
export const COUNTDOWN_TIME = 10; // 10 seconds between rounds
export const MIN_BET = 2000;
export const MAX_BET = 10000000;

export const INDO_NAMES = [
  "Budi", "Siti", "Agus", "Wati", "Joko", "Sari", "Andi", "Ratna", "Eko", "Maya",
  "Dedi", "Lani", "Rian", "Dewi", "Feri", "Indah", "Tono", "Yanti", "Heri", "Ani",
  "081", "085", "087", "089", "082"
];

export const AVATARS = [
  "https://picsum.photos/seed/a1/100/100",
  "https://picsum.photos/seed/a2/100/100",
  "https://picsum.photos/seed/a3/100/100",
  "https://picsum.photos/seed/a4/100/100",
  "https://picsum.photos/seed/a5/100/100"
];

export const formatIDR = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val);
};

export const sensorName = (name: string) => {
  if (name.length <= 2) return name;
  if (name.startsWith("08")) {
    return `${name[0]}******${name[name.length-1]}`;
  }
  return `${name[0]}***${name[name.length-1]}`;
};
