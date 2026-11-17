import type {
  AboutPageContent,
  AdminUser,
  AppointmentRequest,
  AuditLog,
  ChatConversation,
  ChatMessage,
  ContactEnquiry,
  ContentItem,
  FAQ,
  HomePageContent,
  LegalPage,
  LegalPageType,
  Media,
  NavItem,
  Role,
  SEOSettings,
  Service,
  ServiceCategory,
  SocialLink,
  Stat,
  Testimonial,
  WebsiteSettings,
} from "@/lib/demo-types";
import { demoLegalContent } from "@/data/legal";
import { demoServiceSeed } from "@/data/services";

// ---------------------------------------------------------------------------
// Demo content. Edit the arrays and objects in this file to change the site.
// No database, CMS persistence or external API is connected.
// ---------------------------------------------------------------------------

export const DEMO_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://arthaledger.blackvavecorporation.workers.dev";

const now = new Date();
function daysAgo(days: number, hour = 10) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, 30, 0, 0);
  return date;
}
function daysFromNow(days: number, hour = 11) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

const stamp = daysAgo(30);

export const demoRoles: Role[] = [
  {
    id: "role-super-admin",
    name: "SUPER_ADMIN",
    description: "Demo owner with access to every admin screen.",
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "role-admin",
    name: "ADMIN",
    description: "Demo operations role.",
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "role-editor",
    name: "EDITOR",
    description: "Demo content role.",
    createdAt: stamp,
    updatedAt: stamp,
  },
];

export const DEMO_EMAIL = "demo@arthaledger.example";
export const DEMO_PASSWORD = "ArthaLedgerDemo2026!";

export const demoAdminUser: AdminUser = {
  id: "demo-admin",
  name: "Demo Administrator",
  email: DEMO_EMAIL,
  passwordHash: "demo-only-no-password-hash",
  roleId: "role-super-admin",
  role: demoRoles[0],
  isActive: true,
  lastLoginAt: daysAgo(0, 9),
  createdAt: stamp,
  updatedAt: stamp,
};

export const demoWebsiteSettings: WebsiteSettings = {
  id: "main",
  brandName: "ArthaLedger",
  legalName: "ArthaLedger Demo Practice",
  tagline: "Your Business. Our Financial Expertise.",
  logoUrl: null,
  faviconUrl: null,
  primaryPhone: "+91 90000 00000",
  secondaryPhone: null,
  businessEmail: "hello@arthaledger.example",
  officeAddress: "Demo Office, Banjara Hills, Hyderabad, Telangana 500034, India",
  googleMapsEmbedUrl:
    "https://www.google.com/maps?q=Banjara+Hills,Hyderabad,Telangana,India&output=embed",
  workingHours: "Monday – Saturday, 10:00 AM – 6:30 PM IST",
  footerAbout:
    "ArthaLedger is a demonstration chartered accountancy website showing how a modern professional practice can present its services. All content and data on this deployment are illustrative.",
  footerCopyright: `© ${now.getFullYear()} ArthaLedger demo. Sample content only.`,
  whatsappEnabled: true,
  whatsappNumber: "919000000000",
  whatsappMessage:
    "Hello ArthaLedger demo, I would like to discuss a professional service.",
  whatsappWelcomeMessage:
    "This is a demo WhatsApp link. In a live deployment, visitors would chat with the firm here. Never share passwords, OTPs or bank credentials.",
  chatbotEnabled: true,
  chatbotMode: "FAQ",
  chatbotWelcomeEn:
    "Hello! This is a demo assistant. I can explain the sample services or point you to the demo enquiry forms.",
  chatbotWelcomeTe:
    "నమస్కారం! ఇది డెమో సహాయకుడు. మా నమూనా సేవల గురించి వివరించగలను లేదా డెమో విచారణ ఫారాలకు మార్గనిర్దేశం చేయగలను.",
  chatbotSystemPrompt: null,
  chatbotModel: "demo-rule-based",
  createdAt: stamp,
  updatedAt: daysAgo(2),
};

