import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Heart, BookOpen, Sparkles, Music, MessageCircle, Coffee, Star, Shield, Clock, CheckCircle, Utensils, Camera, Gamepad2, HandHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageHero from "@/components/PageHero";
import singlesIcebreakers from "@/assets/singles-icebreakers.jpg";
import singlesWorship from "@/assets/singles-worship.jpg";
import singleSparkHero from "@/assets/singles-spark-hero.jpg";

const SCHEDULE = [
  { time: "2:00 PM", title: "Arrival & Registration", desc: "Check in, get your name badge with fun conversation starters, and grab a welcome drink", icon: Coffee },
  { time: "2:30 PM", title: "Welcome & Ice Breakers", desc: "Guided group activities designed to make introductions easy, natural, and pressure-free", icon: Sparkles },
  { time: "3:15 PM", title: "Speed Fellowship Rounds", desc: "Rotate through short, meaningful conversations with fellow Adventist singles using faith-based prompts", icon: MessageCircle },
  { time: "3:45 PM", title: "Devotional Session", desc: "A Christ-centered talk on relationships, purpose, identity in Christ, and waiting on God's timing", icon: BookOpen },
  { time: "4:30 PM", title: "Small Group Discussions", desc: "Break into groups of 6-8 to share experiences, prayer requests, and encourage one another", icon: MessageCircle },
  { time: "5:15 PM", title: "Fun & Games", desc: "Team-based Bible trivia, creative challenges, and outdoor games to build connections through laughter", icon: Gamepad2 },
  { time: "6:00 PM", title: "Music & Fellowship Dinner", desc: "Live worship music, refreshments, and an open social hour with a catered vegetarian dinner", icon: Music },
  { time: "7:00 PM", title: "Closing Prayer & Connections", desc: "Exchange contacts, join the Spark community group, pray together, and plan the next meetup", icon: Heart },
];

const ACTIVITIES = [
  { title: "Ice Breaker Games", desc: "Fun, structured activities that make meeting new people feel natural. No awkward silences, just genuine conversations sparked by creative prompts and team challenges.", icon: Sparkles, image: singlesIcebreakers },
  { title: "Worship & Devotion", desc: "A powerful worship experience with live music followed by a devotional on God's design for relationships, singleness as a season of growth, and trusting His timing.", icon: Music, image: singlesWorship },
  { title: "Fellowship Dinner", desc: "A catered vegetarian dinner where you can sit with new friends, continue conversations, and enjoy good food in a relaxed, social atmosphere.", icon: Utensils },
  { title: "Community Service Project", desc: "Bond with others over a mini community service activity. Nothing builds connection faster than serving together for God's kingdom.", icon: HandHeart },
  { title: "Photo Booth & Memories", desc: "Capture the moments with a themed photo booth. Take group photos and individual shots to remember the day by.", icon: Camera },
  { title: "Bible Trivia & Team Games", desc: "Put your Bible knowledge to the test in teams. Friendly competition with prizes, laughs, and plenty of high-fives.", icon: Gamepad2 },
];

const VALUES = [
  { title: "Christ First", desc: "Every activity and conversation is grounded in biblical principles. We seek God's guidance in all things, including relationships.", icon: BookOpen },
  { title: "Respect & Modesty", desc: "We uphold SDA standards of modest dress, respectful behavior, and wholesome interactions. Every person is treated with dignity.", icon: Shield },
  { title: "Authentic Connection", desc: "No pressure, no games, no worldly dating culture. Just genuine fellowship among like-minded Adventist singles who share your faith.", icon: Heart },
  { title: "Community Building", desc: "Whether you find a partner or a friend, you leave with a stronger faith community that supports you beyond this event.", icon: Users },
];

const FAQS = [
  { q: "Is this a dating event?", a: "No. Adventist Singles Spark is a fellowship event. It's designed to help you build genuine friendships and community with other SDA singles. If God leads to something more, that's wonderful, but the focus is on fellowship, not matchmaking." },
  { q: "What's the age range?", a: "This event is for SDA singles aged 21 and above. Whether you're a young professional or a seasoned single, you're welcome here." },
  { q: "What should I wear?", a: "Smart casual, modest attire in line with SDA standards. Think clean, presentable, and comfortable. No jewelry please, in keeping with our Adventist values." },
  { q: "Will there be food?", a: "Yes! A fully catered vegetarian dinner is included with your ticket. We'll also have refreshments (juices, water, light snacks) available throughout the event." },
  { q: "Can I come alone?", a: "Absolutely! Most attendees come solo. The whole point of the ice breakers and structured activities is to make sure nobody feels left out. You'll make friends within the first 30 minutes." },
  { q: "How do I pay for tickets?", a: "Tickets are purchased via M-Pesa right here on SDA Unite. Sign in, select your ticket tier, and complete payment securely." },
  { q: "Is this event only in Nairobi?", a: "The inaugural Spark event is in Nairobi, but we plan to expand to other cities across Kenya and East Africa based on demand." },
];

