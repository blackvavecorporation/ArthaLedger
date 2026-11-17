-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ChatMode" AS ENUM ('AI', 'FAQ', 'HUMAN');

-- CreateEnum
CREATE TYPE "ChatSender" AS ENUM ('VISITOR', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NavLocation" AS ENUM ('HEADER', 'FOOTER');

-- CreateEnum
CREATE TYPE "LegalPageType" AS ENUM ('TERMS', 'PRIVACY', 'DISCLAIMER', 'COOKIE');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "RoleName" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "brandName" TEXT NOT NULL DEFAULT 'ArthaLedger',
    "legalName" TEXT NOT NULL DEFAULT '[Firm Legal Name]',
    "tagline" TEXT NOT NULL DEFAULT 'Your Business. Our Financial Expertise.',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryPhone" TEXT NOT NULL DEFAULT '+91 90000 00000',
    "secondaryPhone" TEXT,
    "businessEmail" TEXT NOT NULL DEFAULT 'hello@arthaledger.example',
    "officeAddress" TEXT NOT NULL DEFAULT '[Office Address], Hyderabad, Telangana, India',
    "googleMapsEmbedUrl" TEXT,
    "workingHours" TEXT NOT NULL DEFAULT 'Monday – Saturday, 10:00 AM – 6:30 PM IST',
    "footerAbout" TEXT,
    "footerCopyright" TEXT,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNumber" TEXT NOT NULL DEFAULT '919000000000',
    "whatsappMessage" TEXT NOT NULL DEFAULT 'Hello ArthaLedger, I would like to discuss a professional service.',
    "whatsappWelcomeMessage" TEXT NOT NULL DEFAULT 'Chat with our team on WhatsApp. Please avoid sharing passwords, OTPs or bank credentials.',
    "chatbotEnabled" BOOLEAN NOT NULL DEFAULT true,
    "chatbotMode" "ChatMode" NOT NULL DEFAULT 'AI',
    "chatbotWelcomeEn" TEXT NOT NULL DEFAULT 'Hello! I can help you understand our services, collect an enquiry, or arrange a consultation. How can I help?',
    "chatbotWelcomeTe" TEXT NOT NULL DEFAULT 'నమస్కారం! మా సేవల గురించి తెలుసుకోవడానికి, విచారణ నమోదు చేయడానికి లేదా సంప్రదింపు సమయం కోసం నేను సహాయం చేయగలను. మీకు ఎలా సహాయపడగలను?',
    "chatbotSystemPrompt" TEXT,
    "chatbotModel" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "location" "NavLocation" NOT NULL DEFAULT 'HEADER',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageContent" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Chartered Accountancy & Business Advisory',
    "heroTitle" TEXT NOT NULL DEFAULT 'Financial clarity for',
    "heroTitleAccent" TEXT NOT NULL DEFAULT 'ambitious businesses.',
    "heroDescription" TEXT NOT NULL DEFAULT 'ArthaLedger brings accounting, tax and compliance discipline together with practical business advice — so you can make confident decisions with clean numbers behind you.',
    "primaryCtaLabel" TEXT NOT NULL DEFAULT 'Book a consultation',
    "primaryCtaHref" TEXT NOT NULL DEFAULT '/contact',
    "secondaryCtaLabel" TEXT NOT NULL DEFAULT 'Explore services',
    "secondaryCtaHref" TEXT NOT NULL DEFAULT '/services',
    "heroTrustLine" TEXT NOT NULL DEFAULT 'Confidential, professional and responsive support for growing Indian businesses.',
    "heroCardTitle" TEXT NOT NULL DEFAULT 'Your compliance calendar',
    "heroCardSubtitle" TEXT NOT NULL DEFAULT 'A clear view of what needs attention.',
    "servicesEyebrow" TEXT NOT NULL DEFAULT 'What we do',
    "servicesTitle" TEXT NOT NULL DEFAULT 'Professional services, built around your business',
    "servicesDescription" TEXT NOT NULL DEFAULT 'From day-to-day bookkeeping to statutory compliance and advisory, every engagement begins with understanding your business.',
    "whyEyebrow" TEXT NOT NULL DEFAULT 'Why ArthaLedger',
    "whyTitle" TEXT NOT NULL DEFAULT 'A steadier financial foundation',
    "whyDescription" TEXT NOT NULL DEFAULT 'You get a responsive team, documented processes and advice that stays grounded in your commercial reality.',
    "expertiseEyebrow" TEXT NOT NULL DEFAULT 'Our expertise',
    "expertiseTitle" TEXT NOT NULL DEFAULT 'Depth where it matters',
    "expertiseDescription" TEXT NOT NULL DEFAULT 'Practical capability across tax, compliance, accounting and business advisory.',
    "testimonialsEyebrow" TEXT NOT NULL DEFAULT 'Client voices',
    "testimonialsTitle" TEXT NOT NULL DEFAULT 'Relationships built on trust',
    "testimonialsDescription" TEXT NOT NULL DEFAULT 'Only verified, approved client feedback is published on this website.',
    "faqEyebrow" TEXT NOT NULL DEFAULT 'Questions, answered',
    "faqTitle" TEXT NOT NULL DEFAULT 'Before you engage with us',
    "faqDescription" TEXT NOT NULL DEFAULT 'Clear answers to the questions we hear most often. For advice on your specific facts, please speak with our team.',
    "ctaEyebrow" TEXT NOT NULL DEFAULT 'Start a conversation',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Let us bring clarity to your finances.',
    "ctaDescription" TEXT NOT NULL DEFAULT 'Tell us what you are working on. We will respond with a considered next step — no obligation.',
    "ctaButtonLabel" TEXT NOT NULL DEFAULT 'Book a consultation',
    "ctaButtonHref" TEXT NOT NULL DEFAULT '/contact',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPageContent" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "eyebrow" TEXT NOT NULL DEFAULT 'About ArthaLedger',
    "title" TEXT NOT NULL DEFAULT 'A financial partner that understands business',
    "introduction" TEXT NOT NULL DEFAULT 'ArthaLedger is a professional chartered accountancy practice built to support founders and businesses with reliable numbers, timely compliance and sound commercial judgement.',
    "story" TEXT NOT NULL DEFAULT 'We started ArthaLedger with a simple belief: financial services should be clear, responsive and connected to the decisions a business actually needs to make. Our work sits at the intersection of accounting, tax and compliance — with every engagement grounded in the client''s context.',
    "vision" TEXT NOT NULL DEFAULT 'To be the trusted financial backbone for India''s next generation of well-run businesses.',
    "mission" TEXT NOT NULL DEFAULT 'To deliver precise, timely and practical financial support that helps clients comply confidently and grow sustainably.',
    "imageUrl" TEXT,
    "valuesTitle" TEXT NOT NULL DEFAULT 'The principles behind our work',
    "teamTitle" TEXT NOT NULL DEFAULT 'The people behind the practice',
    "teamDescription" TEXT NOT NULL DEFAULT 'Experienced professionals who take ownership, communicate plainly and treat your business with care.',
    "whyTitle" TEXT NOT NULL DEFAULT 'Why clients choose us',
    "whyDescription" TEXT NOT NULL DEFAULT 'We combine technical rigour with the responsiveness of a team that knows your business.',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhyChooseItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'ShieldCheck',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhyChooseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpertiseItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Briefcase',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpertiseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Handshake',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "qualifications" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "linkedinUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Calculator',
    "imageUrl" TEXT,
    "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ctaLabel" TEXT NOT NULL DEFAULT 'Enquire about this service',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "designation" TEXT,
    "company" TEXT,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "imageUrl" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "questionTe" TEXT,
    "answerTe" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactEnquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "serviceId" TEXT,
    "serviceName" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'CONTACT_FORM',
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "conversationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "serviceId" TEXT,
    "serviceName" TEXT,
    "preferredDate" TIMESTAMP(3) NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'PHONE',
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "mode" "ChatMode" NOT NULL DEFAULT 'AI',
    "visitorName" TEXT,
    "visitorEmail" TEXT,
    "visitorPhone" TEXT,
    "serviceInterest" TEXT,
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    "isEscalated" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "sender" "ChatSender" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalPage" (
    "id" TEXT NOT NULL,
    "type" "LegalPageType" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEOSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "siteTitle" TEXT NOT NULL DEFAULT 'ArthaLedger | Chartered Accountancy & Business Advisory',
    "titleTemplate" TEXT NOT NULL DEFAULT '%s | ArthaLedger',
    "description" TEXT NOT NULL DEFAULT 'ArthaLedger provides accounting, tax, GST, company registration and business advisory services for Indian businesses.',
    "keywords" TEXT[] DEFAULT ARRAY['chartered accountant Hyderabad', 'GST services', 'income tax return filing', 'company registration India', 'business advisory']::TEXT[],
    "ogImageUrl" TEXT,
    "canonicalBase" TEXT,
    "twitterHandle" TEXT,
    "gaMeasurementId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SEOSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_roleId_idx" ON "AdminUser"("roleId");

-- CreateIndex
CREATE INDEX "NavItem_location_order_idx" ON "NavItem"("location", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_status_order_idx" ON "Service"("status", "order");

-- CreateIndex
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");

-- CreateIndex
CREATE INDEX "Testimonial_isApproved_isPublished_order_idx" ON "Testimonial"("isApproved", "isPublished", "order");

-- CreateIndex
CREATE INDEX "FAQ_isPublished_order_idx" ON "FAQ"("isPublished", "order");

-- CreateIndex
CREATE INDEX "ContactEnquiry_status_createdAt_idx" ON "ContactEnquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactEnquiry_serviceId_idx" ON "ContactEnquiry"("serviceId");

-- CreateIndex
CREATE INDEX "ContactEnquiry_conversationId_idx" ON "ContactEnquiry"("conversationId");

-- CreateIndex
CREATE INDEX "AppointmentRequest_status_preferredDate_idx" ON "AppointmentRequest"("status", "preferredDate");

-- CreateIndex
CREATE INDEX "AppointmentRequest_serviceId_idx" ON "AppointmentRequest"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatConversation_sessionId_key" ON "ChatConversation"("sessionId");

-- CreateIndex
CREATE INDEX "ChatConversation_isLead_createdAt_idx" ON "ChatConversation"("isLead", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LegalPage_type_key" ON "LegalPage"("type");

-- CreateIndex
CREATE UNIQUE INDEX "LegalPage_slug_key" ON "LegalPage"("slug");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog"("entity");

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactEnquiry" ADD CONSTRAINT "ContactEnquiry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactEnquiry" ADD CONSTRAINT "ContactEnquiry_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentRequest" ADD CONSTRAINT "AppointmentRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
