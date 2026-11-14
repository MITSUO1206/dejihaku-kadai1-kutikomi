import Link from "next/link";

const DEMO = "/s/demo";

const PAINS = [
  { icon: "🙇", title: "口コミをお願いしづらい", body: "「書いてください」と言っても、文章を考えるのが面倒で結局書いてもらえない。" },
  { icon: "📉", title: "Googleマップで埋もれる", body: "近くの競合店より口コミが少なく、検索しても下の方にしか出てこない。" },
  { icon: "🤖", title: "AIっぽい文章は逆効果", body: "テンプレみたいなきれいすぎる口コミは、読む人にすぐバレて信用されない。" },
];

const STEPS = [
  { n: "01", title: "QRコードを読む", body: "テーブルやレシートのQRコードから、お客様のスマホでアンケートを開きます。" },
  { n: "02", title: "タップで答える", body: "満足度・メニュー・よかった点を選ぶだけ。30秒ほどで終わります。" },
  { n: "03", title: "AIが文章をつくる", body: "回答をもとに、その人が書いたような自然な口コミ文をAIが下書きします。" },
  { n: "04", title: "貼り付けて投稿", body: "文章をコピーしてGoogleマップを開き、貼り付けて「投稿」を押せば完了。投稿するかはお客様が決めます。" },
];

const FEATURES = [
  {
    title: "人が書いたような文章",
    body: "毎回ちがう口調・書き出し・クセで文章をつくり、「AIが書いた感」の強い定型句は使いません。同じ店の口コミが似た文章になりにくい設計です。",
  },
  {
    title: "書いていないことは書かない",
    body: "お客様が選んだ内容だけで文章をつくります。メニュー名や値段など、回答にない情報をAIが勝手に足すことはありません。",
  },
  {
    title: "正直な感想をそのまま",
    body: "星の数と文章の温度感をそろえます。気になった点もやわらかく正直に。満足度に関係なく、すべてのお客様に同じ流れでご案内します。",
  },
  {
    title: "お店の特徴を選択肢に",
    body: "看板メニューやこだわりポイントをアンケートの選択肢に追加できるので、お店の魅力が口コミに出やすくなります。",
  },
];

