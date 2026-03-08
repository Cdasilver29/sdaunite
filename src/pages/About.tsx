import PageHeader from "@/components/PageHeader";
import { Heart, BookOpen, Users, Globe } from "lucide-react";

const VALUES = [
  {
    icon: BookOpen,
    title: "Scripture-Centered",
    description:
      "Every event and gathering is rooted in the Bible. We believe God's Word is the foundation for everything we do.",
  },
  {
    icon: Heart,
    title: "Christ-Like Service",
    description:
      "Following Jesus' example, we serve our communities with compassion—visiting hospitals, feeding the hungry, and lifting others up.",
  },
  {
    icon: Users,
    title: "Wholesome Fellowship",
    description:
      "We create safe, fun, and faith-building spaces where Adventist youth can connect, grow, and encourage one another.",
  },
  {
    icon: Globe,
    title: "Global Adventist Family",
    description:
      "As part of the worldwide Seventh-day Adventist Church, we celebrate unity in diversity across conferences, churches, and nations.",
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <PageHeader
      title="About SDA Unite"
      subtitle="A Christ-centered platform connecting Seventh-day Adventist youth through fellowship, service, outdoor adventures, and spiritual growth events."
    />

    {/* Mission */}
    <section className="py-16">
      <div className="container max-w-3xl">
        <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          SDA Unite exists to make it easy for Adventist young people to discover, organize, and attend wholesome events that strengthen faith and build lasting friendships. Whether it's a singles' fellowship, a youth hike, a service outreach, or a worship night, our goal is to bring young Adventists together—locally and globally—so that no one walks their faith journey alone.
        </p>
        <blockquote className="mt-8 border-l-4 border-accent pl-4">
          <p className="italic text-muted-foreground">
            "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together."
          </p>
          <cite className="mt-2 block text-sm font-semibold text-secondary">
            — Hebrews 10:24-25
          </cite>
        </blockquote>
      </div>
    </section>

    {/* Values */}
    <section className="border-t border-border bg-muted/30 py-16">
      <div className="container">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Our Values
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-xl bg-card p-6 shadow-sda">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sda-gradient">
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* SDA Beliefs summary */}
    <section className="py-16">
      <div className="container max-w-3xl">
        <h2 className="text-2xl font-bold text-foreground">
          Who Are Seventh-day Adventists?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Seventh-day Adventists are a global community of Christians who observe the Sabbath on Saturday—the seventh day of the week—as a day of rest and worship. We emphasize holistic health, education, community service, and the hope of Jesus' soon return. With over 22 million members worldwide, the Adventist Church operates one of the largest Protestant education and healthcare networks on earth.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          SDA Unite is not an official church body but a community-driven platform built by and for Adventist youth who want to stay connected, active, and growing in faith.
        </p>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