export const demoHomeContent: HomePageContent = {
  id: "main",
  heroEyebrow: "Chartered Accountancy & Business Advisory · Demo",
  heroTitle: "Financial clarity for",
  heroTitleAccent: "ambitious businesses.",
  heroDescription:
    "ArthaLedger brings accounting, tax and compliance discipline together with practical business advice — so you can make confident decisions with clean numbers behind you. This deployment uses sample content to demonstrate the website experience.",
  primaryCtaLabel: "Book a consultation",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Explore services",
  secondaryCtaHref: "/services",
  heroTrustLine:
    "Demonstration website. Forms show a confirmation only — nothing is stored, emailed or sent to a database.",
  heroCardTitle: "Your compliance calendar",
  heroCardSubtitle: "A clear view of what needs attention.",
  servicesEyebrow: "What we do",
  servicesTitle: "Professional services, built around your business",
  servicesDescription:
    "From day-to-day bookkeeping to statutory compliance and advisory, every engagement begins with understanding your business. The service catalogue below is sample demo content.",
  whyEyebrow: "Why ArthaLedger",
  whyTitle: "A steadier financial foundation",
  whyDescription:
    "You get a responsive team, documented processes and advice that stays grounded in your commercial reality.",
  expertiseEyebrow: "Our expertise",
  expertiseTitle: "Depth where it matters",
  expertiseDescription:
    "Practical capability across tax, compliance, accounting and business advisory.",
  testimonialsEyebrow: "Illustrative feedback",
  testimonialsTitle: "How a client relationship could feel",
  testimonialsDescription:
    "These are sample testimonials for demonstration only. They are not real client reviews and no genuine person or company is represented.",
  faqEyebrow: "Questions, answered",
  faqTitle: "Before you engage with us",
  faqDescription:
    "Clear answers to common questions. For advice on your specific facts, please speak with a qualified professional.",
  ctaEyebrow: "Start a conversation",
  ctaTitle: "Let us bring clarity to your finances.",
  ctaDescription:
    "Tell us what you are working on. In this demo, the form confirms the interaction without storing or delivering your details.",
  ctaButtonLabel: "Book a consultation",
  ctaButtonHref: "/contact",
  createdAt: stamp,
  updatedAt: daysAgo(3),
};

export const demoAboutContent: AboutPageContent = {
  id: "main",
  eyebrow: "About ArthaLedger",
  title: "A financial partner that understands business",
  introduction:
    "ArthaLedger is a demonstration website for a chartered accountancy practice built to support founders and businesses with reliable numbers, timely compliance and sound commercial judgement.",
  story:
    "This demo began with a simple belief: financial services should be clear, responsive and connected to the decisions a business actually needs to make. The content here illustrates how a practice could describe its work. It is not a real firm history or an offer of services.",
  vision:
    "To show how a modern professional practice can communicate clearly, responsibly and without inflated claims.",
  mission:
    "To demonstrate precise, timely and practical financial communication that helps clients understand compliance and plan with confidence.",
  imageUrl: null,
  valuesTitle: "The principles behind our work",
  teamTitle: "The people behind the practice",
  teamDescription:
    "This demo does not represent real team members or professional qualifications. Add genuine profiles only in a live deployment.",
  whyTitle: "Why clients choose us",
  whyDescription:
    "We combine technical rigour with the responsiveness of a team that knows your business.",
  createdAt: stamp,
  updatedAt: daysAgo(4),
};

export const demoNavItems: NavItem[] = [
  ["Home", "/", "HEADER", 1],
  ["About", "/about", "HEADER", 2],
  ["Services", "/services", "HEADER", 3],
  ["Testimonials", "/testimonials", "HEADER", 4],
  ["Contact", "/contact", "HEADER", 5],
  ["Home", "/", "FOOTER", 1],
  ["About us", "/about", "FOOTER", 2],
  ["Services", "/services", "FOOTER", 3],
  ["Contact", "/contact", "FOOTER", 4],
  ["Terms & Conditions", "/legal/terms-conditions", "FOOTER", 10],
  ["Privacy Policy", "/legal/privacy-policy", "FOOTER", 11],
  ["Disclaimer", "/legal/disclaimer", "FOOTER", 12],
  ["Cookie Policy", "/legal/cookie-policy", "FOOTER", 13],
].map(([label, href, location, order], index) => ({
  id: `nav-${index + 1}`,
  label: String(label),
  href: String(href),
  location: location as NavItem["location"],
  order: Number(order),
  isVisible: true,
  isExternal: false,
  createdAt: stamp,
  updatedAt: stamp,
}));

export const demoSocialLinks: SocialLink[] = [
  {
    id: "social-linkedin",
    platform: "LinkedIn",
    url: "https://www.linkedin.com/",
    order: 1,
    isVisible: true,
    createdAt: stamp,
    updatedAt: stamp,
  },
];

