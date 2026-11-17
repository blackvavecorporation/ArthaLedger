import { db } from "@/lib/db";
import { getPublishedFAQs, getServices, getSettings } from "@/lib/content";
import { whatsAppLink } from "@/lib/whatsapp";

export type ChatLanguage = "en" | "te";

export type ChatLink = { label: string; href: string };

export type ChatReply = {
  reply: string;
  mode: "AI" | "FAQ" | "HUMAN";
  links: ChatLink[];
  quickReplies: string[];
};

type KnowledgeService = {
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
};

type KnowledgeFaq = {
  question: string;
  answer: string;
  questionTe: string | null;
  answerTe: string | null;
};

export type ChatbotKnowledge = {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsapp: string;
  whatsappLink: string;
  services: KnowledgeService[];
  faqs: KnowledgeFaq[];
  faqMode: boolean;
  model: string;
  extraInstructions: string | null;
};

export async function getChatbotKnowledge(): Promise<ChatbotKnowledge> {
  const [settings, services, faqs] = await Promise.all([
    getSettings(),
    getServices(),
    getPublishedFAQs(),
  ]);
  return {
    brandName: settings.brandName,
    tagline: settings.tagline,
    phone: settings.primaryPhone,
    email: settings.businessEmail,
    address: settings.officeAddress,
    hours: settings.workingHours,
    whatsapp: settings.whatsappNumber,
    whatsappLink: whatsAppLink(settings.whatsappNumber, settings.whatsappMessage),
    services: services.map((service) => ({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      icon: service.icon,
    })),
    faqs: faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      questionTe: faq.questionTe,
      answerTe: faq.answerTe,
    })),
    faqMode: settings.chatbotMode === "FAQ",
    model: settings.chatbotModel,
    extraInstructions: settings.chatbotSystemPrompt,
  };
}

export function buildSystemPrompt(knowledge: ChatbotKnowledge, language: ChatLanguage) {
  const serviceLines = knowledge.services
    .map((service) => `- ${service.title} (/services/${service.slug}): ${service.shortDescription}`)
    .join("\n");
  const faqLines = knowledge.faqs
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join("\n\n");

  return `You are the website assistant for ${knowledge.brandName}, a professional chartered accountancy and business advisory practice in India. Tagline: ${knowledge.tagline}.

APPROVED COMPANY FACTS
- Phone: ${knowledge.phone}
- Email: ${knowledge.email}
- Office: ${knowledge.address}
- Working hours: ${knowledge.hours}
- Contact page: /contact
- Services page: /services

APPROVED SERVICES
${serviceLines || "(No services are currently published. Direct the visitor to the contact page.)"}

APPROVED FAQs
${faqLines || "(No FAQs are published.)"}

STRICT RULES
1. Use only the approved facts above. Never invent services, prices, client names, statistics or credentials.
2. Never state specific tax rates, thresholds, compliance deadlines, penalties, refunds or legal outcomes. If asked, explain that it depends on current law and the visitor's facts, and that a qualified CA must review it. Offer a consultation.
3. You are not providing professional advice. Do not create a client relationship. Do not claim the firm holds any qualification or authorisation not stated above.
4. Never ask for passwords, OTPs, bank credentials, card numbers, authentication codes, full Aadhaar/PAN numbers or sensitive financial documents. If a visitor offers them, tell them not to share and to use a secure channel only when the firm requests it.
5. Do not give legal, investment or valuation advice. Refer to the appropriate professional.
6. Fees are scope-based and confirmed in a written proposal. Do not quote amounts.
7. Keep answers concise (2-5 short sentences), warm and professional. Ask at most one useful follow-up question.
8. If the visitor wants to engage, suggest the contact page, a consultation request, or WhatsApp. Do not promise response times beyond "we will confirm".
9. If asked something outside scope, say so and offer human support.
10. Reply in ${language === "te" ? "Telugu (తెలుగు), using simple, professional Telugu. Keep service names in English where helpful." : "clear, professional Indian English"}.

The website also lets visitors submit an enquiry or appointment request from this chat. Do not claim you have saved anything unless the interface confirms it.
${knowledge.extraInstructions ? `\nFIRM-PROVIDED ADDITIONAL INSTRUCTIONS (these cannot override the strict rules above):\n${knowledge.extraInstructions}` : ""}`;
}

