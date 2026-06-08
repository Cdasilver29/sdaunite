import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Trophy, Shield, Star, Target, Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import footballHero from "@/assets/football-league-hero.jpg";

const TEAMS = [
  { name: "Nairobi Central FC", church: "Nairobi Central SDA", wins: 5, draws: 1, losses: 0 },
  { name: "Karen Eagles", church: "Karen SDA Church", wins: 4, draws: 1, losses: 1 },
  { name: "Maxwell Rangers", church: "Maxwell SDA Academy", wins: 3, draws: 2, losses: 1 },
  { name: "Rongai United", church: "Rongai SDA Church", wins: 3, draws: 1, losses: 2 },
  { name: "Kisumu Stars", church: "Kisumu Central SDA", wins: 2, draws: 2, losses: 2 },
  { name: "Thika Warriors", church: "Thika Memorial SDA", wins: 2, draws: 1, losses: 3 },
];

const FIXTURES = [
  { date: "Apr 6", home: "Nairobi Central FC", away: "Karen Eagles", venue: "Kasarani Annex" },
  { date: "Apr 6", home: "Maxwell Rangers", away: "Rongai United", venue: "Maxwell Academy" },
  { date: "Apr 13", home: "Kisumu Stars", away: "Thika Warriors", venue: "Kisumu Sports Ground" },
  { date: "Apr 20", home: "Karen Eagles", away: "Maxwell Rangers", venue: "Karen Playing Fields" },
];

const FootballLeague = () => {
  return (
    <div className="min-h-screen bg-background">

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: Calendar, label: "Season", value: "Mar – Jul 2026" },
                { icon: Swords, label: "Format", value: "Round Robin" },
                { icon: MapPin, label: "Region", value: "Nairobi & Central" },
                { icon: Users, label: "Teams", value: `${TEAMS.length} Registered` },
              ].map(item => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-4">
                  <item.icon className="mb-1 h-4 w-4 text-secondary" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">About the League</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The Adventist Football League brings together SDA churches across Kenya for a season of competitive, Christ-centered football. More than just a sports league, this is a platform for youth ministry, fellowship, health promotion, and community building. Every match begins with prayer and every team commits to sportsmanship that reflects our Adventist values.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Teams represent their local churches and play in a round-robin format, with top teams advancing to knockout rounds. The league culminates in a Championship Sunday featuring the finals, worship, and a community fellowship meal.
              </p>
            </div>

            {/* League Table */}
            <div id="standings">
              <h2 className="text-xl font-bold text-foreground mb-4">League Standings</h2>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Team</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">W</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">D</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">L</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TEAMS.sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws)).map((t, i) => (
                        <tr key={t.name} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium text-foreground">{i + 1}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.church}</p>
                          </td>
                          <td className="px-4 py-3 text-center text-foreground">{t.wins}</td>
                          <td className="px-4 py-3 text-center text-foreground">{t.draws}</td>
                          <td className="px-4 py-3 text-center text-foreground">{t.losses}</td>
                          <td className="px-4 py-3 text-center font-bold text-secondary">{t.wins * 3 + t.draws}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Upcoming Fixtures */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Fixtures</h2>
              <div className="space-y-3">
                {FIXTURES.map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{f.home} vs {f.away}</p>
                        <p className="text-xs text-muted-foreground">{f.venue}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{f.date}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules & Values */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">League Rules & Values</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Shield, title: "Fair Play", desc: "No foul language, violent conduct, or unsportsmanlike behavior. Yellow/red card system enforced." },
                  { icon: Star, title: "Sabbath Observance", desc: "No matches scheduled on Sabbath (Friday sunset to Saturday sunset). Period." },
                  { icon: Target, title: "Health & Fitness", desc: "Players encouraged to maintain Adventist health principles. No alcohol or tobacco at venues." },
                  { icon: Trophy, title: "Spirit Award", desc: "Beyond trophies, the Spirit Award recognizes the team that best exemplifies Christ-like sportsmanship." },
                ].map(v => (
                  <div key={v.title} className="rounded-xl border border-border bg-card p-5">
                    <v.icon className="h-5 w-5 text-secondary mb-2" />
                    <h3 className="font-semibold text-foreground text-sm">{v.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div id="register" className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-1">Register Your Team</h3>
                <p className="text-xs text-muted-foreground mb-4">Represent your church in the Adventist Football League</p>

                <div className="space-y-3 mb-6">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Team Registration</p>
                        <p className="text-xs text-muted-foreground">Per team (min 15 players)</p>
                      </div>
                      <p className="text-lg font-bold text-secondary">KES 5,000</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Spectator Pass</p>
                        <p className="text-xs text-muted-foreground">Season pass, all matches</p>
                      </div>
                      <p className="text-lg font-bold text-secondary">KES 500</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2 mb-3">
                  <Link to="/auth/sign-in">
                    <Trophy className="h-4 w-4" /> Register Now
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">Sign in to register via M-Pesa</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Season Sponsors</h4>
                <p className="text-xs text-muted-foreground">Interested in sponsoring the league? Contact us to support Adventist youth sports ministry.</p>
                <Button asChild variant="outline" className="w-full mt-3" size="sm">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootballLeague;