export const demoStats: Stat[] = [
  { id: "stat-1", value: "16", label: "Sample service lines", description: null, order: 1, isVisible: true, createdAt: stamp, updatedAt: stamp },
  { id: "stat-2", value: "6", label: "Practice areas", description: null, order: 2, isVisible: true, createdAt: stamp, updatedAt: stamp },
  { id: "stat-3", value: "EN / TE", label: "Bilingual support", description: null, order: 3, isVisible: true, createdAt: stamp, updatedAt: stamp },
  { id: "stat-4", value: "100%", label: "Demo content", description: null, order: 4, isVisible: true, createdAt: stamp, updatedAt: stamp },
];

export const demoWhyChooseItems: ContentItem[] = [
  ["Partner-led attention", "Your engagement is reviewed by an experienced professional who understands the commercial context, not just the filing.", "UserCheck"],
  ["Clear, timely communication", "We agree response expectations, flag issues early and explain positions in language you can act on.", "MessagesSquare"],
  ["Deadline discipline", "A documented compliance calendar and structured close process keep statutory obligations visible.", "CalendarCheck"],
  ["Confidential by design", "Need-to-know access, secure channels and careful handling of sensitive financial information.", "Lock"],
  ["Practical, not theoretical", "Advice grounded in your cash flows, capacity and growth plans — with implementation support.", "Lightbulb"],
  ["Scope you can see", "Engagement letters set out responsibilities, deliverables and fees so there are no surprises.", "FileCheck2"],
].map(([title, description, icon], index) => ({
  id: `why-${index + 1}`,
  title,
  description,
  icon,
  order: index + 1,
  isVisible: true,
  createdAt: stamp,
  updatedAt: stamp,
}));

export const demoExpertiseItems: ContentItem[] = [
  ["Direct taxation", "Returns, TDS, assessments and planning support for businesses and professionals.", "FileText"],
  ["Indirect tax & GST", "Registration, returns, reconciliation and compliance process design.", "ReceiptText"],
  ["Corporate compliance", "ROC filings, statutory registers and board governance support.", "Building2"],
  ["Accounting systems", "Reliable books, monthly closes and management reporting.", "BookOpen"],
  ["Business structuring", "Entity selection, incorporation and post-setup compliance planning.", "Network"],
  ["Financial advisory", "Models, cash-flow visibility and finance function support.", "LineChart"],
].map(([title, description, icon], index) => ({
  id: `expertise-${index + 1}`,
  title,
  description,
  icon,
  order: index + 1,
  isVisible: true,
  createdAt: stamp,
  updatedAt: stamp,
}));

export const demoValueItems: ContentItem[] = [
  ["Integrity", "We say what we can do, disclose limits and stand behind our work.", "ShieldCheck"],
  ["Clarity", "Plain explanations, documented positions and no unnecessary complexity.", "Eye"],
  ["Responsiveness", "Agreed response windows and proactive updates on active matters.", "Zap"],
  ["Confidentiality", "Client information is handled with care and restricted access.", "Lock"],
].map(([title, description, icon], index) => ({
  id: `value-${index + 1}`,
  title,
  description,
  icon,
  order: index + 1,
  isVisible: true,
  createdAt: stamp,
  updatedAt: stamp,
}));

export const demoCategories: ServiceCategory[] = [
  ["Taxation", "taxation", "Direct tax, TDS and planning support.", 1],
  ["GST", "gst", "GST registration, returns and reconciliation.", 2],
  ["Accounting", "accounting", "Books, payroll and management reporting.", 3],
  ["Business Setup", "business-setup", "Incorporation and registration support.", 4],
  ["Compliance & Audit", "compliance-audit", "ROC compliance and assurance support.", 5],
  ["Advisory", "advisory", "Financial consulting and business advisory.", 6],
].map(([name, slug, description, order]) => ({
  id: `category-${slug}`,
  name: String(name),
  slug: String(slug),
  description: String(description),
  order: Number(order),
  isVisible: true,
  createdAt: stamp,
  updatedAt: stamp,
}));

