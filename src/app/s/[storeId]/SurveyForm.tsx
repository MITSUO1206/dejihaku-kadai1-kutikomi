"use client";

import { useState } from "react";
import { BAD_POINTS, GOOD_POINTS, LENGTHS, REVISIT, SCENES, type Answers } from "@/lib/survey";

type Props = {
  storeId: string;
  storeName: string;
  menus: string[];
  features: string[];
  reviewUrl: string;
};

const STEPS = ["満足度", "誰と", "メニュー", "よかった点", "気になった点", "ひとこと"] as const;

const initial: Answers = {
  rating: 0,
  scene: "",
  menus: [],
  goodPoints: [],
  badPoints: [],
  revisit: "",
  comment: "",
  length: "ふつう",
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border-2 px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
        active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand/50"
      }`}
    >
      {children}
    </button>
  );
}

export default function SurveyForm({ storeId, storeName, menus, features, reviewUrl }: Props) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(initial);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);

  const toggle = (key: "menus" | "goodPoints" | "badPoints", v: string) =>
    setA((p) => {
      let next = p[key].includes(v) ? p[key].filter((x) => x !== v) : [...p[key], v];
      // 「特になし」は他と同時に選べない
      if (key === "badPoints") {
        next = v === "特になし" ? (next.includes(v) ? ["特になし"] : []) : next.filter((x) => x !== "特になし");
      }
      return { ...p, [key]: next };
    });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function generate() {
    setLoading(true);
    setError("");
    setCopied(false);
    setOpened(false);
    setStep(STEPS.length);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, answers: a }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      setReview(data.review);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(review);
    } catch {
      // clipboard API が使えない端末向け：文章欄を選択状態にしてコピーする
      const ta = document.getElementById("review-text") as HTMLTextAreaElement | null;
      ta?.select();
      document.execCommand("copy");
    }
    setCopied(true);
  }

  function openGoogle() {
    setOpened(true);
    window.open(reviewUrl, "_blank", "noopener");
  }

  // ===== 結果画面 =====
  if (step >= STEPS.length) {
    return (
      <section className="rounded-3xl bg-white p-5 shadow-card">
        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
            <p className="mt-4 text-sm font-bold text-ink/70">口コミ文を作っています…</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-sm font-bold text-red-600">{error}</p>
            <button onClick={generate} className="btn-primary mt-6">もう一度つくる</button>
            <button onClick={() => setStep(STEPS.length - 1)} className="btn-ghost mt-3">回答に戻る</button>
          </div>
        ) : (
          <>
            <p className="text-center text-sm font-bold text-brand">口コミ文ができました！</p>
            <p className="mt-1 text-center text-xs text-ink/60">自由に書きかえてから投稿できます</p>
            <textarea
              id="review-text"
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setCopied(false); // 書きかえたらコピーし直してもらう
              }}
              rows={8}
              className="mt-4 w-full resize-none rounded-2xl border-2 border-line bg-cream/60 p-4 text-[15px] leading-relaxed text-ink outline-none focus:border-brand"
            />
            <div className="mt-1 text-right text-xs text-ink/50">{review.length}文字</div>

            <h3 className="mt-6 text-center text-sm font-black text-ink">Googleマップへの投稿は3ステップ</h3>

            <ol className="mt-3 space-y-3">
              {/* STEP 1 */}
              <li className="rounded-2xl border-2 border-line p-4">
                <StepTitle n={1} done={copied}>この文章をコピーする</StepTitle>
                <button onClick={copy} className={`mt-3 ${copied ? "btn-done" : "btn-primary"}`}>
                  {copied ? "✓ コピーしました" : "📋 文章をコピー"}
                </button>
              </li>

              {/* STEP 2 */}
              <li className={`rounded-2xl border-2 p-4 transition ${copied ? "border-brand" : "border-line opacity-60"}`}>
                <StepTitle n={2} done={opened}>Googleマップの口コミ画面を開く</StepTitle>
                <button onClick={openGoogle} className={`mt-3 ${copied ? "btn-primary" : "btn-ghost"}`}>
                  <GoogleIcon /> Googleマップを開く
                </button>
                <p className="mt-2 text-center text-[11px] text-ink/60">※ このボタンではまだ投稿されません</p>
              </li>

              {/* STEP 3 */}
              <li className={`rounded-2xl border-2 p-4 transition ${opened ? "border-brand" : "border-line opacity-60"}`}>
                <StepTitle n={3}>Googleの画面で投稿する</StepTitle>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-bold leading-tight text-ink/80">
                  <div className="rounded-xl bg-cream p-2">
                    <div className="text-lg text-star">★★★★★</div>星をえらぶ
                  </div>
                  <div className="rounded-xl bg-cream p-2">
                    <div className="text-lg">👆</div>文章欄を長押し→「貼り付け」
                  </div>
                  <div className="rounded-xl bg-cream p-2">
                    <div className="text-lg">📮</div>「投稿」を押して完了
                  </div>
                </div>
                <p className="mt-2 text-center text-[11px] text-ink/60">「投稿」を押すまで、口コミは公開されません</p>
              </li>
            </ol>

            <button onClick={generate} className="btn-ghost mt-5">別の文章でつくり直す</button>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-ink/50">
              投稿はお客様ご本人の判断でお願いします。
              <br />
              {storeName}をご利用いただき、ありがとうございました。
            </p>
          </>
        )}
      </section>
    );
  }

  // ===== アンケート画面 =====
  const canNext =
    (step === 0 && a.rating > 0) || (step === 1 && a.scene) || step === 2 || step === 3 || step === 4 || step === 5;

  return (
    <section>
      {/* 進捗バー */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-ink/60">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-card">
        {step === 0 && (
          <>
            <Q n={1}>今日の満足度は？</Q>
            <div className="flex justify-center gap-1.5 py-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n}つ星`}
                  onClick={() => {
                    setA({ ...a, rating: n });
                    setTimeout(next, 250);
                  }}
                  className={`text-5xl transition active:scale-90 ${n <= a.rating ? "text-star" : "text-line"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Q n={2}>どなたと来店されましたか？</Q>
            <div className="flex flex-wrap gap-2">
              {SCENES.map((s) => (
                <Chip
                  key={s}
                  active={a.scene === s}
                  onClick={() => {
                    setA({ ...a, scene: s });
                    setTimeout(next, 200);
                  }}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Q n={3} sub="いくつでも">注文したメニューは？</Q>
            <div className="flex flex-wrap gap-2">
              {menus.map((m) => (
                <Chip key={m} active={a.menus.includes(m)} onClick={() => toggle("menus", m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Q n={4} sub="いくつでも">よかったところは？</Q>
            <div className="flex flex-wrap gap-2">
              {[...features, ...GOOD_POINTS].map((g) => (
                <Chip key={g} active={a.goodPoints.includes(g)} onClick={() => toggle("goodPoints", g)}>
                  {g}
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <Q n={5} sub="いくつでも">気になったところは？</Q>
            <div className="flex flex-wrap gap-2">
              {BAD_POINTS.map((b) => (
                <Chip key={b} active={a.badPoints.includes(b)} onClick={() => toggle("badPoints", b)}>
                  {b}
                </Chip>
              ))}
            </div>
            <Q n={6} className="mt-6">また来たいですか？</Q>
            <div className="flex flex-wrap gap-2">
              {REVISIT.map((r) => (
                <Chip key={r} active={a.revisit === r} onClick={() => setA({ ...a, revisit: r })}>
                  {r}
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <Q n={7} sub="任意">ひとことあれば</Q>
            <textarea
              value={a.comment}
              onChange={(e) => setA({ ...a, comment: e.target.value })}
              maxLength={200}
              rows={3}
              placeholder="例）つくねが好きすぎる"
              className="w-full resize-none rounded-2xl border-2 border-line p-3 text-[15px] outline-none focus:border-brand"
            />
            <Q n={8} className="mt-6">文章の長さ</Q>
            <div className="flex gap-2">
              {LENGTHS.map((l) => (
                <Chip key={l} active={a.length === l} onClick={() => setA({ ...a, length: l })}>
                  {l}
                </Chip>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        {step > 0 && (
          <button onClick={back} className="btn-ghost !w-28">
            戻る
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={next} disabled={!canNext} className="btn-primary">
            次へ
          </button>
        ) : (
          <button onClick={generate} className="btn-primary">
            ✨ AIで口コミ文をつくる
          </button>
        )}
      </div>
    </section>
  );
}

function Q({ n, sub, children, className = "" }: { n: number; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`mb-4 flex items-center gap-2 text-lg font-black text-ink ${className}`}>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-sm text-brand">Q{n}</span>
      {children}
      {sub && <span className="text-xs font-bold text-ink/40">（{sub}）</span>}
    </h2>
  );
}

function StepTitle({ n, done = false, children }: { n: number; done?: boolean; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-black text-ink">
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs text-white ${done ? "bg-green-600" : "bg-brand"}`}
      >
        {done ? "✓" : n}
      </span>
      {children}
    </p>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#fff" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" />
      <path fill="#fff" opacity=".85" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
      <path fill="#fff" opacity=".7" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" />
      <path fill="#fff" opacity=".85" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" />
    </svg>
  );
}
