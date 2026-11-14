// 店舗ごとの設定。管理画面を作るまでは、ここに直接書いて店舗を増やす。
// アンケートURL: /s/{id}  例) /s/demo

export type Store = {
  id: string;
  name: string;
  genre: string; // AIに渡すお店のジャンル
  area: string;
  catchCopy: string; // アンケート画面の上に出す一言
  menus: string[]; // 「頼んだメニュー」の選択肢
  features: string[]; // お店の特徴（「よかった点」に追加される）
  // GoogleビジネスプロフィールのプレイスID。
  // https://developers.google.com/maps/documentation/places/web-service/place-id で調べられる
  googlePlaceId?: string;
};

export const stores: Record<string, Store> = {
  demo: {
    id: "demo",
    name: "炭火焼鳥 とりまる",
    genre: "焼き鳥居酒屋",
    area: "郡山駅前",
    catchCopy: "本日はご来店ありがとうございました！30秒で終わるアンケートにご協力ください",
    menus: [
      "おまかせ串5本盛り",
      "月見つくね",
      "ねぎま",
      "皮タレ",
      "鶏白湯ラーメン",
      "親子丼",
      "唐揚げ",
      "ハイボール",
      "生ビール",
    ],
    features: ["炭火の香り", "大将との会話", "カウンター席"],
    googlePlaceId: "",
  },
};

export function getStore(id: string): Store | undefined {
  return stores[id];
}

export function googleReviewUrl(store: Store): string {
  if (store.googlePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(store.googlePlaceId)}`;
  }
  // プレイスID未設定のデモ用：Googleマップで店名検索を開く
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + " " + store.area)}`;
}