export const demoServices: Service[] = demoServiceSeed.map((service, index) => {
  const category = demoCategories.find((item) => item.slug === service.category) ?? null;
  return {
    id: `service-${service.slug}`,
    title: service.title,
    slug: service.slug,
    categoryId: category?.id ?? null,
    category,
    shortDescription: service.shortDescription,
    description: service.description,
    icon: service.icon,
    imageUrl: null,
    benefits: [...service.benefits],
    ctaLabel: "Enquire about this service",
    isFeatured: "featured" in service ? Boolean(service.featured) : false,
    status: "PUBLISHED",
    order: index + 1,
    seoTitle: `${service.title} | ArthaLedger`,
    seoDescription: service.shortDescription,
    createdAt: stamp,
    updatedAt: daysAgo(10 - Math.min(index, 9)),
  };
});

export const demoTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    clientName: "Demo Client 01",
    designation: "Founder",
    company: "Sample Manufacturing Co.",
    review:
      "The sample monthly close and compliance calendar made the work feel organised and predictable. This is illustrative demo copy, not a real client review.",
    rating: 5,
    imageUrl: null,
    isApproved: true,
    isPublished: true,
    order: 1,
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "testimonial-2",
    clientName: "Demo Client 02",
    designation: "Director",
    company: "Sample Services LLP",
    review:
      "Clear explanations, sensible questions and a written scope before work began. This is illustrative demo copy, not a real client review.",
    rating: 5,
    imageUrl: null,
    isApproved: true,
    isPublished: true,
    order: 2,
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "testimonial-3",
    clientName: "Demo Client 03",
    designation: "Co-founder",
    company: "Sample Retail Ventures",
    review:
      "A calm, structured approach to registrations and recurring compliance. This is illustrative demo copy, not a real client review.",
    rating: 5,
    imageUrl: null,
    isApproved: true,
    isPublished: true,
    order: 3,
    createdAt: stamp,
    updatedAt: stamp,
  },
];

export const demoFaqs: FAQ[] = [
  {
    id: "faq-1",
    question: "What services does ArthaLedger provide?",
    answer:
      "This demo presents sample service descriptions covering income tax, GST, accounting, payroll, company and LLP registration, ROC compliance, audit support, TDS, project reports and financial advisory. In a live deployment, scope would be confirmed in writing before work begins.",
    questionTe: "ArthaLedger ఏ సేవలు అందిస్తుంది?",
    answerTe:
      "ఈ డెమోలో ఆదాయపు పన్ను, GST, అకౌంటింగ్, పేరోల్, కంపెనీ మరియు LLP నమోదు, ROC కంప్లయన్స్, TDS మరియు ఆర్థిక సలహా సేవల నమూనా వివరణలు ఉన్నాయి.",
    category: null,
    order: 1,
    isPublished: true,
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "faq-2",
    question: "How do I book a consultation?",
    answer:
      "Use the contact form, call the sample office number, or use the WhatsApp link. This demo confirms the request but does not store or deliver it. A real deployment would confirm an available slot and explain what to prepare.",
    questionTe: "సంప్రదింపు సమయాన్ని ఎలా బుక్ చేయాలి?",
    answerTe:
      "సంపర్క ఫారం, ఫోన్ లేదా WhatsApp ద్వారా సంప్రదించండి. ఈ డెమో అభ్యర్థనను నిల్వ చేయదు లేదా పంపదు.",
    category: null,
    order: 2,
    isPublished: true,
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "faq-3",
    question: "Is this a real chartered accountancy firm?",
    answer:
      "No. This is a demonstration website. The firm name, contact details, testimonials and service descriptions are sample content used to show the website design and admin experience.",
    questionTe: null,
    answerTe: null,
    category: "Demo",
    order: 3,
    isPublished: true,
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "faq-4",
    question: "What happens when I submit a form?",
    answer:
      "You will see a demo confirmation. No personal data is saved, emailed or delivered to anyone, and there is no database connected to this deployment.",
    questionTe: null,
    answerTe: null,
    category: "Demo",
    order: 4,
    isPublished: true,
    createdAt: stamp,
    updatedAt: stamp,
  },
  {
    id: "faq-5",
    question: "Do you provide legal or investment advice?",
    answer:
      "No. This demo does not provide professional advice of any kind. A live site should clearly limit its content and direct visitors to appropriately qualified professionals.",
    questionTe: null,
    answerTe: null,
    category: null,
    order: 5,
    isPublished: true,
    createdAt: stamp,
    updatedAt: stamp,
  },
];

const legalEntries = Object.entries(demoLegalContent) as [
  LegalPageType,
  (typeof demoLegalContent)[LegalPageType],
][];