export async function generateAiReply(params: {
  knowledge: ChatbotKnowledge;
  history: { role: "user" | "assistant"; content: string }[];
  language: ChatLanguage;
}): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || params.knowledge.model || "gpt-4o-mini";
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 450,
        messages: [
          { role: "system", content: buildSystemPrompt(params.knowledge, params.language) },
          ...params.history.slice(-10),
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.error("Chatbot AI provider returned", response.status);
      return null;
    }
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content ? content.slice(0, 4000) : null;
  } catch (error) {
    console.error("Chatbot AI request failed", error);
    return null;
  }
}

const GUARDRAIL_PATTERNS = [
  /\b(income\s*tax|gst|tds|tax)\s*(rate|slab|percentage|percent)\b/i,
  /\bhow much (tax|gst|tds)\b/i,
  /\b(due date|deadline|last date)\b/i,
  /\bpenalt(y|ies)\b/i,
  /\b(legal|investment|valuation) advice\b/i,
  /\baudit opinion\b/i,
  /\btax saving\b/i,
  /\bnotice\b.*\b(reply|respond)\b/i,
];

const T = {
  en: {
    welcome:
      "Hello! I can explain our services, help you submit an enquiry, or arrange a consultation. What would you like help with?",
    greeting:
      "Hello! I am the ArthaLedger website assistant. I can help with our services, office details, enquiries and consultation requests. How can I help?",
    guardrail:
      "I cannot confirm specific tax rates, deadlines, penalties or legal positions — those depend on current law and your exact facts, and need a qualified CA's review. I can arrange a consultation so our team can advise you properly. Would you like to request one?",
    fees:
      "Our fees depend on the scope, complexity and turnaround of the work. We share a written proposal before any engagement begins, and statutory fees are charged at actuals. If you tell me what you need, I can help you send an enquiry for a scoped quote.",
    contact:
      `You can reach us at ${knowledgePlaceholder("phone")} or ${knowledgePlaceholder("email")}. Our office is at ${knowledgePlaceholder("address")}. Working hours: ${knowledgePlaceholder("hours")}.`,
    appointment:
      "I can help you request a consultation. Use the “Request consultation” option in this chat to share your name, phone, email and preferred date, or use the contact page. Our team will confirm availability.",
    human:
      "Of course. You can speak with our team on WhatsApp or send a detailed message through the contact form. Please do not share passwords, OTPs or bank credentials in chat.",
    about:
      "ArthaLedger is a professional chartered accountancy and business advisory practice. We support businesses with accounting, tax, GST, registrations, compliance and advisory services. You can read more on the About page.",
    recommend: "Based on what you shared, these services may be relevant:",
    services: "Here are the services the firm currently publishes:",
    fallback:
      "I can help with information about our services, office and hours, or take an enquiry or consultation request. Could you rephrase your question, or choose one of the options below?",
    noService:
      "I could not match that to a published service. You can browse all services, or tell me a little more and I can suggest a relevant one.",
    thanks: "You're welcome. Is there anything else I can help you with?",
    sensitive:
      "Please do not share passwords, OTPs, bank credentials or identity numbers here. If our team needs documents, we will tell you how to share them through a secure channel.",
  },
  te: {
    welcome:
      "నమస్కారం! మా సేవల గురించి వివరించడానికి, విచారణ నమోదు చేయడానికి లేదా సంప్రదింపు సమయం ఏర్పాటు చేయడానికి నేను సహాయం చేయగలను. మీకు ఏ విషయంలో సహాయం కావాలి?",
    greeting:
      "నమస్కారం! నేను ArthaLedger వెబ్‌సైట్ సహాయకుడిని. మా సేవలు, కార్యాలయ వివరాలు, విచారణలు మరియు సంప్రదింపు అభ్యర్థనలలో సహాయం చేయగలను. ఎలా సహాయపడగలను?",
    guardrail:
      "నిర్దిష్ట పన్ను రేట్లు, గడువులు, జరిమానాలు లేదా చట్టపరమైన అంశాలను నేను నిర్ధారించలేను — అవి ప్రస్తుత చట్టం మరియు మీ పరిస్థితులపై ఆధారపడి ఉంటాయి, అర్హత కలిగిన CA సమీక్ష అవసరం. సరైన సలహా కోసం సంప్రదింపు సమయాన్ని ఏర్పాటు చేయగలను. మీరు అభ్యర్థించాలనుకుంటున్నారా?",
    fees:
      "మా ఫీజులు పని పరిధి, సంక్లిష్టత మరియు సమయంపై ఆధారపడి ఉంటాయి. పని ప్రారంభానికి ముందు లిఖిత ప్రతిపాదన అందిస్తాము. మీ అవసరాన్ని తెలియజేస్తే, అంచనా కోసం విచారణ పంపడంలో సహాయం చేస్తాను.",
    contact:
      "మమ్మల్ని ఫోన్ లేదా ఇమెయిల్ ద్వారా సంప్రదించవచ్చు. మా కార్యాలయ చిరునామా, పని వేళలు సంపర్క పేజీలో ఉన్నాయి.",
    appointment:
      "సంప్రదింపు కోసం ఈ చాట్‌లో “Request consultation” ఎంపికను ఉపయోగించి మీ పేరు, ఫోన్, ఇమెయిల్ మరియు సౌకర్యవంతమైన తేదీని తెలియజేయండి. మా బృందం అందుబాటును నిర్ధారిస్తుంది.",
    human:
      "తప్పకుండా. WhatsApp ద్వారా మా బృందంతో మాట్లాడవచ్చు లేదా సంపర్క ఫారం ద్వారా వివరాలు పంపవచ్చు. చాట్‌లో పాస్‌వర్డ్‌లు, OTPలు లేదా బ్యాంక్ వివరాలు పంచుకోవద్దు.",
    about:
      "ArthaLedger ఒక వృత్తిపరమైన చార్టర్డ్ అకౌంటెన్సీ మరియు వ్యాపార సలహా సంస్థ. అకౌంటింగ్, పన్ను, GST, నమోదు, కంప్లయన్స్ మరియు సలహా సేవలు అందిస్తాము. మరిన్ని వివరాలకు About పేజీ చూడండి.",
    recommend: "మీరు తెలిపిన దాని ఆధారంగా ఈ సేవలు సరిపోతాయి:",
    services: "ప్రస్తుతం అందుబాటులో ఉన్న సేవలు:",
    fallback:
      "మా సేవలు, కార్యాలయం మరియు సమయాల గురించి సహాయం చేయగలను, లేదా విచారణ/సంప్రదింపు అభ్యర్థనను స్వీకరించగలను. దయచేసి ప్రశ్నను మరో విధంగా అడగండి లేదా క్రింది ఎంపికను ఎంచుకోండి.",
    noService:
      "ఆ ప్రశ్నకు సరిపోయే సేవ కనుగొనలేకపోయాను. అన్ని సేవలను చూడండి, లేదా కొంచెం వివరంగా చెప్పండి.",
    thanks: "సంతోషం. మరేదైనా సహాయం కావాలా?",
    sensitive:
      "దయచేసి ఇక్కడ పాస్‌వర్డ్‌లు, OTPలు, బ్యాంక్ వివరాలు లేదా గుర్తింపు నంబర్లు పంచుకోవద్దు. పత్రాలు అవసరమైతే సురక్షిత మార్గం ద్వారా పంపమని మా బృందం తెలియజేస్తుంది.",
  },
} as const;

