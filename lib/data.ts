// Single source of truth for all content. Every claim here comes from Taimoor’s own LinkedIn/CV.
// Dates marked "verify" in comments are best placement by employer period; Taimoor should confirm.

export type WingId = "voice" | "automation" | "agents" | "engineering";

export type Wing = {
  id: WingId;
  name: string; // short card title, like "Web" / "Mobile" on the reference
  blurb: string; // tag-style one-liner under the title
};

export const wings: Wing[] = [
  { id: "voice", name: "Voice AI", blurb: "Phone agents that answer, qualify and book" },
  { id: "automation", name: "Automation", blurb: "CRM and revenue systems that run themselves" },
  { id: "agents", name: "AI agents", blurb: "Workflows where the model makes the call" },
  { id: "engineering", name: "Engineering", blurb: "Code, dashboards and computer vision" },
];

export type FlowStep = { label: string; tool: string };

export type Release = {
  slug: string;
  version: string; // "v2026.8" style, newest has the highest number in its year
  year: number;
  date: string; // display date, e.g. "Sep 2026" or "2026" when the month is unknown
  dateLong: string; // detail page, e.g. "September 2026" or "2026"
  kind: string; // tag on cards, e.g. "Voice AI"
  wing: WingId;
  name: string;
  tagline: string; // one line, like the reference’s release subtitles
  context: string; // anonymised client
  shipped: string[]; // "What shipped" bullets
  stack: string[];
  about: string; // "About this release" paragraph
  flow: FlowStep[]; // used for the "On screen" visual instead of screenshots (client work is under NDA)
  result?: { value: string; label: string };
  status?: "In build";
  // Example call shown behind the workflow in the hero. Illustrative, not a real customer call.
  transcript?: { who: "agent" | "caller"; text: string }[];
};