export const demoLegalPages: LegalPage[] = legalEntries.map(([type, page]) => ({
  id: page.id,
  type,
  slug: page.slug,
  title: page.title,
  content: page.content,
  status: "PUBLISHED",
  seoTitle: `${page.title} | ArthaLedger demo`,
  seoDescription: `Sample ${page.title.toLowerCase()} for the ArthaLedger demonstration website.`,
  createdAt: stamp,
  updatedAt: daysAgo(20),
}));

export const demoSeoSettings: SEOSettings = {
  id: "main",
  siteTitle: "ArthaLedger | Chartered Accountancy Demo",
  titleTemplate: "%s | ArthaLedger Demo",
  description:
    "A database-free demonstration website for a chartered accountancy and business advisory practice. Sample content only.",
  keywords: [
    "chartered accountant demo",
    "accounting website demo",
    "GST services sample",
    "business advisory demo",
  ],
  ogImageUrl: null,
  canonicalBase: DEMO_SITE_URL,
  twitterHandle: null,
  gaMeasurementId: null,
  createdAt: stamp,
  updatedAt: daysAgo(2),
};

const sampleService = (slug: string) => demoServices.find((service) => service.slug === slug) ?? null;

const conversationOneId = "conversation-demo-1";
const conversationTwoId = "conversation-demo-2";

export const demoChatMessages: ChatMessage[] = [
  {
    id: "message-1",
    conversationId: conversationOneId,
    sender: "VISITOR",
    content: "I am starting a private limited company. What should I plan for?",
    createdAt: daysAgo(2, 10),
  },
  {
    id: "message-2",
    conversationId: conversationOneId,
    sender: "ASSISTANT",
    content:
      "Company registration and ongoing ROC compliance may be relevant. I can share the sample service pages, or you can submit a demo enquiry.",
    createdAt: daysAgo(2, 10),
  },
  {
    id: "message-3",
    conversationId: conversationOneId,
    sender: "SYSTEM",
    content: "Demo visitor shared contact details and requested a consultation.",
    createdAt: daysAgo(2, 11),
  },
  {
    id: "message-4",
    conversationId: conversationTwoId,
    sender: "VISITOR",
    content: "Can you help with monthly GST returns?",
    createdAt: daysAgo(1, 15),
  },
  {
    id: "message-5",
    conversationId: conversationTwoId,
    sender: "ASSISTANT",
    content:
      "GST returns and compliance is one of the sample services. The full demo description is available on the services page.",
    createdAt: daysAgo(1, 15),
  },
];

export const demoEnquiries: ContactEnquiry[] = [
  {
    id: "enquiry-demo-1",
    name: "Sample Enquiry — Meera",
    email: "meera@example.com",
    phone: "+91 90000 10001",
    serviceId: sampleService("company-registration")?.id ?? null,
    service: sampleService("company-registration"),
    serviceName: "Company Registration",
    message:
      "This is a sample demo enquiry about incorporating a private limited company. No real person submitted this message.",
    source: "CONTACT_FORM",
    status: "NEW",
    adminNote: null,
    ipAddress: "203.0.113.10",
    userAgent: "Demo browser",
    conversationId: null,
    conversation: null,
    createdAt: daysAgo(1, 12),
    updatedAt: daysAgo(1, 12),
  },
  {
    id: "enquiry-demo-2",
    name: "Sample Enquiry — Arjun",
    email: "arjun@example.com",
    phone: "+91 90000 10002",
    serviceId: sampleService("gst-returns-compliance")?.id ?? null,
    service: sampleService("gst-returns-compliance"),
    serviceName: "GST Returns & Compliance",
    message:
      "A sample question about monthly GST return support. This record exists only to demonstrate the admin enquiry screen.",
    source: "CHATBOT",
    status: "IN_PROGRESS",
    adminNote: "Sample internal note: demo follow-up only.",
    ipAddress: "203.0.113.11",
    userAgent: "Demo browser",
    conversationId: conversationTwoId,
    conversation: { id: conversationTwoId },
    createdAt: daysAgo(2, 16),
    updatedAt: daysAgo(1, 9),
  },
  {
    id: "enquiry-demo-3",
    name: "Sample Enquiry — Kavya",
    email: "kavya@example.com",
    phone: "+91 90000 10003",
    serviceId: sampleService("income-tax-returns")?.id ?? null,
    service: sampleService("income-tax-returns"),
    serviceName: "Income Tax Returns",
    message:
      "A sample enquiry about individual tax return preparation. This is demonstration content, not a client record.",
    source: "CONTACT_FORM",
    status: "RESOLVED",
    adminNote: "Sample resolved status for the demo.",
    ipAddress: "203.0.113.12",
    userAgent: "Demo browser",
    conversationId: null,
    conversation: null,
    createdAt: daysAgo(5, 11),
    updatedAt: daysAgo(4, 10),
  },
];