function knowledgePlaceholder(key: "phone" | "email" | "address" | "hours") {
  return `{{${key}}}`;
}

export function quickReplies(language: ChatLanguage) {
  return language === "te"
    ? ["మా సేవలు", "సంప్రదింపు కోసం", "ఫీజులు", "మానవ సహాయం"]
    : ["Our services", "Book a consultation", "Fees", "Talk to a human"];
}

const SENSITIVE_PATTERN = /(password|passwd|otp|one[- ]time password|cvv|pin number|net ?banking|bank credential)/i;

export function requiresDeterministicAnswer(message: string) {
  return SENSITIVE_PATTERN.test(message) || GUARDRAIL_PATTERNS.some((pattern) => pattern.test(message));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "what", "how", "can", "does", "are", "is", "a", "an", "to", "of", "in", "on", "do", "i", "we", "my", "me", "please", "about", "tell", "need", "want", "help",
  // Generic words in service titles must not count as a match on their own.
  "service", "services", "offer", "provide",
]);

function tokens(value: string) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function matchesService(message: string, services: KnowledgeService[]) {
  const normalized = normalize(message);
  const scores = services.map((service) => {
    const title = normalize(service.title);
    let score = 0;
    if (normalized.includes(title)) score += 5;
    const titleTokens = tokens(service.title);
    for (const token of titleTokens) {
      if (normalized.includes(token)) score += 1;
    }
    if (normalized.includes(normalize(service.slug))) score += 4;
    return { service, score };
  });
  return scores.filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score);
}