const FAQ = [
  { q: "お客様の負担はどのくらいですか？", a: "タップで選ぶだけのアンケートなので、30秒ほどで終わります。文章を考える必要はありません。" },
  { q: "AIがつくった文章はそのまま投稿されますか？", a: "いいえ。文章はお客様のスマホに表示され、自由に書きかえられます。投稿するかどうかもお客様ご本人が決めます。" },
  { q: "評価の低いお客様はどうなりますか？", a: "満足度に関係なく、全員に同じ流れでご案内します。評価の高い人だけを口コミに誘導することはGoogleのポリシーで禁止されているためです。" },
  { q: "特典と引き換えに口コミをお願いできますか？", a: "できません。クーポンなどの見返りと引き換えに口コミを依頼することはGoogleのポリシー違反になるため、本サービスでは扱っていません。" },
  { q: "どんなお店で使えますか？", a: "現在は飲食店向けです。選択肢をお店ごとに変えられるので、居酒屋・カフェ・ラーメン店など業態を問わずお使いいただけます。" },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 border-b border-line/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <Link href={DEMO} className="rounded-full bg-brand px-4 py-2 text-sm font-black text-white hover:bg-brand-dark">
            デモを試す
          </Link>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="relative">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pt-16">
          <div>
            <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-brand shadow-card">飲食店向け AI口コミ作成サービス</p>
            <h1 className="mt-4 text-[34px] font-black leading-tight md:text-5xl">
              アンケートに
              <br />
              答えるだけで、
              <br />
              <span className="text-brand">口コミが増える。</span>
            </h1>
            <p className="mt-5 leading-relaxed text-ink/75">
              お客様はタップで答えるだけ。AIがその人らしい自然な口コミ文をつくり、そのままGoogleマップに投稿できます。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={DEMO} className="btn-primary sm:!w-auto">
                お客様画面を体験する →
              </Link>
              <a href="#how" className="btn-ghost sm:!w-auto">
                しくみを見る
              </a>
            </div>
          </div>
          <PhoneMock />
        </div>
      </section>

      {/* 悩み */}
      <Section eyebrow="PROBLEM" title="こんなお悩みありませんか？">
        <div className="grid gap-4 md:grid-cols-3">
          {PAINS.map((p) => (
            <div key={p.title} className="rounded-3xl bg-white p-6 shadow-card">
              <div className="text-4xl">{p.icon}</div>
              <h3 className="mt-3 text-lg font-black">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* しくみ */}
      <Section id="how" eyebrow="HOW IT WORKS" title="お客様は4ステップで投稿完了" tinted>
        <div className="grid gap-4 md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-3xl bg-white p-6 shadow-card">
              <span className="text-3xl font-black text-brand/30">{s.n}</span>
              <h3 className="mt-1 text-lg font-black">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 特徴 */}
      <Section eyebrow="FEATURES" title="「AIが書いた感」を出さない工夫">
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="flex gap-4 rounded-3xl bg-white p-6 shadow-card">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-sm font-black text-white">{i + 1}</span>
              <div>
                <h3 className="text-lg font-black">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Compare label="よくあるAI文章" bad text="先日、家族で訪問させていただきました。料理はどれも絶品で、スタッフの方々の心温まる接客に感動しました。総じて大満足の時間を過ごすことができました。ぜひ皆さんもおすすめです！" />
          <Compare label="クチコミノートの文章" text="家族できました。つくねの月見がめっちゃおいしくて子どもが取り合いしてた笑 ちょっと待ったけど大将が気さくで楽しかったです。また行く" />
        </div>
      </Section>

      {/* メリット */}
      <Section eyebrow="MERIT" title="お店にも、お客様にもうれしい" tinted>
        <div className="grid gap-4 md:grid-cols-2">
          <Merit title="お店のメリット" items={["口コミの数が増えやすい", "Googleマップで見つけてもらいやすくなる", "お店の特徴を口コミに入れてもらいやすい", "アプリのインストール不要、QRコードを置くだけ"]} />
          <Merit title="お客様のメリット" items={["タップで答えるだけ、30秒で終わる", "文章を考えなくていい", "自分の言葉に書きかえてから投稿できる"]} />
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="よくあるご質問">
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                <span>
                  <span className="mr-2 text-brand">Q.</span>
                  {f.q}
                </span>
                <span className="text-brand transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-brand px-6 py-12 text-center text-white shadow-card">
          <h2 className="text-2xl font-black md:text-3xl">まずはお客様の画面を体験してください</h2>
          <p className="mt-3 text-white/85">架空の焼き鳥店「とりまる」のアンケートで、AIが口コミをつくる流れを試せます。</p>
          <Link href={DEMO} className="mt-7 inline-flex rounded-full bg-white px-8 py-4 font-black text-brand transition hover:scale-105">
            デモを試す →
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-xs text-ink/50">
        <Logo small />
        <p className="mt-3">© 2026 クチコミノート（課題制作）</p>
      </footer>
    </div>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-black ${small ? "text-sm" : "text-lg"}`}>
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">✎</span>
      クチコミノート
    </span>
  );
}

function Section({
  id,
  eyebrow,
  title,
  tinted = false,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`px-4 py-16 md:py-20 ${tinted ? "bg-mint/60" : ""}`}>
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-black tracking-[0.25em] text-brand">{eyebrow}</p>
        <h2 className="mt-2 text-center text-2xl font-black md:text-3xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Compare({ label, text, bad = false }: { label: string; text: string; bad?: boolean }) {
  return (
    <div className={`rounded-3xl border-2 p-6 ${bad ? "border-line bg-white/60" : "border-brand bg-white shadow-card"}`}>
      <p className={`text-sm font-black ${bad ? "text-ink/50" : "text-brand"}`}>
        {bad ? "✕ " : "◯ "}
        {label}
      </p>
      <div className="mt-2 text-star">★★★★★</div>
      <p className={`mt-2 text-sm leading-relaxed ${bad ? "text-ink/50" : "text-ink"}`}>{text}</p>
    </div>
  );
}

function Merit({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <h3 className="text-lg font-black">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-sm">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] text-white">✓</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="mx-auto w-[270px] rotate-2 rounded-[2.5rem] border-[10px] border-ink bg-cream p-4 shadow-2xl md:w-[300px]">
      <p className="text-center text-[10px] font-bold text-brand">郡山駅前</p>
      <p className="text-center text-base font-black">炭火焼鳥 とりまる</p>
      <div className="mt-3 rounded-2xl bg-white p-3 shadow-card">
        <p className="text-xs font-black">Q1 今日の満足度は？</p>
        <p className="mt-1 text-center text-2xl text-star">★★★★★</p>
        <p className="mt-2 text-xs font-black">Q4 よかったところは？</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["味", "炭火の香り", "接客", "コスパ"].map((t, i) => (
            <span key={t} className={`rounded-full px-2 py-1 text-[10px] font-bold ${i < 3 ? "bg-brand text-white" : "border border-line"}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 rounded-2xl border-2 border-brand/40 bg-white p-3">
        <p className="text-[10px] font-black text-brand">✨ AIがつくった口コミ</p>
        <p className="mt-1 text-[11px] leading-relaxed">
          友達ときました。炭火の香りがすごくて皮タレが優勝… 大将も気さくで居心地よかった。また行く
        </p>
      </div>
      <div className="mt-3 rounded-full bg-brand py-2.5 text-center text-xs font-black text-white">📋 文章をコピー → Googleマップへ</div>
    </div>
  );
}