export const demoAppointments: AppointmentRequest[] = [
  {
    id: "appointment-demo-1",
    name: "Sample Appointment — Rohan",
    email: "rohan@example.com",
    phone: "+91 90000 20001",
    serviceId: sampleService("business-advisory")?.id ?? null,
    service: sampleService("business-advisory"),
    serviceName: "Business Advisory",
    preferredDate: daysFromNow(3),
    preferredTime: "11:00 AM",
    mode: "VIDEO",
    notes: "Sample demo appointment request. No real meeting is scheduled.",
    status: "PENDING",
    adminNote: null,
    createdAt: daysAgo(1, 9),
    updatedAt: daysAgo(1, 9),
  },
  {
    id: "appointment-demo-2",
    name: "Sample Appointment — Nisha",
    email: "nisha@example.com",
    phone: "+91 90000 20002",
    serviceId: sampleService("tax-planning")?.id ?? null,
    service: sampleService("tax-planning"),
    serviceName: "Tax Planning",
    preferredDate: daysFromNow(7),
    preferredTime: "3:30 PM",
    mode: "PHONE",
    notes: "Sample demo appointment request for the admin detail screen.",
    status: "CONFIRMED",
    adminNote: "Demo confirmed status.",
    createdAt: daysAgo(3, 14),
    updatedAt: daysAgo(2, 10),
  },
];

export const demoConversations: ChatConversation[] = [
  {
    id: conversationOneId,
    sessionId: "demo-session-company-registration",
    language: "en",
    mode: "FAQ",
    visitorName: "Sample Visitor — Meera",
    visitorEmail: "meera@example.com",
    visitorPhone: "+91 90000 10001",
    serviceInterest: "Company Registration",
    isLead: true,
    isEscalated: false,
    summary: "Demo conversation about company incorporation.",
    messages: demoChatMessages.filter((message) => message.conversationId === conversationOneId),
    enquiries: demoEnquiries.filter((enquiry) => enquiry.conversationId === conversationOneId),
    _count: { messages: 3, enquiries: 0 },
    createdAt: daysAgo(2, 10),
    updatedAt: daysAgo(2, 11),
  },
  {
    id: conversationTwoId,
    sessionId: "demo-session-gst",
    language: "en",
    mode: "FAQ",
    visitorName: null,
    visitorEmail: null,
    visitorPhone: null,
    serviceInterest: "GST Returns & Compliance",
    isLead: true,
    isEscalated: false,
    summary: "Demo conversation about monthly GST compliance.",
    messages: demoChatMessages.filter((message) => message.conversationId === conversationTwoId),
    enquiries: demoEnquiries.filter((enquiry) => enquiry.conversationId === conversationTwoId),
    _count: { messages: 2, enquiries: 1 },
    createdAt: daysAgo(1, 15),
    updatedAt: daysAgo(1, 16),
  },
];

export const demoAuditLogs: AuditLog[] = [
  {
    id: "audit-1",
    userId: demoAdminUser.id,
    user: { name: demoAdminUser.name, email: demoAdminUser.email },
    action: "auth.login",
    entity: "AdminUser",
    entityId: demoAdminUser.id,
    details: { mode: "demo" },
    ipAddress: "203.0.113.5",
    createdAt: daysAgo(0, 9),
  },
  {
    id: "audit-2",
    userId: demoAdminUser.id,
    user: { name: demoAdminUser.name, email: demoAdminUser.email },
    action: "content.home.updated",
    entity: "HomePageContent",
    entityId: "main",
    details: { note: "Demo session change; nothing was persisted." },
    ipAddress: "203.0.113.5",
    createdAt: daysAgo(1, 16),
  },
  {
    id: "audit-3",
    userId: demoAdminUser.id,
    user: { name: demoAdminUser.name, email: demoAdminUser.email },
    action: "enquiry.updated",
    entity: "ContactEnquiry",
    entityId: "enquiry-demo-2",
    details: { status: "IN_PROGRESS" },
    ipAddress: "203.0.113.5",
    createdAt: daysAgo(2, 10),
  },
];

export const demoMedia: Media[] = [];