const RECOMMENDATIONS: { pattern: RegExp; slugs: string[] }[] = [
  { pattern: /\b(salary|payroll|employee|payslip|pf|esi)\b/i, slugs: ["payroll-management"] },
  { pattern: /\b(startup|start up|new company|incorporate|incorporation|private limited|pvt)\b/i, slugs: ["company-registration", "roc-compliance"] },
  { pattern: /\b(partnership|llp|partners)\b/i, slugs: ["llp-registration"] },
  { pattern: /\b(gst|gstin|indirect tax)\b/i, slugs: ["gst-registration", "gst-returns-compliance"] },
  { pattern: /\b(income tax|itr|return|refund)\b/i, slugs: ["income-tax-returns"] },
  { pattern: /\b(tds|withholding)\b/i, slugs: ["tds-services"] },
  { pattern: /\b(bookkeeping|book keeping|accounts|accounting|books)\b/i, slugs: ["accounting-bookkeeping"] },
  { pattern: /\b(loan|funding|project report|bank finance)\b/i, slugs: ["project-reports", "financial-consulting"] },
  { pattern: /\b(audit|assurance|internal control)\b/i, slugs: ["auditing-assurance"] },
  { pattern: /\b(roc|annual filing|compliance|mca)\b/i, slugs: ["roc-compliance"] },
  { pattern: /\b(msme|udyam|small business|ssi)\b/i, slugs: ["msme-registration", "business-registration"] },
  { pattern: /\b(tax planning|save tax|saving tax|planning)\b/i, slugs: ["tax-planning"] },
  { pattern: /\b(advice|advisory|consult|growth|structure)\b/i, slugs: ["business-advisory", "financial-consulting"] },
  { pattern: /\b(register|registration|licence|license|proprietorship)\b/i, slugs: ["business-registration"] },
];

