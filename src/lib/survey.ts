// アンケートの選択肢と、回答の型（画面とAPIで共通）

export const SCENES = ["ひとりで", "友人と", "家族と", "恋人と", "職場の人と", "その他"] as const;

export const GOOD_POINTS = [
  "味",
  "量",
  "コスパ",
  "接客",
  "雰囲気",
  "清潔さ",
  "提供の早さ",
  "ドリンク",
] as const;

// 味の感想（AIが味の説明に使っていいのは、ここで選ばれた言葉だけ）
export const TASTES = [
  "ジューシー",
  "香ばしい",
  "やわらかい",
  "あっさり",
  "こってり",
  "甘め",
  "味が濃いめ",
  "塩加減がちょうどいい",
] as const;

export const BAD_POINTS = [
  "待ち時間",
  "価格",
  "混雑・騒がしさ",
  "味付け",
  "席の広さ",
  "特になし",
] as const;

export const REVISIT = ["ぜひまた来たい", "機会があれば", "わからない"] as const;

export const LENGTHS = ["短め", "ふつう", "長め"] as const;

export type Answers = {
  rating: number; // 1〜5
  scene: string;
  menus: string[];
  tastes: string[];
  goodPoints: string[];
  badPoints: string[];
  revisit: string;
  comment: string;
  length: (typeof LENGTHS)[number];
};
