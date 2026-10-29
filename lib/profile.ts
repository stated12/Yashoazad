// ─────────────────────────────────────────────────────────────────────────────
// EDIT THIS FILE to change what the website says about Mr. Azad.
// Source: his one-page profile. Items marked VERIFY must be confirmed with him
// before launch. Items with sensitive: true are hidden unless he approves them
// in writing; to show them, set SHOW_SENSITIVE_DETAILS to true.
// ─────────────────────────────────────────────────────────────────────────────
export const SHOW_SENSITIVE_DETAILS = false;

export const HIGHLIGHTS = [
  { value: "1976", label: "IPS batch" },
  { value: "Special Director", label: "Intelligence Bureau" },
  { value: "Secretary (Security)", label: "Government of India" },
  { value: "8,000+", label: "RTI decisions as Central Information Commissioner" }, // VERIFY with CIC records
];

export const SUMMARY =
  "A former Indian Police Service officer whose career in policing, intelligence, national security and public administration spans nearly four decades."; // VERIFY: one-pager also says "40+ years"

export const BIO = [
  "Yashovardhan Azad is a former Indian Police Service officer whose career in policing, intelligence, national security and public administration spans nearly four decades. A member of the 1976 IPS batch, he served as Superintendent of Police and as Deputy Inspector General before joining the Joint Intelligence Committee, the Government of India's apex body for intelligence assessment.", // VERIFY district count: one-pager says four in the text and three in the highlights
  "In 1997 he joined the Intelligence Bureau, where he held a series of senior appointments, rising to Special Director. He later served as Secretary (Security) to the Government of India in the Cabinet Secretariat.",
  "After retiring from government service he was appointed Central Information Commissioner, where he delivered more than 8,000 decisions under the Right to Information Act.", // VERIFY
  "He is Chairman of DeepStrat LLP, and writes and speaks on national security, strategic risk and governance. His book, Policing the Republic, was published by Bloomsbury with a foreword by M.K. Narayanan.",
];

export type Milestone = { year: string; title: string; body: string; sensitive?: boolean };
export const TIMELINE: Milestone[] = [
  { year: "1976", title: "Indian Police Service", body: "Joined the 1976 batch of the IPS. Served as Superintendent of Police and as Deputy Inspector General, building experience in law enforcement and public security administration." }, // VERIFY districts
  { year: "Before 1997", title: "Joint Intelligence Committee", body: "On deputation to the Joint Intelligence Committee, the Government of India's apex body for intelligence assessment." }, // VERIFY dates
  { year: "1997", title: "Intelligence Bureau", body: "Joined the Intelligence Bureau, holding a series of senior appointments in counter-terrorism, protective security and strategic intelligence, and rising to Special Director." }, // VERIFY year of promotion
  {
    year: "1997 onwards",
    title: "International and protective assignments",
    body: "Security assessments for senior political leadership, international assignments in Pakistan and Bangladesh, and security coordination for visiting Heads of State, including the State visit of US President Bill Clinton to India.",
    sensitive: true,
  },
  { year: "Post-IB", title: "Secretary (Security), Government of India", body: "Appointed Secretary (Security) in the Cabinet Secretariat." }, // VERIFY years
  {
    year: "Post-IB",
    title: "Prime Minister's security and the Crisis Management Group",
    body: "Responsible for the Prime Minister's security and for coordinating the national Crisis Management Group on behalf of the Cabinet Secretary.",
    sensitive: true,
  },
  { year: "Post-retirement", title: "Central Information Commissioner", body: "Adjudicated appeals under the Right to Information Act and delivered more than 8,000 decisions." }, // VERIFY years and count
  { year: "Today", title: "Chairman, DeepStrat LLP; author and commentator", body: "Writes and speaks on national security, strategic risk and governance. Author of Policing the Republic (Bloomsbury)." },
];

export const EXPERTISE = [
  { title: "Counter-terrorism and internal security", body: "Senior experience in counter-terrorism and internal security at the Intelligence Bureau." },
  { title: "National security strategy", body: "National security and crisis-management experience as Secretary (Security) in the Cabinet Secretariat." },
  { title: "Intelligence analysis", body: "Multi-agency assessment and strategic coordination through the Joint Intelligence Committee." },
  { title: "Protective security and risk", body: "Protective security, security coordination and risk management for senior leaders." },
  { title: "Governance and RTI law", body: "Right to Information jurisprudence, informed by more than 8,000 decisions as Central Information Commissioner." },
  { title: "Media and strategic commentary", body: "Articles and television commentary on national security, governance and geopolitical affairs." },
];

export const HONOURS = [
  { title: "Police Medal", body: "Awarded for meritorious service." }, // VERIFY exact name and year (e.g. Indian Police Medal / President's Police Medal)
  { title: "President's Medal", body: "Awarded for distinguished service." }, // VERIFY exact name and year
];

export const COMMUNITY = [
  { title: "Patron, Delhi Cricket Association", body: "Patron of the association founded by Dronacharya Awardee coach Gurcharan Singh, which has produced distinguished Test cricketers." }, // VERIFY wording
  { title: "Mentor, Sant Pathik Vidyalaya", body: "Mentor to a school in Ratanganj block, Banka district, Bihar, committed to education and upliftment in rural India's most marginalised communities." },
  // VERIFY: the one-pager also lists "Yuva Hulla Bol" and "PARI" with no description. Add them here once described.
];

export const BOOK = {
  slug: "policing-the-republic",
  title: "Policing the Republic",
  subtitle: "An Inside View of How India Fights Corruption and Crime, and Protects Rights",
  foreword: "Foreword by M.K. Narayanan",
  publisher: "Bloomsbury",
  cover: "/policing-the-republic.jpg",
  description: [
    "Policing the Republic examines policing, governance, intelligence architecture and the democratic character of the state from the inside.",
    "Rather than recounting operations, it looks at structural problems: political interference, corruption, the criminalisation of politics, fragile investigative mechanisms, and the gap between constitutional ideals and administrative reality.",
    "Its argument is that these are symptoms of institutions in need of deep and sustained reform, and that professionalism, accountability and institutional independence are central to that reform.",
  ],
  readers: "Policymakers, civil servants, police officers, students of public administration and law, and any citizen who wants to understand how the system works.",
  // Add only verified retailer links, e.g. { label: "Bloomsbury India", url: "https://..." }
  buyLinks: [] as { label: string; url: string }[],
};