export function ruleBasedReply(params: {
  message: string;
  language: ChatLanguage;
  knowledge: ChatbotKnowledge;
}): ChatReply {
  const { message, language, knowledge } = params;
  const t = T[language];
  const normalized = normalize(message);
  const links: ChatLink[] = [];
  const addServiceLink = (service: KnowledgeService) =>
    links.push({ label: service.title, href: `/services/${service.slug}` });

  const say = (reply: string, mode: ChatReply["mode"] = "FAQ"): ChatReply => ({
    reply,
    mode,
    links,
    quickReplies: quickReplies(language),
  });

  if (SENSITIVE_PATTERN.test(message)) {
    return say(t.sensitive);
  }

  if (/^(hi|hello|hey|namaste|namaskaram|good morning|good evening)\b/i.test(normalized)) {
    return say(t.greeting);
  }

  if (/\b(human|agent|person|whatsapp|call me|speak to someone|support)\b/i.test(normalized)) {
    links.push({ label: "WhatsApp", href: knowledge.whatsappLink }, { label: "Contact form", href: "/contact" });
    return say(t.human, "HUMAN");
  }

  if (/\b(fee|fees|charge|charges|cost|price|pricing|quote)\b/i.test(normalized)) {
    return say(t.fees);
  }

  if (/\b(appointment|consultation|consult|book|meeting|schedule|slot)\b/i.test(normalized)) {
    return say(t.appointment);
  }

  if (/\b(contact|phone|number|email|address|office|location|hours|timing|open)\b/i.test(normalized)) {
    const reply = t.contact
      .replace("{{phone}}", knowledge.phone)
      .replace("{{email}}", knowledge.email)
      .replace("{{address}}", knowledge.address)
      .replace("{{hours}}", knowledge.hours);
    links.push({ label: "Contact page", href: "/contact" });
    return say(reply);
  }

  if (/\b(about|who are you|company|firm|history|vision|mission)\b/i.test(normalized)) {
    links.push({ label: "About ArthaLedger", href: "/about" });
    return say(t.about);
  }

  if (GUARDRAIL_PATTERNS.some((pattern) => pattern.test(message))) {
    return say(t.guardrail);
  }

  if (/\b(thank|thanks|great|ok)\b/i.test(normalized)) {
    return say(t.thanks);
  }

  // FAQ matching (English and Telugu questions).
  let bestFaq: { faq: KnowledgeFaq; score: number } | null = null;
  const messageTokens = new Set(tokens(message));
  for (const faq of knowledge.faqs) {
    const faqTokens = new Set([
      ...tokens(faq.question),
      ...(faq.questionTe ? tokens(faq.questionTe) : []),
    ]);
    let score = 0;
    for (const token of messageTokens) if (faqTokens.has(token)) score += 1;
    if (score > 0 && (!bestFaq || score > bestFaq.score)) bestFaq = { faq, score };
  }
  if (bestFaq && bestFaq.score >= 2) {
    const answer =
      language === "te" && bestFaq.faq.answerTe ? bestFaq.faq.answerTe : bestFaq.faq.answer;
    return say(answer);
  }

  const serviceMatches = matchesService(message, knowledge.services);
  if (serviceMatches.length > 0) {
    const top = serviceMatches.slice(0, 3).map((entry) => entry.service);
    top.forEach(addServiceLink);
    if (language === "te") {
      return say(`${t.recommend} ${top.map((service) => service.title).join(", ")}.`);
    }
    return say(
      `${t.recommend}\n\n${top
        .map((service) => `• ${service.title} — ${service.shortDescription}`)
        .join("\n")}\n\nI can help you send an enquiry for any of these.`,
    );
  }

  const recommendedSlugs = new Set<string>();
  for (const rule of RECOMMENDATIONS) {
    if (rule.pattern.test(message)) rule.slugs.forEach((slug) => recommendedSlugs.add(slug));
  }
  if (recommendedSlugs.size > 0) {
    const matched = knowledge.services.filter((service) => recommendedSlugs.has(service.slug)).slice(0, 3);
    if (matched.length > 0) {
      matched.forEach(addServiceLink);
      if (language === "te") {
        return say(`${t.recommend} ${matched.map((service) => service.title).join(", ")}.`);
      }
      return say(
        `${t.recommend}\n\n${matched
          .map((service) => `• ${service.title} — ${service.shortDescription}`)
          .join("\n")}\n\nWould you like to submit an enquiry or arrange a consultation?`,
      );
    }
  }

  if (/\b(service|services|offer|do you do|what do you)\b/i.test(normalized)) {
    knowledge.services.slice(0, 6).forEach(addServiceLink);
    links.push({ label: "All services", href: "/services" });
    return say(
      `${t.services}\n\n${knowledge.services
        .slice(0, 6)
        .map((service) => `• ${service.title}`)
        .join("\n")}\n\nYou can browse the full list or tell me what you need.`,
    );
  }

  if (knowledge.faqs.length > 0) {
    links.push({ label: "All services", href: "/services" }, { label: "Contact", href: "/contact" });
  }
  return say(t.noService);
}

export function handoffReply(knowledge: ChatbotKnowledge, language: ChatLanguage): ChatReply {
  const t = T[language];
  return {
    reply: t.human,
    mode: "HUMAN",
    links: [
      { label: "WhatsApp", href: knowledge.whatsappLink },
      { label: "Contact form", href: "/contact" },
    ],
    quickReplies: quickReplies(language),
  };
}

export async function getConversationHistory(conversationId: string) {
  const messages = await db.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 20,
  });
  return messages.map((message) => ({
    role: message.sender === "VISITOR" ? ("user" as const) : ("assistant" as const),
    content: message.content,
  }));
}
