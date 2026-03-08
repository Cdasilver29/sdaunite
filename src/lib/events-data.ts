export type EventCategory =
  | "Social & Fellowship"
  | "Outdoor & Nature"
  | "Spiritual Retreats"
  | "Sports & Health"
  | "Service & Mission"
  | "Music & Worship"
  | "Fundraisers";

export type TicketTier = {
  name: string;
  price: number;
  currency: string;
  description?: string;
};

export type SDAEvent = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  image: string;
  ticketTiers: TicketTier[];
  capacity: number;
  registered: number;
  churchName?: string;
  ministryFocus?: string;
  bibleVerse?: string;
  bibleReference?: string;
  verified: boolean;
  ageGroup?: string;
};

export const CATEGORIES: { label: EventCategory; icon: string; description: string }[] = [
  { label: "Social & Fellowship", icon: "👥", description: "Build meaningful connections" },
  { label: "Outdoor & Nature", icon: "🏔️", description: "Explore God's creation" },
  { label: "Spiritual Retreats", icon: "🙏", description: "Deepen your walk with Christ" },
  { label: "Sports & Health", icon: "⚽", description: "Honor God with your body" },
  { label: "Service & Mission", icon: "💛", description: "Serve your community" },
  { label: "Music & Worship", icon: "🎵", description: "Praise through song" },
  { label: "Fundraisers", icon: "🤝", description: "Support church ministries" },
];

export const FEATURED_EVENTS: SDAEvent[] = [
  {
    id: "adventist-singles-spark",
    title: "Adventist Singles Spark",
    subtitle: '"Equally Yoked"',
    description:
      '"Do not be yoked together with unbelievers." — 2 Corinthians 6:14\n\nA Christ-centered gathering where Adventist singles build friendships, grow in faith, and form meaningful connections through fellowship, worship, and engaging group activities.',
    date: "2026-04-12",
    time: "2:00 PM — 7:00 PM",
    location: "Maxwell SDA Church, Nairobi",
    category: "Social & Fellowship",
    image: "singles-fellowship",
    ticketTiers: [
      { name: "Early Bird (20–30)", price: 1500, currency: "KSh" },
      { name: "Early Bird (30–40)", price: 2000, currency: "KSh" },
      { name: "Regular (20–30)", price: 2000, currency: "KSh" },
      { name: "Regular (30–40)", price: 2500, currency: "KSh" },
    ],
    capacity: 200,
    registered: 87,
    churchName: "Maxwell SDA Church",
    ministryFocus: "Youth & Young Adults",
    bibleVerse: "Do not be yoked together with unbelievers.",
    bibleReference: "2 Corinthians 6:14",
    verified: true,
    ageGroup: "20–40",
  },
  {
    id: "sda-youth-hike",
    title: "SDA Youth Hike",
    subtitle: "Ngong Hills Adventure",
    description:
      "Experience the beauty of God's creation on a guided hike through Ngong Hills. Fellowship, fresh air, and spiritual reflections along the trail. All fitness levels welcome.",
    date: "2026-04-19",
    time: "6:00 AM — 3:00 PM",
    location: "Ngong Hills, Nairobi",
    category: "Outdoor & Nature",
    image: "youth-hike",
    ticketTiers: [{ name: "General Admission", price: 1000, currency: "KSh" }],
    capacity: 80,
    registered: 54,
    churchName: "Nairobi Central SDA",
    ministryFocus: "Youth Ministries",
    bibleVerse: "The heavens declare the glory of God; the skies proclaim the work of his hands.",
    bibleReference: "Psalm 19:1",
    verified: true,
    ageGroup: "18–35",
  },
  {
    id: "inter-church-football",
    title: "Inter-Church Football League",
    subtitle: "Season 3 Kickoff",
    description:
      "Compete in the third season of the SDA Inter-Church Football League. Teams from churches across Nairobi come together for healthy competition and brotherhood.",
    date: "2026-05-03",
    time: "8:00 AM — 5:00 PM",
    location: "Nyayo Stadium, Nairobi",
    category: "Sports & Health",
    image: "youth-hike",
    ticketTiers: [
      { name: "Team Registration", price: 10000, currency: "KSh", description: "Per team of 15 players" },
      { name: "Spectator", price: 200, currency: "KSh" },
    ],
    capacity: 500,
    registered: 320,
    churchName: "East Africa Union Conference",
    ministryFocus: "Health & Temperance",
    bibleVerse: "Do you not know that your bodies are temples of the Holy Spirit?",
    bibleReference: "1 Corinthians 6:19",
    verified: true,
  },
  {
    id: "hospital-outreach",
    title: "Hospital Visitation Outreach",
    subtitle: "Sharing Hope & Comfort",
    description:
      "Join fellow believers in visiting patients at Kenyatta National Hospital. Bring hope, prayers, and care packages to those in need.",
    date: "2026-04-05",
    time: "9:00 AM — 1:00 PM",
    location: "Kenyatta National Hospital, Nairobi",
    category: "Service & Mission",
    image: "service-mission",
    ticketTiers: [{ name: "Volunteer Registration", price: 0, currency: "KSh" }],
    capacity: 40,
    registered: 28,
    churchName: "Milimani SDA Church",
    ministryFocus: "Community Services",
    bibleVerse: "I was sick and you looked after me.",
    bibleReference: "Matthew 25:36",
    verified: true,
  },
];
