// Local types for the database-free demo. These mirror the shapes used by the
// original CMS components, but no Prisma client or database is involved.

export type RoleName = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
export type ContentStatus = "DRAFT" | "PUBLISHED";
export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "SPAM";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ChatMode = "AI" | "FAQ" | "HUMAN";
export type ChatSender = "VISITOR" | "ASSISTANT" | "SYSTEM";
export type NavLocation = "HEADER" | "FOOTER";
export type LegalPageType = "TERMS" | "PRIVACY" | "DISCLAIMER" | "COOKIE";

export type ContactEnquiryWhereInput = Record<string, unknown>;
export type AppointmentRequestWhereInput = Record<string, unknown>;

export type Role = {
  id: string;
  name: RoleName;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roleId: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WebsiteSettings = {
  id: string;
  brandName: string;
  legalName: string;
  tagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryPhone: string;
  secondaryPhone: string | null;
  businessEmail: string;
  officeAddress: string;
  googleMapsEmbedUrl: string | null;
  workingHours: string;
  footerAbout: string | null;
  footerCopyright: string | null;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappWelcomeMessage: string;
  chatbotEnabled: boolean;
  chatbotMode: ChatMode;
  chatbotWelcomeEn: string;
  chatbotWelcomeTe: string;
  chatbotSystemPrompt: string | null;
  chatbotModel: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  location: NavLocation;
  order: number;
  isVisible: boolean;
  isExternal: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type HomePageContent = {
  id: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroTrustLine: string;
  heroCardTitle: string;
  heroCardSubtitle: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesDescription: string;
  whyEyebrow: string;
  whyTitle: string;
  whyDescription: string;
  expertiseEyebrow: string;
  expertiseTitle: string;
  expertiseDescription: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  faqEyebrow: string;
  faqTitle: string;
  faqDescription: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AboutPageContent = {
  id: string;
  eyebrow: string;
  title: string;
  introduction: string;
  story: string;
  vision: string;
  mission: string;
  imageUrl: string | null;
  valuesTitle: string;
  teamTitle: string;
  teamDescription: string;
  whyTitle: string;
  whyDescription: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  description: string | null;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type WhyChooseItem = ContentItem;
export type ExpertiseItem = ContentItem;
export type ValueItem = ContentItem;

export type TeamMember = {
  id: string;
  name: string;
  designation: string;
  qualifications: string | null;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  category: ServiceCategory | null;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrl: string | null;
  benefits: string[];
  ctaLabel: string;
  isFeatured: boolean;
  status: ContentStatus;
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Testimonial = {
  id: string;
  clientName: string;
  designation: string | null;
  company: string | null;
  review: string;
  rating: number;
  imageUrl: string | null;
  isApproved: boolean;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  questionTe: string | null;
  answerTe: string | null;
  category: string | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string | null;
  service?: Service | null;
  serviceName: string | null;
  message: string;
  source: string;
  status: EnquiryStatus;
  adminNote: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  conversationId: string | null;
  conversation?: { id: string } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string | null;
  service?: Service | null;
  serviceName: string | null;
  preferredDate: Date;
  preferredTime: string;
  mode: string;
  notes: string | null;
  status: AppointmentStatus;
  adminNote: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  sender: ChatSender;
  content: string;
  createdAt: Date;
};

export type ChatConversation = {
  id: string;
  sessionId: string;
  language: string;
  mode: ChatMode;
  visitorName: string | null;
  visitorEmail: string | null;
  visitorPhone: string | null;
  serviceInterest: string | null;
  isLead: boolean;
  isEscalated: boolean;
  summary: string | null;
  messages: ChatMessage[];
  enquiries: ContactEnquiry[];
  _count: { messages: number; enquiries: number };
  createdAt: Date;
  updatedAt: Date;
};

export type LegalPage = {
  id: string;
  type: LegalPageType;
  slug: string;
  title: string;
  content: string;
  status: ContentStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SEOSettings = {
  id: string;
  siteTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  ogImageUrl: string | null;
  canonicalBase: string | null;
  twitterHandle: string | null;
  gaMeasurementId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Media = {
  id: string;
  url: string;
  publicId: string | null;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: Date;
};

export type AuditLog = {
  id: string;
  userId: string | null;
  user?: Pick<AdminUser, "name" | "email"> | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: Date;
};
