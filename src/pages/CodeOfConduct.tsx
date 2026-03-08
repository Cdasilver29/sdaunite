import PageHeader from "@/components/PageHeader";
import { BookOpen, Shirt, Heart, Sun, Shield } from "lucide-react";

const sections = [
  {
    icon: Shirt,
    title: "Modest Dress",
    items: [
      "Women: Dresses or skirts at or below the knee, covered shoulders, modest necklines",
      "Men: Slacks or suits, button-down shirts, neat professional appearance",
      "Avoid tight, revealing, or party-style clothing",
    ],
  },
  {
    icon: Heart,
    title: "Christian Behavior",
    items: [
      "Treat all attendees with respect, kindness, and Christ-like love",
      "Maintain appropriate conduct and boundaries at all times",
      "Build each other up in faith and fellowship",
    ],
  },
  {
    icon: Shield,
    title: "No Alcohol or Tobacco",
    items: [
      "All SDA events are substance-free",
      "No alcohol, tobacco, or recreational drugs",
      "Honor God with your body as His temple",
    ],
  },
  {
    icon: Sun,
    title: "Sabbath Observance",
    items: [
      "Respect the Sabbath hours (Friday sunset to Saturday sunset)",
      "Events during Sabbath will be worship-focused",
      "Commercial activities are reserved for non-Sabbath hours",
    ],
  },
];

const CodeOfConduct = () => (
  <div className="min-h-screen bg-background">
    

    <PageHeader
      title="Code of Conduct"
      subtitle="All SDA Unite events uphold Seventh-day Adventist values of modesty, simplicity, and Christian conduct."
      icon={<BookOpen className="h-6 w-6 text-accent" />}
      backgroundImage="/images/sda-code-of-conduct.jpg"
    />

    <div className="container py-12">
      <blockquote className="mx-auto max-w-2xl rounded-xl border border-accent/30 bg-accent/10 p-6 text-center">
        <p className="text-base italic text-foreground">
          "Whether you eat or drink or whatever you do, do it all for the glory of God."
        </p>
        <cite className="mt-2 block text-sm font-semibold text-secondary">
          — 1 Corinthians 10:31
        </cite>
      </blockquote>

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-6 shadow-sda">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <s.icon className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{s.title}</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {s.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    
  </div>
);

export default CodeOfConduct;
