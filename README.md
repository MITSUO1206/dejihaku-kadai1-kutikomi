# クチコミノート（口コミ作成システム）

アンケートに答える → AIが口コミ文をつくる → コピーしてGoogleマップに投稿、までの流れを作る課題制作です。

## ページ
| URL | 内容 |
|---|---|
| `/` | サービス紹介（LP） |
| `/s/demo` | お客様が答えるアンケート（デモ店舗「炭火焼鳥 とりまる」） |
| `/api/generate` | Claudeで口コミ文を作るAPI |

## 主なファイル
- `src/lib/prompt.ts` … **口コミ文のチューニング**（口調・書き出し・クセをランダムに選ぶ／AIっぽい表現を禁止）
- `src/lib/stores.ts` … 店舗の設定（店名・メニュー・特徴・GoogleのプレイスID）
- `src/lib/survey.ts` … アンケートの選択肢
- `src/app/s/[storeId]/SurveyForm.tsx` … アンケート画面
- `src/app/page.tsx` … LP

## ローカルで動かす
1. `.env.example` を `.env.local` にコピーして、`ANTHROPIC_API_KEY` を入れる
2. `npm install`
3. `npm run dev` → http://localhost:3000

## Vercelに公開する
1. GitHubにpushして、Vercelでリポジトリを読み込む
2. Settings → Environment Variables に `ANTHROPIC_API_KEY` を登録
3. Deploy

## 店舗を追加する
`src/lib/stores.ts` に店舗を追加すると `/s/{id}` でアンケートが開けます。
`googlePlaceId` を入れると、ボタンからそのお店のGoogle口コミ投稿画面が直接開きます（未設定ならGoogleマップの検索結果が開きます）。