const TESTIMONIALS = [
  { name: "Grace M.", church: "Nairobi Central SDA", quote: "I went expecting nothing and left with five new friends who I now pray with every week. Spark changed my perspective on community." },
  { name: "David K.", church: "Karura SDA", quote: "Finally, an event for singles that doesn't feel forced. The devotional on God's timing really spoke to me." },
  { name: "Faith W.", church: "Rongai SDA", quote: "The ice breakers were so well done. I'm usually shy at events but here I felt completely at ease. Can't wait for the next one!" },
];

const SinglesSpark = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label="Social & Fellowship"
        title="Adventist Singles"
        titleAccent="Spark."
        subtitle="A Christ-centered gathering for SDA singles to connect, grow, and build lasting community through faith, fun, and fellowship"
        backgroundImage={singleSparkHero}
        ctas={[
          { label: "Get Tickets", to: "#tickets" },
          { label: "View Schedule", to: "#schedule", variant: "outline" },
        ]}
      />

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { icon: Calendar, label: "Date", value: "April 26, 2026" },
                { icon: Clock, label: "Time", value: "2:00 PM – 7:00 PM" },
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
                Adventist Singles Spark is a Christ-centered social gathering designed exclusively for Seventh-day Adventist singles aged 21 and above. In a world where finding genuine, faith-aligned connections can be incredibly challenging, Spark provides a safe, fun, and spiritually enriching environment where Adventist singles can meet, fellowship, and build meaningful relationships.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This isn't a dating event, and there's zero pressure to pair up. It's a fellowship event rooted in the belief that God places people in our lives for a reason. Whether He leads you to a life partner, a prayer partner, an accountability partner, or simply a great friend, the goal is to grow your community of faith.
              </p>
            </div>

            {/* Activities Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Activities & Experiences</h2>
              <p className="text-sm text-muted-foreground mb-6">Every moment at Spark is intentionally designed to foster genuine connection in a faith-centered atmosphere.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {ACTIVITIES.map((a) => (
                  <div key={a.title} className="rounded-xl border border-border bg-card overflow-hidden">
                    {a.image && <img src={a.image} alt={a.title} className="w-full h-36 object-cover" />}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <a.icon className="h-4 w-4 text-secondary" />
                        <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Our Core Values</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {VALUES.map(v => (
                  <div key={v.title} className="rounded-xl border border-border bg-card p-5 flex gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 h-fit">
                      <v.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{v.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div id="schedule">
              <h2 className="text-xl font-bold text-foreground mb-4">Event Schedule</h2>
              <div className="space-y-3">
                {SCHEDULE.map((s, i) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <s.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-bold text-secondary mt-1 whitespace-nowrap">{s.time}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">What to Expect</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  { icon: Sparkles, text: "Interactive ice-breaker activities designed to make introductions easy, natural, and fun for everyone" },
                  { icon: BookOpen, text: "A powerful devotional on God's plan for relationships, singleness as a gift, and trusting His perfect timing" },
                  { icon: MessageCircle, text: "Honest small-group conversations about faith, career goals, life challenges, and spiritual growth" },
                  { icon: Music, text: "Live worship music and a relaxed social atmosphere with a fully catered vegetarian dinner" },
                  { icon: Heart, text: "A supportive Adventist community that extends well beyond the event through prayer groups and social meetups" },
                  { icon: CheckCircle, text: "A safe, judgment-free environment where every person is valued regardless of their story or background" },
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <item.icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">What People Are Saying</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">"{t.quote}"</p>
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="text-xs font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.church}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm font-semibold text-foreground text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Ticket Panel */}
          <div id="tickets" className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Get Your Ticket</h3>
                <p className="text-xs text-muted-foreground mt-1">Secure your spot at Adventist Singles Spark</p>
              </div>

              <div className="space-y-3">
                {[
                  { tier: "Early Bird", desc: "Limited to first 40 registrations", price: "KES 500", highlight: true },
                  { tier: "Regular", desc: "Standard admission with dinner included", price: "KES 800", highlight: false },
                  { tier: "VIP", desc: "Front row seating, gift bag, exclusive group photo", price: "KES 1,500", highlight: false },
                ].map((t) => (
                  <div key={t.tier} className={`rounded-lg border p-4 ${t.highlight ? "border-secondary bg-secondary/5" : "border-border"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{t.tier}</p>
                          {t.highlight && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Best Value</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                      </div>
                      <p className="text-lg font-bold text-secondary">{t.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2">
                <Link to="/auth/sign-in">
                  <Heart className="h-4 w-4" /> Reserve My Spot
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">Sign in to purchase via M-Pesa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglesSpark;