// Newest first.
export const releases: Release[] = [
  {
    slug: "referral-platform",
    version: "v2026.12",
    year: 2026,
    date: "Sep 2026",
    dateLong: "September 2026",
    kind: "Web app",
    wing: "engineering",
    name: "Brand Referral Platform",
    tagline: "A referral platform where outside scouts bring brands in and earn commission",
    context: "8x, remote contract",
    shipped: [
      "Owned the scout-facing frontend end to end",
      "Scout onboarding, referral tracking and a weekly leaderboard",
      "Shipped through branch, pull request, review and merge, with CI deploys",
      "Built in a distributed remote team with review on every change",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS", "Vercel"],
    about:
      "A referral platform for brand partnerships, piloted in one market. Outside scouts sign up, share a referral link, and earn commission when a brand they brought in takes a meeting. I owned the scout-facing UI so the go-to-market team could spend their time recruiting scouts instead of building product. Next.js with Prisma and Tailwind, every change through a pull request and review.",
    flow: [
      { label: "Scout signs up", tool: "Next.js" },
      { label: "Shares referral link", tool: "Referral tracking" },
      { label: "Brand meeting booked", tool: "CRM" },
      { label: "Ranked weekly", tool: "Leaderboard" },
    ],
    result: { value: "Shipped", label: "through PR review and CI" },
  },
  {
    slug: "appointment-confirmation-agent",
    version: "v2026.11",
    year: 2026,
    date: "Sep 2026",
    dateLong: "September 2026",
    kind: "Voice AI",
    wing: "voice",
    name: "Appointment Confirmation Agent",
    tagline: "Calls homeowners before their inspection to confirm, move or cancel it",
    context: "Roofing company, US",
    shipped: [
      "One call handles all three outcomes: confirm, reschedule, cancel",
      "Reads the appointment time from a contact field, matching how the client stores it",
      "CRM updated as soon as the call ends",
    ],
    stack: ["GoHighLevel Voice AI", "GoHighLevel workflows"],
    about:
      "No-shows cost an inspector a day. Someone used to ring every homeowner the day before to check they would be in. This agent makes that call. The appointment lives in a contact field rather than a calendar booking, so the agent reads it from there and handles confirm, reschedule or cancel on the same call.",
    flow: [
      { label: "Appointment coming up", tool: "GoHighLevel" },
      { label: "Homeowner called", tool: "Voice AI" },
      { label: "Confirm, move or cancel", tool: "Voice AI" },
      { label: "CRM updated", tool: "GoHighLevel" },
    ],
    status: "In build",
  },
  {
    slug: "lead-response-engine",
    version: "v2026.10",
    year: 2026,
    date: "Aug 2026",
    dateLong: "June to August 2026",
    kind: "Automation",
    wing: "automation",
    name: "Lead Response & Review Engine",
    tagline: "The CRM backend behind client websites, replying to every lead in under two minutes",
    context: "Digital agency, US",
    shipped: [
      "Lead response cut from hours to under 2 minutes",
      "Inbound leads captured, deduplicated, tagged and routed automatically",
      "Roughly 12% of cold leads recovered with segmented email and SMS sequences",
      "Roughly 30% more reviews from automated requests and live review widgets",
      "Google Business Profile reviews, messages and listings synced into the CRM",
      "Phone routing and number provisioning through TextGrid, so no call is missed",
    ],
    stack: ["GoHighLevel", "TextGrid", "Google Business Profile", "Email", "SMS"],
    about:
      "Every client site launched with a working lead-capture and follow-up engine behind it. Leads used to wait hours for a reply, cold leads were never contacted again, and reviews came in by luck. I owned the GoHighLevel backend that fixed all three: instant capture and routing, remarketing sequences that bring cold leads back, review requests on branded subdomains, and phone routing so a ringing phone always reaches someone.",
    flow: [
      { label: "Form or call comes in", tool: "Website / TextGrid" },
      { label: "Deduplicated and tagged", tool: "GoHighLevel" },
      { label: "Followed up", tool: "Email + SMS" },
      { label: "Review requested", tool: "Google Business Profile" },
    ],
    result: { value: "< 2 min", label: "lead response, down from hours" },
  },
  {
    slug: "restaurant-voice-ordering",
    version: "v2026.9",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Voice AI",
    wing: "voice",
    name: "Restaurant Voice Ordering Agent",
    tagline: "A phone agent that takes the order, texts the payment link and prints the ticket",
    context: "Restaurant",
    shipped: [
      "Takes pickup and delivery orders over the phone and reads live menu prices",
      "Confirms the order and total with the caller before anything is charged",
      "n8n creates a Stripe payment link through the API and sends it by SMS",
      "Ticket printed in the kitchen with no one touching it",
      "Staff dashboard for menu availability and call logs",
    ],
    stack: ["GoHighLevel Voice AI", "n8n", "Stripe API", "SMS", "Next.js"],
    about:
      "Every phone order used to need someone to answer, read back prices, take payment and write the ticket, and busy hours meant missed calls. Now a voice agent takes the order, confirms the total, and hands off to an n8n workflow that creates a Stripe payment link, texts it to the caller and prints the ticket in the kitchen. Staff manage what is available from a Next.js dashboard, so the agent never sells something the kitchen has run out of.",
    flow: [
      { label: "Caller orders", tool: "Voice AI" },
      { label: "Total confirmed", tool: "GoHighLevel" },
      { label: "Payment link", tool: "n8n + Stripe" },
      { label: "Text sent", tool: "SMS" },
      { label: "Ticket printed", tool: "Printer" },
    ],
    result: { value: "0", label: "staff steps from call to ticket" },
    transcript: [
      { who: "agent", text: "Thanks for calling. Is this for pickup or delivery?" },
      { who: "caller", text: "Pickup. Two large margherita pizzas and a garlic bread." },
      { who: "agent", text: "Got it. That comes to $31.40. I’m texting you a secure payment link now." },
      { who: "caller", text: "Got the text. Paying now." },
      { who: "agent", text: "Thanks. Your order is in and will be ready in about 20 minutes." },
    ],
  },
  {
    slug: "ops-dashboard",
    version: "v2026.8",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Web app",
    wing: "engineering",
    name: "Restaurant Ops Dashboard",
    tagline: "Live menu availability and AI call logs for restaurant staff",
    context: "Restaurant",
    shipped: [
      "Real-time menu availability the voice agent reads from",
      "Call logs so staff can see what the agent said and did",
      "Token-authenticated API page, so only the agent and staff can reach it",
    ],
    stack: ["Next.js", "Supabase", "REST API"],
    about:
      "Staff had no window into what the voice agent was doing and no way to stop it selling sold-out dishes. This dashboard gives them both: toggle an item off and the agent stops offering it, open the log and see every call. The API behind it is token-protected.",
    flow: [
      { label: "Staff toggle items", tool: "Next.js" },
      { label: "Agent reads menu", tool: "API" },
      { label: "Calls logged", tool: "Dashboard" },
    ],
  },
  {
    slug: "outbound-dialler-fix",
    version: "v2026.7",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Voice AI",
    wing: "voice",
    name: "Outbound AI Dialler",
    tagline: "An outbound AI dialler that was calling people twice, fixed at the source",
    context: "Outbound sales team",
    shipped: [
      "Traced a duplicate-call race condition across four services",
      "Idempotency checks so a number can only be claimed once",
      "Error handling around every call step",
      "Successful calls create the contact in GoHighLevel automatically",
    ],
    stack: ["Retell AI", "n8n", "Supabase", "SignalWire", "GoHighLevel"],
    about:
      "Prospects were sometimes rung twice in a row, which burns phone numbers and makes a company look careless. The cause sat between Retell AI, n8n, Supabase and SignalWire: overlapping executions picking up the same record. I added idempotency checks so each number is claimed once, wrapped every call step in error handling, and sent good outcomes straight into the CRM.",
    flow: [
      { label: "Numbers uploaded", tool: "Supabase" },
      { label: "Call placed", tool: "Retell AI + SignalWire" },
      { label: "Status checked", tool: "n8n" },
      { label: "Lead created", tool: "GoHighLevel" },
    ],
    result: { value: "0", label: "duplicate dials after the fix" },
  },
  {
    slug: "heyreach-reply-classifier",
    version: "v2026.6",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "AI agent",
    wing: "agents",
    name: "AI Reply Classifier",
    tagline: "Claude reads every outreach reply and tells sales which ones are worth a human",
    context: "Self-built, open to walk through",
    shipped: [
      "Every LinkedIn reply classified by intent with a short reason from Claude",
      "Conversations written into GoHighLevel automatically",
      "Slack alert the moment a reply is interested, reasoning attached",
      "Fixed message ordering from HeyReach so the model reads the thread in order",
      "Sync keyed on a message count so re-runs never duplicate messages",
    ],
    stack: ["n8n", "Claude API", "GoHighLevel", "Slack", "HeyReach"],
    about:
      "Interested leads were sitting in an inbox next to auto-replies, out-of-office notes and hard no’s, and someone had to read all of them. This n8n workflow pulls each reply from HeyReach, asks Claude for an intent label and a reason, writes the conversation into the CRM and pings Slack only when it matters. Along the way it fixed silent JSON corruption between nodes and a CRM API scope error that was blocking writes.",
    flow: [
      { label: "Reply pulled", tool: "HeyReach" },
      { label: "Intent classified", tool: "Claude" },
      { label: "Logged to CRM", tool: "GoHighLevel" },
      { label: "Sales alerted", tool: "Slack" },
    ],
    result: { value: "Real time", label: "alert when a lead is interested" },
  },
  {
    slug: "unified-outreach-inbox",
    version: "v2026.5",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Automation",
    wing: "automation",
    name: "Unified Outreach Inbox",
    tagline: "LinkedIn and email outreach replies, read and answered from one CRM inbox",
    context: "Automation agency",
    shipped: [
      "Custom GoHighLevel conversation provider for HeyReach and Smartlead",
      "300+ leads and replies a month synced with the right mapping, tags and pipeline stage",
      "Replies typed in the CRM go back out through the original tool",
      "Calendly bookings sync in, creating missing contacts and attaching the meeting link",
    ],
    stack: ["GoHighLevel", "HeyReach", "Smartlead", "n8n", "Calendly", "Webhooks"],
    about:
      "Replies were split across two outreach tools, so sales checked both and copied conversations into the CRM by hand. A custom conversation provider brings both into one GoHighLevel inbox, two-way: read there, reply there, and the message goes out through whichever tool started the thread. Booked meetings land in the CRM too.",
    flow: [
      { label: "Reply arrives", tool: "HeyReach / Smartlead" },
      { label: "Mapped and tagged", tool: "n8n" },
      { label: "One inbox", tool: "GoHighLevel" },
      { label: "Reply sent back", tool: "Conversation provider" },
    ],
    result: { value: "300+", label: "leads and replies a month" },
  },
  {
    slug: "self-serve-onboarding",
    version: "v2026.4",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Automation",
    wing: "automation",
    name: "Self-Serve Client Onboarding",
    tagline: "Sign up, pay, and the CRM account builds itself",
    context: "Automation agency",
    shipped: [
      "Self-serve signup page with Stripe payment",
      "GoHighLevel sub-account provisioned automatically after payment",
      "Client lands in a custom launchpad to get started",
      "About 45 minutes of manual setup per client removed",
    ],
    stack: ["Stripe", "GoHighLevel API", "Next.js"],
    about:
      "Every new client used to mean about 45 minutes of someone clicking through account setup, and setup quality depended on who did it. Now the client signs up and pays, the system provisions their GoHighLevel sub-account, and they land in a launchpad. Every account is set up the same way because nobody sets it up by hand.",
    flow: [
      { label: "Client pays", tool: "Stripe" },
      { label: "Sub-account built", tool: "GoHighLevel API" },
      { label: "Launchpad opens", tool: "Custom page" },
    ],
    result: { value: "45 min → 0", label: "manual setup per client" },
  },
  {
    slug: "credit-services-voice-intake",
    version: "v2026.3",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Voice AI",
    wing: "voice",
    name: "24/7 Voice Intake Agent",
    tagline: "Answers every inbound call, day or night, and files a clean CRM record",
    context: "Credit services company, US",
    shipped: [
      "Vapi agent runs the live qualifying call",
      "Make.com normalises the call outcome from a webhook",
      "Qualified and unqualified callers routed to different pipelines",
      "Diagram and plain-language guide handed over for a non-technical team",
    ],
    stack: ["Vapi", "Make.com", "GoHighLevel", "Webhooks"],
    about:
      "Inbound calls were the main lead channel, but after-hours calls went to voicemail and went cold, and intake quality depended on who picked up. Two halves fix it: Vapi holds the conversation and follows a qualification script, then Make.com picks up the outcome, cleans it and writes a tagged, routed contact into GoHighLevel.",
    flow: [
      { label: "Call answered", tool: "Vapi" },
      { label: "Caller qualified", tool: "Vapi" },
      { label: "Outcome cleaned", tool: "Make.com" },
      { label: "Record routed", tool: "GoHighLevel" },
    ],
    result: { value: "24/7", label: "every inbound call answered" },
  },
  {
    slug: "real-estate-crm-migration",
    version: "v2026.2",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Automation",
    wing: "automation",
    name: "Real Estate CRM Migration",
    tagline: "Thousands of spreadsheet rows moved into CRM objects, then into WhatsApp follow-up",
    context: "Real estate agency, Brazil",
    shipped: [
      "Python importer for contacts and custom object records via the GoHighLevel API",
      "Many-to-many links between people and properties kept intact",
      "Existing contacts protected from duplicates and linked retroactively",
      "n8n starts WhatsApp follow-up from the clean records",
    ],
    stack: ["Python", "GoHighLevel API", "Custom objects", "n8n", "WhatsApp"],
    about:
      "Property and contact data lived in spreadsheets while follow-up had to happen in the CRM and on WhatsApp. A Python importer moved it into GoHighLevel custom objects without flattening the relationships, and n8n now starts WhatsApp follow-up from the clean data. New records can be added without rebuilding anything.",
    flow: [
      { label: "Rows cleaned", tool: "Python" },
      { label: "Records created", tool: "GoHighLevel API" },
      { label: "Links kept", tool: "Python" },
      { label: "Follow-up starts", tool: "n8n + WhatsApp" },
    ],
    result: { value: "10,000+", label: "records, no manual re-entry" },
  },
  {
    slug: "whatsapp-assistant-handoff",
    version: "v2026.1",
    year: 2026,
    date: "2026",
    dateLong: "2026",
    kind: "Automation",
    wing: "automation",
    name: "WhatsApp Assistant Handoff",
    tagline: "When a lead says ‘talk to my assistant’, the bot does exactly that",
    context: "Client project",
    shipped: [
      "Assistant’s name and number captured mid-chat by Conversation AI",
      "New contact created with the same record links as the original lead",
      "Conversation restarted with the assistant automatically",
    ],
    stack: ["GoHighLevel Conversation AI", "Make.com", "WhatsApp", "Webhooks"],
    about:
      "Busy leads often hand off to an assistant halfway through a chat. Someone used to create the new contact, copy its links and start a fresh conversation by hand. Now the bot captures the details, Make.com builds the linked contact, and the chat picks up with the assistant.",
    flow: [
      { label: "Lead shares number", tool: "WhatsApp" },
      { label: "Details saved", tool: "Conversation AI" },
      { label: "Contact cloned", tool: "Make.com" },
      { label: "Chat restarts", tool: "WhatsApp" },
    ],
  },
  {
    slug: "ai-sales-chatbot",
    version: "v2025.6",
    year: 2025,
    date: "Nov 2025",
    dateLong: "November 2025",
    kind: "AI agent",
    wing: "agents",
    name: "AI Sales Chatbot",
    tagline: "A website chatbot that answers questions and sends the payment link",
    context: "Self-built",
    shipped: [
      "Name and email pulled out of the conversation by OpenAI",
      "Every message sorted into buy, question or book a call",
      "Secure payment link sent the moment someone wants to buy",
      "Contact enriched in GoHighLevel, with fallbacks so it never dead-ends",
    ],
    stack: ["n8n", "OpenAI", "GoHighLevel", "Webhooks"],
    about:
      "Small businesses lose buyers who ask a question after hours and never hear back. This bot greets them, collects their details, answers from the FAQ, and when someone says they want to buy, sends a payment link in the same conversation. Built in n8n with conversation memory.",
    flow: [
      { label: "Message in", tool: "Webhook" },
      { label: "Details extracted", tool: "OpenAI" },
      { label: "Intent detected", tool: "OpenAI" },
      { label: "Answer or pay link", tool: "n8n + GoHighLevel" },
    ],
  },
  {
    slug: "blog-publishing-pipeline",
    version: "v2025.5",
    year: 2025,
    date: "Nov 2025",
    dateLong: "November 2025",
    kind: "AI agent",
    wing: "agents",
    name: "AI Blog Publishing Pipeline",
    tagline: "Writes, illustrates and publishes an SEO article every morning at 9",
    context: "Client project",
    shipped: [
      "Topic rotation that never repeats until the list is used up",
      "800 to 1,000 word structured article with metadata and disclaimers",
      "Generated cover image uploaded and injected as a Gutenberg block",
      "Published through the WordPress REST API, with an email summary",
    ],
    stack: ["n8n", "OpenAI", "WordPress REST API"],
    about:
      "A content pipeline that runs every morning without anyone touching it. It picks the next topic, writes a compliant financial education article, generates a cover illustration, uploads it to WordPress, publishes the post and emails a summary with the link.",
    flow: [
      { label: "Topic picked", tool: "n8n" },
      { label: "Article written", tool: "OpenAI" },
      { label: "Cover generated", tool: "OpenAI" },
      { label: "Published", tool: "WordPress" },
    ],
  },
  {
    slug: "airtable-ops-system",
    version: "v2025.4",
    year: 2025,
    date: "2025",
    dateLong: "2025",
    kind: "Automation",
    wing: "automation",
    name: "Corporate Gifting Order System",
    tagline: "An order system for a corporate gifting company, fed by its chat inbox",
    context: "B2B corporate gifting company",
    shipped: [
      "8 tables, 27 views, 9 interfaces and 10 automations",
      "Respond.io conversations mapped into Airtable through Make.com",
      "Requirements spec written before building, handover docs after",
    ],
    stack: ["Airtable", "Make.com", "Respond.io"],
    about:
      "Orders and customer conversations lived in different places with no shared structure. I wrote the requirements first, then built the Airtable base the team now runs orders from, with chats from Respond.io flowing in through Make.com.",
    flow: [
      { label: "Customer chats", tool: "Respond.io" },
      { label: "Fields mapped", tool: "Make.com" },
      { label: "Order tracked", tool: "Airtable" },
    ],
  },
  {
    slug: "crypto-sentiment-pipeline",
    version: "v2025.3",
    year: 2025,
    date: "2025",
    dateLong: "2025",
    kind: "AI agent",
    wing: "agents",
    name: "Crypto Sentiment Pipeline",
    tagline: "Crypto chatter from Reddit and the news, deduplicated and scored",
    context: "Personal project",
    shipped: [
      "Reddit and RSS sources scraped on a schedule",
      "FNV-1a hashing so one story from five sources counts once",
      "Custom keyword scoring",
      "PostgreSQL storage behind a webhook API",
    ],
    stack: ["n8n", "PostgreSQL", "Webhooks"],
    about:
      "Market chatter is noisy and repeats itself. This pipeline collects it, removes duplicates with FNV-1a hashes, scores each post, and serves the result over a webhook endpoint.",
    flow: [
      { label: "Posts collected", tool: "Reddit + RSS" },
      { label: "Duplicates removed", tool: "FNV-1a" },
      { label: "Scored", tool: "Keyword model" },
      { label: "Served", tool: "PostgreSQL + webhook" },
    ],
  },
  {
    slug: "fuel-station-vision",
    version: "v2025.2",
    year: 2025,
    date: "2025",
    dateLong: "2025",
    kind: "Computer vision",
    wing: "engineering",
    name: "Fuel Station Safety Vision",
    tagline: "Plate reading and safety alerts, so staff review moments instead of footage",
    context: "Fuel retail chain",
    shipped: [
      "Vehicle and number plate recognition",
      "PPE non-compliance and loitering detection",
      "Rule-based alerts through FastAPI services and n8n",
      "Manual camera review time cut by 65%",
    ],
    stack: ["YOLO", "OpenCV", "OCR", "Python", "FastAPI", "n8n"],
    about:
      "Operators were scrubbing hours of camera footage to find the few events that mattered. Detection models for plates, PPE and loitering, combined with event rules, now surface those moments as alerts.",
    flow: [
      { label: "Camera frame", tool: "CCTV" },
      { label: "Plates and PPE", tool: "YOLO + OCR" },
      { label: "Rules applied", tool: "Python" },
      { label: "Alert sent", tool: "FastAPI + n8n" },
    ],
    result: { value: "65%", label: "less footage review" },
  },
  {
    slug: "retail-shelf-vision",
    version: "v2025.1",
    year: 2025,
    date: "2025",
    dateLong: "2025",
    kind: "Computer vision",
    wing: "engineering",
    name: "Retail Shelf Vision",
    tagline: "Brand recognition and shelf checks for a beverage bottler",
    context: "FMCG bottler",
    shipped: [
      "YOLO models for brand recognition and shelf quality",
      "Annotation errors cut 25% with a shared label taxonomy and peer review",
      "Live stock visibility from sensor data, with alerts",
    ],
    stack: ["YOLO", "Python", "Sensors", "Alerting"],
    about:
      "Shelf audits were manual and the training data behind the models had inconsistent labels. A standard taxonomy and peer review cleaned the data, YOLO models handle recognition and quality checks, and sensor ingestion gives bottlers live stock levels.",
    flow: [
      { label: "Shelf photo", tool: "Field team" },
      { label: "Brands detected", tool: "YOLO" },
      { label: "Quality checked", tool: "Python" },
      { label: "Low stock alerted", tool: "Sensors" },
    ],
    result: { value: "25%", label: "fewer annotation errors" },
  },
];

export const featuredSlug = "restaurant-voice-ordering";

// Year groups for the release history, newest first. Milestones sit under their year like the reference.
export const years: { year: number; caption: string; milestones: { date: string; text: string; current?: boolean }[] }[] = [
  {
    year: 2026,
    caption: "The remote year: US clients, voice agents in production, and code shipped at 8x.",
    milestones: [
      { date: "Sep 2026", text: "Software Engineer at 8x on a remote contract. Owned the Scout frontend." },
      { date: "Jun 2026", text: "Automation Engineer for Systemic Digital, a US agency, remote." },
      { date: "Feb 2026", text: "Joined Kode X Labs as AI Automation Engineer. 8 production automations in under 2 months.", current: true },
    ],
  },
  {
    year: 2025,
    caption: "The vision and automation year: enterprise computer vision, then the first n8n agents.",
    milestones: [],
  },
  {
    year: 2024,
    caption: "Graduated and went to work on computer vision for enterprise retail.",
    milestones: [
      { date: "Oct 2024", text: "Joined AdAxiom. Computer vision for enterprise retail and FMCG clients." },
      { date: "2024", text: "BS Computer Science, NCBA&E Lahore." },
    ],
  },
  {
    year: 2023,
    caption: "Year zero: the first production Python, in an internship.",
    milestones: [{ date: "Jun 2023", text: "Python and Flask internship at Borjan. Everything above came after it." }],
  },
];

export const profile = {
  name: "Taimoor Asif",
  first: "Taimoor",
  last: "Asif",
  title: "AI Engineer",
  currently: "AI Automation Engineer at Kode X Labs",
  location: "Lahore, PK",
  locationLong: "Lahore, Pakistan",
  utc: "UTC+5",
  startedYear: 2023,
  email: "taimoorasif48@gmail.com",
  github: "https://github.com/Taimoor505",
  linkedin: "https://www.linkedin.com/in/taimoor-asif-433969240",
  whatsapp: "https://wa.me/923209485484",
  resume: "/resume.pdf",
  replies: "Usually within 24 hours",
  intro:
    "I build AI agents, voice agents and automations that run a business’s day-to-day work, and the code around them in Python and Next.js. I still sweat the edge cases most automations skip.",
};

export type Area = { title: string; text: string };
export type Role = {
  slug: string;
  period: string; // "Feb 2026 — Present" style is avoided; use "Feb 2026 to now"
  duration: string;
  type: string;
  location: string;
  current?: boolean;
  title: string;
  org: string;
  summary: string;
  areas: Area[];
  stack: string[];
};

export const roles: Role[] = [
  {
    slug: "kode-x-labs",
    period: "Feb 2026 to now",
    duration: "9 mos",
    type: "Full-time",
    location: "Lahore",
    current: true,
    title: "AI Automation Engineer",
    org: "Kode X Labs",
    summary:
      "I build the automations agency clients run on: voice agents that answer the phone, pipelines that move outreach into the CRM, and the small apps and dashboards around them. Eight production automations shipped in my first two months.",
    areas: [
      { title: "Voice AI", text: "Inbound ordering and outbound calling agents on GoHighLevel and Retell AI, wired to payments, SMS and the CRM." },
      { title: "Outreach to CRM", text: "A custom conversation provider that brings HeyReach and Smartlead into one GoHighLevel inbox, 300+ leads and replies a month." },
      { title: "Onboarding", text: "A Stripe signup that provisions a GoHighLevel sub-account on its own, removing about 45 minutes of setup per client." },
      { title: "Internal tools", text: "A Next.js ops dashboard with live menu availability and call logs, and a Python importer that moved 5,000+ rows into GoHighLevel." },
    ],
    stack: ["GoHighLevel", "n8n", "Retell AI", "Stripe", "Python", "Next.js", "Supabase"],
  },
  {
    slug: "8x",
    period: "Sep 2026 to Oct 2026",
    duration: "2 mos",
    type: "Contract",
    location: "Remote",
    title: "Software Engineer",
    org: "8x",
    summary:
      "Built product in a distributed remote team. I owned the frontend of a referral platform for brand partnerships and worked on an AI support bot for the hiring product.",
    areas: [
      { title: "Scout frontend", text: "Onboarding, referral tracking and a weekly leaderboard in Next.js, Prisma and Tailwind." },
      { title: "How we shipped", text: "Branch, pull request, review and merge on every change, with CI deploys." },
      { title: "AI support", text: "Worked on the hiring support bot so it resolves more candidate questions without a human handoff." },
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS", "Claude Code"],
  },
  {
    slug: "systemic-digital",
    period: "Jun 2026 to Aug 2026",
    duration: "3 mos",
    type: "Contract",
    location: "Remote · US team",
    title: "Automation Engineer",
    org: "Systemic Digital",
    summary:
      "I owned the GoHighLevel backend behind client websites, so each site launched with a working lead-capture and follow-up engine.",
    areas: [
      { title: "Lead response", text: "Capture, deduplication, tagging and routing that cut response time from hours to under 2 minutes." },
      { title: "Remarketing", text: "Segmented email and SMS sequences that recovered roughly 12% of cold leads." },
      { title: "Reputation", text: "Automated review requests, branded review subdomains and live widgets lifted review volume roughly 30%." },
      { title: "Phones", text: "TextGrid routing and number provisioning integrated with GoHighLevel so no inbound call is missed." },
    ],
    stack: ["GoHighLevel", "TextGrid", "Google Business Profile", "Email & SMS"],
  },
  {
    slug: "adaxiom",
    period: "Oct 2024 to Feb 2026",
    duration: "1 yr 5 mos",
    type: "Full-time",
    location: "Lahore",
    title: "Junior Software Developer",
    org: "AdAxiom",
    summary: "Computer vision and inference services for enterprise retail and FMCG clients.",
    areas: [
      { title: "Shelf vision", text: "YOLO brand recognition and shelf-quality checks for a beverage bottler; annotation errors cut 25%." },
      { title: "Forecourt analytics", text: "Plate recognition and PPE compliance for a fuel retail chain; manual camera review cut 65%." },
      { title: "Services", text: "FastAPI inference microservices triggered by n8n events, plus sensor ingestion and alerting." },
    ],
    stack: ["Python", "YOLO", "OpenCV", "FastAPI", "n8n"],
  },
  {
    slug: "borjan",
    period: "Jun 2023 to Jul 2023",
    duration: "2 mos",
    type: "Internship",
    location: "Lahore",
    title: "Intern",
    org: "Borjan",
    summary: "Python and Flask backend scripts for internal data processing.",
    areas: [],
    stack: ["Python", "Flask"],
  },
];

// "What I work in" groups (reference has 4 groups with a paragraph and tags)
export const practice: { title: string; text: string; tags: string[] }[] = [
  {
    title: "Voice AI",
    text: "Phone agents that hold a real conversation and still land clean, structured data in the CRM, with payments, SMS and handoff wired in.",
    tags: ["Retell AI", "Vapi", "GoHighLevel Voice AI", "ElevenLabs", "SignalWire", "Twilio"],
  },
  {
    title: "Automation & CRM",
    text: "Workflows that survive real data: retries, deduplication, idempotency and clean field mapping, documented so a team can own them.",
    tags: ["n8n", "Make.com", "Zapier", "GoHighLevel", "Airtable", "Webhooks"],
  },
  {
    title: "AI & LLMs",
    text: "Models put to work on classification, extraction and drafting inside the tools a team already uses, with the reasoning kept visible.",
    tags: ["Claude API", "OpenAI API", "LangChain", "RAG", "Prompt design"],
  },
  {
    title: "Code & vision",
    text: "Next.js dashboards, Python services and APIs, and a computer vision background from enterprise retail work.",
    tags: ["Python", "TypeScript", "Next.js", "FastAPI", "Supabase", "YOLO", "OpenCV"],
  },
];

export function getRelease(slug: string) {
  return releases.find((r) => r.slug === slug);
}
export function releasesByYear() {
  const map = new Map<number, Release[]>();
  for (const r of releases) {
    if (!map.has(r.year)) map.set(r.year, []);
    map.get(r.year)!.push(r);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}
export function wingCount(id: WingId) {
  return releases.filter((r) => r.wing === id).length;
}
