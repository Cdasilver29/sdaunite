import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Heart, BookOpen, ArrowLeft, Sparkles, Music, MessageCircle, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import singleSparkHero from "@/assets/singles-spark-hero.jpg";

const SCHEDULE = [
  { time: "2:00 PM", title: "Arrival & Registration", desc: "Check in, get your badge, and settle in", icon: Coffee },
  { time: "2:30 PM", title: "Welcome & Ice Breakers", desc: "Fun group activities to meet new people in a comfortable setting", icon: Sparkles },
  { time: "3:30 PM", title: "Devotional Session", desc: "A Christ-centered talk on relationships, purpose, and waiting on God's timing", icon: BookOpen },
  { time: "4:30 PM", title: "Small Group Discussions", desc: "Break into groups to share experiences and encourage one another", icon: MessageCircle },
  { time: "5:30 PM", title: "Music & Fellowship", desc: "Worship session followed by open social time with refreshments", icon: Music },
  { time: "7:00 PM", title: "Closing & Connections", desc: "Exchange contacts, pray together, and plan the next meetup", icon: Heart },
];

const VALUES = [
  { title: "Christ First", desc: "Every activity and conversation is grounded in biblical principles and Christ-centered values." },
  { title: "Respect & Modesty", desc: "We uphold SDA standards of modest dress, respectful behavior, and wholesome interactions." },
  { title: "Authentic Connection", desc: "No pressure, no games. Just genuine fellowship among like-minded Adventist singles." },
  { title: "Community Building", desc: "Whether you find a partner or a friend, you leave with a stronger faith community." },
];

const SinglesSpark = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-72 md:h-[28rem]">
        <img src={singleSparkHero} alt="Adventist Singles Spark" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="container absolute inset-x-0 bottom-8">
          <Link to="/events" className="inline-flex items-center gap-1 text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground mb-3">
            <ArrowLeft className="h-3 w-3" /> Back to Events
          </Link>
          <Badge className="bg-accent text-accent-foreground border-0 mb-2">Social & Fellowship</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground">Adventist Singles Spark</h1>
          <p className="mt-2 text-lg italic text-accent">Where Faith Meets Fellowship</p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: Calendar, label: "Date", value: "April 26, 2026" },
                { icon: Calendar, label: "Time", value: "2:00 PM – 7:00 PM" },
                { icon: MapPin, label: "Location", value: "Nairobi Chapel Gardens" },
                { icon: Users, label: "Capacity", value: "120 Singles" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-4">
                  <item.icon className="mb-1 h-4 w-4 text-secondary" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Bible Verse */}
            <blockquote className="rounded-xl border border-accent/30 bg-accent/10 p-6">
              <BookOpen className="mb-2 h-5 w-5 text-secondary" />
              <p className="text-base italic text-foreground">"Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."</p>
              <cite className="mt-2 block text-sm font-semibold text-secondary">— Ecclesiastes 4:9-10</cite>
            </blockquote>

            {/* About */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">About Adventist Singles Spark</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Adventist Singles Spark is a Christ-centered social gathering designed exclusively for SDA singles aged 21 and above.
                In a world where finding genuine, faith-aligned connections can be challenging, Spark provides a safe, fun, and spiritually
                enriching environment where Adventist singles can meet, fellowship, and build meaningful relationships.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This isn't a dating event. It's a fellowship event. Whether God leads you to a life partner, a prayer partner, or simply
                a great friend, the goal is to grow your community of faith. Every interaction is rooted in respect, modesty, and shared
                Adventist values.
              </p>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Our Values</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {VALUES.map(v => (
                  <div key={v.title} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground text-sm">{v.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Event Schedule</h2>
              <div className="space-y-3">
                {SCHEDULE.map((s, i) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <s.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-bold text-secondary mt-1">{s.time}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">What to Expect</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Interactive ice-breaker activities designed to make introductions easy and natural</li>
                <li className="flex gap-2"><BookOpen className="h-4 w-4 text-accent shrink-0 mt-0.5" /> A powerful devotional on God's plan for relationships and singleness</li>
                <li className="flex gap-2"><MessageCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Honest small-group conversations about faith, career, and life goals</li>
                <li className="flex gap-2"><Music className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Live worship music and a relaxed social atmosphere with refreshments</li>
                <li className="flex gap-2"><Heart className="h-4 w-4 text-accent shrink-0 mt-0.5" /> A supportive community that extends well beyond the event itself</li>
              </ul>
            </div>
          </div>

          {/* Ticket Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-1">Get Your Ticket</h3>
              <p className="text-xs text-muted-foreground mb-4">Secure your spot at Adventist Singles Spark</p>

              <div className="space-y-3 mb-6">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Early Bird</p>
                      <p className="text-xs text-muted-foreground">Limited spots available</p>
                    </div>
                    <p className="text-lg font-bold text-secondary">KES 500</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Regular</p>
                      <p className="text-xs text-muted-foreground">Standard admission</p>
                    </div>
                    <p className="text-lg font-bold text-secondary">KES 800</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-foreground">VIP</p>
                      <p className="text-xs text-muted-foreground">Front row + gift bag</p>
                    </div>
                    <p className="text-lg font-bold text-secondary">KES 1,500</p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2 mb-3">
                <Link to="/auth/sign-in">
                  <Heart className="h-4 w-4" /> Register Now
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">Sign in to purchase tickets via M-Pesa</p>

              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Dress Code</h4>
                <p className="text-xs text-muted-foreground">Smart casual, modest attire in line with SDA standards. No jewelry.</p>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Age Group</h4>
                <p className="text-xs text-muted-foreground">21+ (Young Adults & Adults)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglesSpark;
