import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore, googleReviewUrl } from "@/lib/stores";
import SurveyForm from "./SurveyForm";

type Props = { params: Promise<{ storeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = getStore((await params).storeId);
  return { title: store ? `${store.name} アンケート` : "アンケート" };
}

export default async function SurveyPage({ params }: Props) {
  const store = getStore((await params).storeId);
  if (!store) notFound();

  return (
    <main className="min-h-dvh bg-cream">
      <div className="mx-auto max-w-md px-4 pb-16 pt-6">
        <header className="mb-6 text-center">
          <p className="text-xs font-bold tracking-widest text-brand">{store.area}</p>
          <h1 className="mt-1 text-2xl font-black text-ink">{store.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{store.catchCopy}</p>
        </header>
        <SurveyForm
          storeId={store.id}
          storeName={store.name}
          menus={store.menus}
          features={store.features}
          reviewUrl={googleReviewUrl(store)}
        />
      </div>
    </main>
  );
}
