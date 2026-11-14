import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getStore } from "@/lib/stores";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { BAD_POINTS, GOOD_POINTS, LENGTHS, REVISIT, SCENES, type Answers } from "@/lib/survey";

const client = new Anthropic(); // ANTHROPIC_API_KEY を環境変数から読む

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";

// 送られてきた回答を、決められた選択肢だけに絞る
function sanitize(body: unknown, menus: string[], features: string[]): Answers | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const rating = Number(b.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;

  const list = (v: unknown, allowed: readonly string[]) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && allowed.includes(x)) : [];
  const one = (v: unknown, allowed: readonly string[]) =>
    typeof v === "string" && allowed.includes(v) ? v : "";

  const length = one(b.length, LENGTHS) as Answers["length"];

  return {
    rating,
    scene: one(b.scene, SCENES),
    menus: list(b.menus, menus),
    goodPoints: list(b.goodPoints, [...GOOD_POINTS, ...features]),
    badPoints: list(b.badPoints, BAD_POINTS),
    revisit: one(b.revisit, REVISIT),
    comment: typeof b.comment === "string" ? b.comment.slice(0, 200) : "",
    length: length || "ふつう",
  };
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  const store = getStore(String(body.storeId ?? ""));
  if (!store) return NextResponse.json({ error: "お店が見つかりません" }, { status: 404 });

  const answers = sanitize(body.answers, store.menus, store.features);
  if (!answers) return NextResponse.json({ error: "星の数を選んでください" }, { status: 400 });

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2000,
      output_config: { effort: "low" }, // 短い文章なので軽め＝速い
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(store, answers) }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "文章を作れませんでした。内容を変えてもう一度お試しください" }, { status: 422 });
    }

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim()
      .replace(/^[「『"]|[」』"]$/g, "");

    if (!text) {
      return NextResponse.json({ error: "文章を作れませんでした。もう一度お試しください" }, { status: 502 });
    }
    return NextResponse.json({ review: text });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "混み合っています。少し待ってからお試しください" }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("APIキーが正しくありません", err.message);
      return NextResponse.json({ error: "サーバーの設定エラーです" }, { status: 500 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Claude API error", err.status, err.message);
      return NextResponse.json({ error: "文章の作成に失敗しました。もう一度お試しください" }, { status: 502 });
    }
    console.error(err);
    return NextResponse.json({ error: "通信エラーです。もう一度お試しください" }, { status: 500 });
  }
}
