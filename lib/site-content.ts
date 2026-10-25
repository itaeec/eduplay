import type { AnimalKind } from "@/components/ui/australian-animals";

// Content copied from https://edu-play.com.au/ (home page).

const SITE = "https://edu-play.com.au";

export const links = {
  facebook: "https://www.facebook.com/p/Edu-Play-Early-Learning-Centre-61554037197376/",
  bookTour: "http://ccs-altonarailwayst.kinderm8.com.au/enquiry-form",
  familyTour: "https://ccs-altonarailwayst.kinderm8.com.au/parent-tour-form",
  contact: "/contact",
  faqs: "/faqs",
  news: "/news",
};

export const nav = [
  { label: "Our Rooms", href: "/#rooms" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "News", href: "/news" },
  { label: "FAQs", href: "/faqs" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

export const hero = {
  eyebrow: "Edu-Play Early Learning Centre",
  headline: "Now Taking ESK & Pre\u2011Prep Enrolments for 2026",
  description:
    "New, 30-place long daycare & kindergarten exclusively for 2 years and older, offering a calm and personalised environment that children love.",
  address: "47 Railway St Nth, Altona VIC 3018",
};

export const differences = [
  {
    title: "Small & Homely",
    body: "We only build and operate centres in Altona, with a small and homely feel, so that children feel relaxed, confident and at home. Social & Emotional Wellbeing is embedded into our physical space, not just our program.",
  },
  {
    title: "Community Focus",
    body: "City Farm, Beach & Bush Kinder programs are a regular part of our curriculum, so children develop a sense of autonomy and connectedness to the Altona community.",
  },
  {
    title: "Locally Owned",
    body: "Owned and operated by local psychologist and early childhood educator, Grace Azzopardi & her amazing team of long-term educators.",
  },
];

export const centreImages = {
  storytime: {
    src: "/images/kangaroos-main-room.jpg",
    alt: "The light-filled Kangaroos room at Edu-Play",
  },
};

export const rooms = [
  {
    number: 1,
    name: "Joeys",
    ages: "1.5 – 3 years",
    cover: "/images/joeys-nature.jpg",
    coverAlt: "The Joeys room, with its nature display and easel",
    photos: [
      { src: "/images/joeys-easel.jpg", alt: "Easel and small tables in the Joeys room" },
      { src: "/images/joeys-playdough.jpg", alt: "Playdough station by the window in the Joeys room" },
      { src: "/images/joeys-books.jpg", alt: "Book corner and home kitchen in the Joeys room" },
      { src: "/images/joeys-blue-wall.jpg", alt: "Blue display wall and nature table in the Joeys room" },
    ],
  },
  {
    number: 2,
    name: "Kangaroos",
    ages: "3 – 6 years",
    cover: "/images/kangaroos-rug.jpg",
    coverAlt: "The Kangaroos room with its big blue rug and hanging greenery",
    photos: [
      { src: "/images/kangaroos-nature-table.jpg", alt: "Nature table with banksias and seed pods" },
      { src: "/images/kangaroos-reading-nook.jpg", alt: "Reading nook with cushions in the Kangaroos room" },
      { src: "/images/kangaroos-home-corner.jpg", alt: "Home corner in the Kangaroos room" },
      { src: "/images/kangaroos-tea-table.jpg", alt: "Tea party table in the Kangaroos room" },
    ],
  },
];

export const lookAround = {
  eyebrow: "Take a look around",
  heading: "Our outdoor spaces",
  photos: [
    { src: "/images/outside-sandpit.jpg", alt: "Sandpit under the shade sail", caption: "Sandpit under the sail" },
    { src: "/images/outside-climbing.jpg", alt: "Climbing frames and balance beams on the lawn", caption: "Climbing & balancing" },
    { src: "/images/outside-tent-table.jpg", alt: "Round painting table under a white canopy", caption: "Art under the canopy" },
    { src: "/images/outside-tables-swing.jpg", alt: "Outdoor dining tables and a blue swing seat", caption: "Outdoor dining & swing" },
    { src: "/images/outside-verandah.jpg", alt: "Verandah with the outdoor planning board and dolls house", caption: "The verandah" },
    { src: "/images/outside-yard.jpg", alt: "The covered play yard", caption: "Covered play yard" },
  ],
};

export const programs = [
  { label: "Long Daycare", href: "/programs/long-daycare" },
  { label: "Kindergarten", href: "/programs" },
  { label: "City Farm Kinder", href: "/programs/city-farm-kinder" },
  { label: "Beach Kinder", href: "/programs/beach-kinder" },
];

export type ExcursionTile =
  | { photo: string; alt: string; label: string }
  | { animal: AnimalKind; label: string; tint: string };

export const excursions = {
  eyebrow: "City Farm & Beach Kinder Program",
  heading: "Weekly Excursions In The Altona Community",
  photo: { src: "/images/veggies-herbs.jpg", alt: "A basket of Edu-Play grown veggies and herbs: cherry tomatoes, broad beans, chives, mint and rosemary" },
  tiles: [
    { photo: "/images/78129425317.jpg", alt: "Two children carrying a bucket along Altona Beach", label: "Beach Kinder" },
    { animal: "kookaburra", label: "City Farm Kinder", tint: "bg-[#f3b46b]" },
    { animal: "koala", label: "Bush Kinder", tint: "bg-[#9ccbb5]" },
    { animal: "echidna", label: "Seed to Feed", tint: "bg-[#efb8ad]" },
  ] as ExcursionTile[],
};

export const testimonials = [
  {
    title: "Happy Drop-Offs Are The Norm",
    quote:
      "I don't need to entice my child to go to kinder any more. He looks forward to the day ahead and enters the room with a big smile and a hug for his friends.",
    author: "Michelle B.",
  },
  {
    title: "We Love The Excursions",
    quote:
      "I love coming home from work and hearing all about the baby goat, harvesting food at City Farm, interesting finds at Altona Beach. My child loves the baby chinos and fish and chips down Pier St too.",
    author: "Catherine L.",
  },
  {
    title: "The Educators Are Amazing",
    quote:
      "Sonya is always smiling and passionate about City Farm Projects. Sue loves her beach kinder and Emily enjoys her science projects. We love that the educators are consistent and predictable.",
    author: "Robert J.",
  },
];

export const faqs = [
  {
    q: "Am I entitled to any rebates?",
    a: "We are a registered childcare and kindergarten provider. CCS rebates and the free kindergarten subsidy are available to eligible families. Please contact Helen to discuss further.",
  },
  {
    q: "Does size really matter?",
    a: "Research shows that children feel safer, relaxed and form richer bonds with educators and peers in small centres. Children also learn more, as there are more frequent one-to-one interactions with educators.",
  },
  {
    q: "Do you offer casual & make up days?",
    a: "We offer make-up days for public holidays in the same week or one week after, subject to availability. We do not offer make-up days for absent days.",
  },
  {
    q: "How many educators & children in the room?",
    a: "We allow up to 22 children and 3 educators in our classroom. This is above required ratios and allows for better quality interactions between our educators and children.",
  },
];


export const footer = {
  culturalSafety:
    "The service strives to create a culturally safe space where Aboriginal children's identities, histories, and rights are respected and celebrated. Staff are trained in cultural safety and embed Aboriginal perspectives into the curriculum, regardless of current enrolment. Families are consulted to ensure practices are inclusive and meaningful.",
  links: [
    { label: "Child Safety", href: "/child-safety" },
    { label: "Circle Of Security", href: "/circle-of-security" },
    { label: "Meet The Owner", href: "/meet-the-owner" },
    { label: "Privacy Policy", href: `${SITE}/policies/privacy-policy` },
    { label: "Terms of Service", href: `${SITE}/policies/terms-of-service` },
  ],
};
