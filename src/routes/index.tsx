import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Title Generator — Catchy Headlines in Seconds" },
      {
        name: "description",
        content: "Generate catchy, SEO-friendly titles for blog posts, videos, and articles instantly.",
      },
    ],
  }),
});

type Tone = "catchy" | "professional" | "listicle" | "howto" | "question";

const templates: Record<Tone, ((k: string) => string)[]> = {
  catchy: [
    (k) => `The Secret to ${cap(k)} Nobody Talks About`,
    (k) => `Why ${cap(k)} Is Changing Everything in 2026`,
    (k) => `${cap(k)}: The Ultimate Game Changer`,
    (k) => `Unlocking the Power of ${cap(k)}`,
    (k) => `${cap(k)} Made Simple — And Surprisingly Fun`,
  ],
  professional: [
    (k) => `A Comprehensive Guide to ${cap(k)}`,
    (k) => `Understanding ${cap(k)}: Key Insights & Best Practices`,
    (k) => `The State of ${cap(k)} in 2026`,
    (k) => `${cap(k)}: Strategies for Long-Term Success`,
    (k) => `Mastering ${cap(k)} — A Practical Framework`,
  ],
  listicle: [
    (k) => `7 Things You Didn't Know About ${cap(k)}`,
    (k) => `10 ${cap(k)} Tips That Actually Work`,
    (k) => `5 Common ${cap(k)} Mistakes (And How to Fix Them)`,
    (k) => `12 ${cap(k)} Hacks the Experts Swear By`,
    (k) => `9 Reasons ${cap(k)} Is Worth Your Time`,
  ],
  howto: [
    (k) => `How to Master ${cap(k)} in 30 Days`,
    (k) => `How to Get Started with ${cap(k)} Today`,
    (k) => `How to Use ${cap(k)} Like a Pro`,
    (k) => `How to Build Your First ${cap(k)} Project`,
    (k) => `How to Improve Your ${cap(k)} Skills Fast`,
  ],
  question: [
    (k) => `Is ${cap(k)} Really Worth the Hype?`,
    (k) => `What Makes ${cap(k)} So Powerful?`,
    (k) => `Are You Making These ${cap(k)} Mistakes?`,
    (k) => `Could ${cap(k)} Be the Future of Your Industry?`,
    (k) => `Why Does Everyone Love ${cap(k)}?`,
  ],
};

function cap(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Index() {
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState<Tone>("catchy");
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    const k = keyword.trim();
    if (!k) {
      toast.error("Please enter a topic or keyword");
      return;
    }
    const generated = shuffle(templates[tone]).map((fn) => fn(k));
    setTitles(generated);
  };

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <Toaster />
      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Title Generator
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Catchy, click-worthy titles for blogs, videos, and articles — in one click.
          </p>
        </header>

        <Card className="p-6 md:p-8 shadow-xl">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <Label htmlFor="keyword">Topic or keyword</Label>
              <Input
                id="keyword"
                placeholder="e.g. machine learning"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Style</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="catchy">Catchy</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="listicle">Listicle</SelectItem>
                  <SelectItem value="howto">How-to</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={generate} className="mt-5 w-full" size="lg">
            {titles.length > 0 ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Titles
              </>
            )}
          </Button>
        </Card>

        {titles.length > 0 && (
          <section className="mt-8 space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Your titles
            </h2>
            {titles.map((t, i) => (
              <Card
                key={i}
                className="group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-accent/50"
              >
                <p className="text-base font-medium text-foreground md:text-lg">{t}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copy(t, i)}
                  className="shrink-0"
                  aria-label="Copy title"
                >
                  {copiedIdx === i ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
