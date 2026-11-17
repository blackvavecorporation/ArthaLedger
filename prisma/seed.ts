/**
 * ArthaLedger seed script.
 *
 * Idempotent: safe to run repeatedly. It never overwrites edited CMS content.
 * Admin credentials come from environment variables. If no password is supplied,
 * a strong random password is generated and printed once to the console.
 */
import "dotenv/config";
import { PrismaClient, type LegalPageType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

const services = [
  {
    title: "Income Tax Returns",
    slug: "income-tax-returns",
    category: "taxation",
    icon: "FileText",
    featured: true,
    shortDescription:
      "Accurate income tax return preparation and filing for individuals, professionals and businesses.",
    description:
      "## Income tax return preparation and filing\n\nWe prepare and file income tax returns with a clear view of your income, deductions and disclosure obligations. The engagement starts with a document review and a short discussion about your circumstances, so the return reflects your actual position rather than a last-minute compilation.\n\n### How the engagement works\n\n- We confirm the applicable return form and due date for your case.\n- You share the required documents through a secure channel.\n- We prepare the computation and return, then review it with you.\n- The return is filed after your approval, and we retain a copy of the acknowledgement.\n\n### Important\n\nTax positions depend on your facts and on the law applicable for the relevant year. We do not guarantee refunds or outcomes. Where a question needs a formal opinion, we will tell you and scope that work separately.",
    benefits: [
      "Return form and disclosure review",
      "Computation reviewed with you before filing",
      "Filing acknowledgement retained",
      "Guidance on notices and follow-up where applicable",
    ],
  },
  {
    title: "GST Registration",
    slug: "gst-registration",
    category: "gst",
    icon: "BadgeCheck",
    featured: true,
    shortDescription:
      "GST registration support for new businesses, branches and e-commerce sellers.",
    description:
      "## GST registration\n\nWe help you assess whether registration is required and prepare a clean, consistent application. Registration requirements differ by turnover, nature of supply, state and business model, so we begin with a short eligibility review.\n\n### What we need from you\n\n- PAN, constitution documents and address proof\n- Bank details and business place details\n- Details of authorised signatory and photographs\n- Product or service classification information\n\n### Scope\n\nWe prepare and submit the application, respond to routine clarification requests within the agreed scope, and explain the registration certificate once issued. Statutory fees, if any, are payable at actuals. Registration timelines are controlled by the GST portal and authorities.",
    benefits: [
      "Registration eligibility review",
      "Application preparation and submission",
      "Support for routine clarifications",
      "Post-registration compliance orientation",
    ],
  },
  {
    title: "GST Returns & Compliance",
    slug: "gst-returns-compliance",
    category: "gst",
    icon: "ReceiptText",
    featured: true,
    shortDescription:
      "Recurring GST return preparation, reconciliation and filing discipline.",
    description:
      "## GST returns and ongoing compliance\n\nWe manage GST return cycles with a structured close: data collection, reconciliation, review and filing. Our aim is to reduce avoidable mismatches and keep your compliance calendar predictable.\n\n### Typical monthly or quarterly cycle\n\n- Collect sales, purchase and credit note data\n- Reconcile books with GSTR-2B and portal data\n- Review tax positions and flag open items\n- File returns within the agreed cut-off\n- Share a filing summary for your records\n\n### Please note\n\nGST treatment depends on the specifics of each transaction. Our review is based on the records and explanations you provide. Deadlines and portal requirements can change; we communicate applicable due dates for your engagement.",
    benefits: [
      "Monthly or quarterly filing cycles",
      "GSTR-2B reconciliation",
      "Input tax credit review support",
      "Filing summaries and compliance calendar",
    ],
  },
  {
    title: "Accounting & Bookkeeping",
    slug: "accounting-bookkeeping",
    category: "accounting",
    icon: "BookOpen",
    featured: true,
    shortDescription:
      "Reliable books, monthly closes and management reporting for growing businesses.",
    description:
      "## Accounting and bookkeeping\n\nGood decisions need books you can trust. We maintain your accounts on a consistent basis, close them on a predictable schedule and give you reporting that is useful rather than decorative.\n\n### Engagement options\n\n- Full-service bookkeeping with monthly close\n- Periodic catch-up and clean-up of historical records\n- Bank and vendor reconciliation\n- Management accounts with a short commentary\n\n### Tools\n\nWe work with established accounting platforms or your existing system, subject to access and process review. We document the chart of accounts, approval flows and information responsibilities at the start of the engagement.",
    benefits: [
      "Predictable monthly close",
      "Bank, vendor and ledger reconciliations",
      "Management reporting pack",
      "Documented accounting policies",
    ],
  },
  {
    title: "Tax Planning",
    slug: "tax-planning",
    category: "taxation",
    icon: "TrendingUp",
    shortDescription:
      "Considered tax planning for business structures, transactions and owner remuneration.",
    description:
      "## Tax planning\n\nEffective tax planning is commercial planning with tax consequences properly understood. We review your structure, transactions and cash flows, then set out the available positions with their risks and documentation requirements.\n\n### What we examine\n\n- Entity and ownership structure\n- Timing and character of transactions\n- Owner remuneration and withdrawals\n- Eligible deductions and incentives, subject to conditions\n- Cross-border or multi-state considerations where relevant\n\n### Important\n\nWe do not implement aggressive arrangements or issue assurances against scrutiny. Any planning recommendation is based on the facts and law in force at the time and should be reviewed before a material transaction is executed.",
    benefits: [
      "Structured review of your tax position",
      "Written options with risks identified",
      "Implementation checklist",
      "Coordination with your other advisers",
    ],
  },
  {
    title: "Company Registration",
    slug: "company-registration",
    category: "business-setup",
    icon: "Building2",
    featured: true,
    shortDescription:
      "Private limited company incorporation with a clear pre- and post-incorporation plan.",
    description:
      "## Company incorporation\n\nWe help founders incorporate a company with the right documents and a realistic post-incorporation compliance plan. Before filing, we discuss shareholding, capital, directors and the proposed business activity.\n\n### Incorporation checklist\n\n- Name reservation and classification review\n- Drafting of constitutional documents\n- Director and subscriber documentation\n- Filing with the Registrar of Companies\n- PAN, TAN and bank account opening support\n- First board meeting and statutory register setup\n\n### What to expect\n\nGovernment approval timelines are outside our control. We keep you informed at each stage and explain the recurring compliance obligations that follow incorporation.",
    benefits: [
      "Name and structure guidance",
      "End-to-end incorporation filing",
      "Post-incorporation compliance setup",
      "Documentation handover",
    ],
  },
  {
    title: "LLP Registration",
    slug: "llp-registration",
    category: "business-setup",
    icon: "Users",
    shortDescription:
      "Limited liability partnership formation for professional and collaborative ventures.",
    description:
      "## LLP formation\n\nAn LLP can suit professional practices and ventures where partners want limited liability with a lighter compliance footprint than a company. We assess whether an LLP fits your objectives before filing.\n\n### Scope\n\n- Name reservation\n- Preparation of the LLP agreement in consultation with you\n- Partner and designated partner documentation\n- Incorporation filing and certificate follow-up\n- PAN, TAN and banking support\n- Ongoing ROC and income tax compliance orientation\n\n### Note\n\nPartnership terms, profit sharing and exit rights should be documented carefully. We prepare the agreement based on your instructions; we recommend independent legal review for complex arrangements.",
    benefits: [
      "Eligibility and structure consultation",
      "LLP agreement drafting support",
      "Incorporation filing",
      "Post-formation compliance plan",
    ],
  },
  {
    title: "Business Registration",
    slug: "business-registration",
    category: "business-setup",
    icon: "Landmark",
    shortDescription:
      "Sole proprietorship, partnership and other business registrations, coordinated end to end.",
    description:
      "## Business registration\n\nWe help new ventures choose and complete the registrations that fit their activity, state and scale. Not every business needs every registration, so we start with a requirements map rather than a standard package.\n\n### Registrations we coordinate\n\n- Sole proprietorship and partnership documentation\n- Shops and establishment registration where applicable\n- Professional tax registration\n- Trade licences through the relevant authority\n- Bank account documentation support\n\n### Approach\n\nWe set out the registrations required for your facts, the documents needed and the estimated sequence. Statutory fees and third-party charges are passed through at actuals.",
    benefits: [
      "Requirements map for your business",
      "Document preparation support",
      "Application coordination",
      "Renewal calendar where applicable",
    ],
  },
  {
    title: "ROC Compliance",
    slug: "roc-compliance",
    category: "compliance-audit",
    icon: "ClipboardCheck",
    shortDescription:
      "Registrar of Companies filings, statutory registers and board governance support.",
    description:
      "## ROC compliance\n\nWe maintain the statutory discipline that companies and LLPs need: timely filings, proper registers and board processes that reflect actual decisions.\n\n### Ongoing compliance support\n\n- Annual filings and event-based forms\n- Maintenance of statutory registers\n- Drafting of board and general meeting minutes\n- Director and shareholding change filings\n- Review of disclosure requirements\n\n### Engagement\n\nWe work from your records and instructions. Where a filing requires board approval or shareholder consent, we prepare the papers and coordinate with your authorised signatories. Penalties for late filing are determined by the authorities.",
    benefits: [
      "Annual filing calendar",
      "Statutory register maintenance",
      "Board and general meeting support",
      "Event-based ROC filings",
    ],
  },
  {
    title: "Auditing & Assurance",
    slug: "auditing-assurance",
    category: "compliance-audit",
    icon: "SearchCheck",
    shortDescription:
      "Audit support and assurance engagements, delivered within applicable professional eligibility and scope.",
    description:
      "## Auditing and assurance\n\nWe assist with audit and assurance work where the engagement falls within the firm's professional eligibility and capacity. The scope, applicable standards and independence requirements are confirmed in writing before work begins.\n\n### Possible engagements\n\n- Support for statutory audit processes\n- Internal control and process reviews\n- Management assurance reviews\n- Documentation and audit-readiness support\n\n### Professional eligibility\n\nRegulated audit services are offered only by appropriately qualified professionals and authorised firms. If a proposed engagement requires a qualification or authorisation the firm does not hold, we will say so and can coordinate with an eligible professional without misrepresenting the scope.",
    benefits: [
      "Clear engagement scope and responsibilities",
      "Structured documentation review",
      "Control observations with context",
      "Coordination with eligible professionals where needed",
    ],
  },
  {
    title: "Payroll Management",
    slug: "payroll-management",
    category: "accounting",
    icon: "WalletCards",
    shortDescription:
      "Payroll processing, statutory deductions and employee documentation support.",
    description:
      "## Payroll management\n\nWe run payroll as a controlled monthly cycle: inputs, validation, computation, approvals and records. Employees receive consistent payslips, and statutory deductions are handled within the agreed scope.\n\n### Monthly cycle\n\n- Collection of attendance, leave and variable pay inputs\n- Payroll computation and validation\n- Payslip preparation\n- Provident fund, ESI and professional tax support where applicable\n- Payroll register and accounting entries\n\n### Data handling\n\nPayroll data is sensitive. We agree a secure information channel, limit access to the engagement team and avoid collecting documents beyond the scope of the work.",
    benefits: [
      "Controlled monthly payroll cycle",
      "Payslips and payroll registers",
      "Statutory deduction support",
      "Confidential data handling",
    ],
  },
  {
    title: "Financial Consulting",
    slug: "financial-consulting",
    category: "advisory",
    icon: "LineChart",
    shortDescription:
      "Financial modelling, cash-flow visibility and finance function support for founders.",
    description:
      "## Financial consulting\n\nWe help founders and management teams turn financial information into decisions. Engagements are shaped around a specific question: pricing, funding readiness, cash runway, margin improvement or finance process design.\n\n### Typical work\n\n- Budget and cash-flow models\n- Unit economics and margin analysis\n- Management reporting design\n- Finance process and controls review\n- Due-diligence preparation support\n\n### Deliverables\n\nWe agree the questions, assumptions and output format before starting. Models are decision tools, not forecasts of certainty, and must be updated as assumptions change.",
    benefits: [
      "Decision-focused financial models",
      "Cash-flow and runway visibility",
      "Management reporting design",
      "Founder-friendly explanations",
    ],
  },
  {
    title: "Business Advisory",
    slug: "business-advisory",
    category: "advisory",
    icon: "Compass",
    shortDescription:
      "Practical advice on structure, compliance and finance as your business grows.",
    description:
      "## Business advisory\n\nOur advisory work connects the numbers to the decisions in front of you. It may involve structure, expansion, funding, governance or the finance operating model — always with attention to execution and compliance consequences.\n\n### How we work\n\n- A scoping conversation to define the decision\n- A review of relevant financial and legal documents\n- A written analysis with options and trade-offs\n- A practical implementation plan owned by you\n\n### Boundaries\n\nWe provide chartered accountancy and business advisory services within our professional scope. Legal opinions, investment recommendations and valuation opinions requiring specialist or regulated expertise are coordinated with appropriate professionals.",
    benefits: [
      "Partner-level scoping conversation",
      "Written options and trade-offs",
      "Implementation roadmap",
      "Coordinated specialist input",
    ],
  },
  {
    title: "MSME Registration",
    slug: "msme-registration",
    category: "business-setup",
    icon: "Factory",
    shortDescription:
      "Udyam registration and MSME benefit orientation for eligible enterprises.",
    description:
      "## MSME / Udyam registration\n\nWe assist eligible enterprises with Udyam registration and explain the practical implications for their business. Classification depends on the applicable investment and turnover criteria, which we review against your information.\n\n### Scope\n\n- Eligibility review based on your declarations\n- Preparation and filing of the Udyam application\n- Certificate handover and explanation\n- Orientation on documentation for benefit schemes\n\n### Note\n\nBenefits, eligibility and scheme rules are administered by the relevant authorities and can change. We do not guarantee approval or the availability of any particular benefit.",
    benefits: [
      "Eligibility review",
      "Udyam application filing",
      "Certificate explanation",
      "Documentation orientation",
    ],
  },
  {
    title: "Project Reports",
    slug: "project-reports",
    category: "advisory",
    icon: "FileSpreadsheet",
    shortDescription:
      "Structured project reports and financial projections for lending and planning.",
    description:
      "## Project reports\n\nWe prepare project reports with a coherent commercial narrative and financial projections that lenders and internal stakeholders can follow. Assumptions are documented, so the report remains useful after submission.\n\n### Contents typically include\n\n- Business and promoter background\n- Product, market and operating plan\n- Capital expenditure and means of finance\n- Projected financial statements and ratios\n- Sensitivity analysis\n- Supporting schedules\n\n### Important\n\nProjections are estimates based on agreed assumptions, not guarantees of performance. We prepare the report from information you provide and identify material assumptions for your review.",
    benefits: [
      "Documented projection assumptions",
      "Bank-ready report structure",
      "Financial statement schedules",
      "Sensitivity analysis",
    ],
  },
  {
    title: "TDS Services",
    slug: "tds-services",
    category: "taxation",
    icon: "BadgeIndianRupee",
    shortDescription:
      "TDS deduction review, return filing and reconciliation support.",
    description:
      "## TDS services\n\nWe help businesses apply the correct withholding discipline to vendor and employee payments, file periodic returns and reconcile the position with the income tax portal.\n\n### Scope\n\n- Review of payment categories and withholding applicability\n- TDS computation support\n- Quarterly return preparation and filing\n- Form 16 / 16A support where applicable\n- Reconciliation with 26AS and the TRACES portal\n- Support for routine correction statements\n\n### Note\n\nWithholding rates and thresholds depend on the nature of payment, payee status and the law applicable at the time. We confirm positions based on the documents and declarations you provide.",
    benefits: [
      "Payment category review",
      "Quarterly TDS returns",
      "Form 16 / 16A support",
      "Portal reconciliation",
    ],
  },
] as const;

const legalContent: Record<
  LegalPageType,
  { id: string; slug: string; title: string; content: string }
> = {
  TERMS: {
    id: "legal-terms",
    slug: "terms-conditions",
    title: "Terms & Conditions",
    content: `# Terms & Conditions

**Last updated:** [Date]

These Terms & Conditions govern your use of the ArthaLedger website. By accessing this website, you agree to these terms. If you do not agree, please do not use the website.

> **Publication note:** This is a draft template prepared for review. Replace every bracketed placeholder and have the final text reviewed by qualified legal counsel before publication.

## 1. Who we are

This website is operated by **[Firm Legal Name]**, a **[professional firm / chartered accountancy practice]** with its office at **[Registered Office Address]**. References to "we", "us" and "our" mean that entity.

## 2. Information, not professional advice

The content on this website is provided for general information only. It is not accounting, tax, legal, financial, investment or other professional advice, and it should not be relied upon as a substitute for advice on your particular facts. Reading this website or sending an enquiry does not create a professional-client relationship or an engagement.

A professional engagement arises only when both parties sign a written engagement letter that sets out the scope, responsibilities, fees and terms.

## 3. Website content and changes

We aim to keep information accurate and current, but laws, regulations and administrative practice change frequently. We do not warrant that any content is complete, accurate or up to date. We may modify, suspend or withdraw any part of the website without notice.

## 4. Enquiries and communications

When you submit an enquiry through this website, you confirm that the information you provide is accurate and that you are authorised to share it. You must not submit passwords, one-time passwords, bank credentials, or sensitive documents through public website forms. We may contact you using the details you provide to respond to your enquiry.

## 5. Fees and engagement

Fees for professional services are agreed separately in writing. Website content does not constitute a quotation. Government fees, statutory charges and third-party costs are payable at actuals unless stated otherwise.

## 6. Intellectual property

The ArthaLedger name, logo, text, design, graphics and other content on this website are owned by or licensed to us and are protected by applicable intellectual property laws. You may view and print pages for personal, non-commercial reference, but you may not reproduce, modify, distribute or commercially exploit the content without our prior written permission.

## 7. Acceptable use

You agree not to use this website in a way that is unlawful, misleading, disruptive or harmful, including by attempting unauthorised access, introducing malicious code, scraping content at scale, or interfering with the website's operation.

## 8. Third-party links

This website may link to third-party websites or embed third-party services. We do not control and are not responsible for their content, availability, security or privacy practices. Links are provided for convenience and do not imply endorsement.

## 9. Limitation of liability

To the maximum extent permitted by applicable law, we are not liable for any indirect, incidental, special or consequential loss arising from your use of this website or reliance on its content. Nothing in these terms excludes liability that cannot lawfully be excluded.

## 10. Privacy and cookies

Our handling of personal data is described in our Privacy Policy and Cookie Policy, which form part of these terms.

## 11. Governing law and jurisdiction

These terms are governed by the laws of India. Subject to applicable professional requirements, the courts at **[City, State]** shall have exclusive jurisdiction over disputes arising in connection with the website.

## 12. Contact

Questions about these terms may be sent to **[Business Email]** or by post to **[Registered Office Address]**.

**Implementation note:** Obtain legal review before publication and complete the placeholders for the legal entity, registration details, office address, jurisdiction, grievance contact and dates.`,
  },
  PRIVACY: {
    id: "legal-privacy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `# Privacy Policy

**Last updated:** [Date]

This Privacy Policy explains how **[Firm Legal Name]** ("ArthaLedger", "we", "us") collects, uses, stores and shares personal data when you use this website, contact us or engage our services.

> **Publication note:** This draft is aligned to general Indian privacy expectations, including the Digital Personal Data Protection Act, 2023. It must be reviewed against the firm's actual processing activities and by qualified counsel before publication.

## 1. Personal data we collect

We may collect:

- **Contact details** you submit through our forms, such as name, email address, telephone number and the service you are interested in.
- **Enquiry content**, including the message you provide and any information you choose to include.
- **Chatbot data**, including messages exchanged with our website assistant, the language selected and any contact details you choose to provide.
- **Appointment details**, including preferred date, time and consultation mode.
- **Technical data**, such as IP address, browser type, device information and pages visited, where analytics is enabled.
- **Service records** when you engage us, as required for the professional engagement and applicable law.

We ask that you do not submit passwords, one-time passwords, bank credentials, authentication codes or unnecessary sensitive financial documents through public website forms or the chatbot.

## 2. Why we use personal data

We use personal data to:

- respond to enquiries and provide requested information;
- arrange and manage consultations;
- evaluate and deliver professional services under an engagement;
- maintain business records and comply with legal, tax and professional obligations;
- protect the website, prevent misuse and improve its functionality;
- send service-related communications where permitted.

We do not sell personal data. We do not use enquiry details for unrelated marketing without an appropriate basis.

## 3. Legal basis and consent

Where consent is required, we process personal data on the basis of the consent you provide when submitting a form or communicating with us. You may withdraw consent by contacting us, subject to legal and contractual restrictions. Some processing may be necessary for compliance with law, for legitimate uses permitted under applicable law, or for the performance of an engagement.

## 4. Cookies and analytics

We use essential cookies required for website operation and security. Optional analytics cookies are used only where configured and, where required, with your consent. See our Cookie Policy for details and controls.

## 5. Sharing of personal data

We may share personal data with:

- service providers who host, secure or support our website and communications, under appropriate confidentiality and processing obligations;
- professional advisers, auditors or authorities where required by law or professional obligation;
- a successor entity in connection with a reorganisation, subject to appropriate safeguards.

We do not disclose client information publicly or to unrelated third parties except as authorised by you or required by law.

## 6. Data storage, security and retention

We use reasonable technical and organisational safeguards, including access controls, encrypted connections and restricted administrative access. No system can be guaranteed to be completely secure; please use secure channels for sensitive documents and share them only when requested.

We retain personal data only for as long as needed for the purposes described above, including statutory retention requirements applicable to professional and financial records, and for the establishment or defence of legal claims.

## 7. Your rights

Subject to applicable law, you may request access to your personal data, correction of inaccuracies, erasure of data no longer required, withdrawal of consent, or grievance redressal. To exercise these rights, contact us using the details below. We may need to verify your identity before acting on a request.

## 8. Children

This website is intended for businesses and adults. We do not knowingly collect personal data from children. If you believe a child has provided personal data, please contact us so we can take appropriate action.

## 9. International processing

Our service providers may process data in locations outside India. Where required, we take steps to ensure appropriate safeguards are in place for such transfers.

## 10. Changes to this policy

We may update this policy from time to time. The updated version will be published on this page with a revised date.

## 11. Contact and grievance officer

**Data Protection / Grievance Contact:** [Name]
**Email:** [Business Email]
**Postal address:** [Registered Office Address]

**Implementation note:** Complete the placeholder details, map actual data flows and vendors, and obtain legal review before publication.`,
  },
  DISCLAIMER: {
    id: "legal-disclaimer",
    slug: "disclaimer",
    title: "Disclaimer",
    content: `# Disclaimer

**Last updated:** [Date]

> **Publication note:** This is a draft for legal review. Complete all placeholders and confirm compliance with applicable professional advertising and website requirements before publication.

## General information only

The content on the ArthaLedger website is provided for general informational purposes. It is not intended to be, and should not be treated as, professional advice on any specific matter. Tax rates, thresholds, compliance deadlines and legal positions change and may be interpreted differently based on individual facts.

## No professional relationship

Viewing this website, using the chatbot or submitting an enquiry does not create a chartered accountant-client, adviser-client or any other professional relationship. A relationship is created only through a signed engagement letter that defines the scope and terms of the engagement.

## No solicitation or advertisement

This website is intended to provide information about the firm and its professional services. Nothing on this website should be construed as an advertisement, solicitation or invitation to engage the firm in any jurisdiction where such communication would be restricted. Access is at the visitor's own initiative.

## Professional qualifications and scope

Regulated professional services, including statutory audits and attest functions, are undertaken only where the firm and the responsible professional hold the qualifications and authorisations required by law. Where an engagement requires a service the firm is not authorised to provide, we will disclose that and, where appropriate, coordinate with an eligible professional.

## No guarantees

We do not guarantee any particular tax outcome, refund, approval, registration timeline, benefit or result. Government authorities and third parties control registrations, assessments, approvals and timelines. Any examples or descriptions of processes are illustrative.

## Third-party information

Any links to third-party websites, tools or resources are provided for convenience. We do not endorse and are not responsible for third-party content, products, security or privacy practices.

## Limitation of liability

To the extent permitted by law, the firm accepts no liability for loss arising from reliance on general website content or from any interruption, error or omission in the website. Professional engagements are governed exclusively by their written terms.

## Contact

For questions about this disclaimer, contact **[Business Email]**.

**Implementation note:** Legal review required before publication.`,
  },
  COOKIE: {
    id: "legal-cookie",
    slug: "cookie-policy",
    title: "Cookie Policy",
    content: `# Cookie Policy

**Last updated:** [Date]

This Cookie Policy explains how **[Firm Legal Name]** uses cookies and similar technologies on the ArthaLedger website.

> **Publication note:** This draft must be reviewed against the cookies and analytics actually deployed before publication.

## What are cookies?

Cookies are small text files stored on your device when you visit a website. They can help a website function, remember preferences, improve security or provide aggregate analytics. Similar technologies, such as local storage, may be used for the same purposes.

## Cookies we use

### Strictly necessary cookies

These are required for the website to operate securely and correctly. They may include session cookies used to protect administrative access and security features that prevent abuse. These cookies cannot be switched off through our cookie controls because the website would not function properly without them.

### Analytics cookies (optional)

If analytics is configured by the firm, we may use privacy-conscious analytics to understand aggregate website usage, such as page views and referral sources. Analytics cookies are optional and are used only where an appropriate consent mechanism is configured. We do not use analytics to identify individual visitors.

### Third-party content

Some pages may embed third-party content, such as a map or a WhatsApp chat link. Those providers may set their own cookies or process technical information when you interact with their services. Please review their policies for details.

## Managing cookies

You can manage or delete cookies through your browser settings. Blocking all cookies may affect website functionality. Where an optional cookie consent control is presented, you can withdraw consent through that control or by clearing stored cookie preferences.

## Changes

We may update this policy if our use of cookies changes. The revised version will be posted on this page with a new date.

## Contact

Questions about cookies can be sent to **[Business Email]**.

**Implementation note:** Confirm the analytics provider and consent mechanism actually used, then obtain legal review before publication.`,
  },
};

async function main() {
  const roleNames = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;
  const roles: Record<string, string> = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description:
          name === "SUPER_ADMIN"
            ? "Full access including team management and audit logs"
            : name === "ADMIN"
              ? "Manage content, enquiries, appointments and conversations"
              : "Manage website content and services",
      },
    });
    roles[name] = role.id;
  }

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@arthaledger.local").toLowerCase();
  const adminName = process.env.SEED_ADMIN_NAME || "ArthaLedger Admin";
  const suppliedPassword = process.env.SEED_ADMIN_PASSWORD;
  const password = suppliedPassword || randomBytes(18).toString("base64url") + "!9";

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({
      data: { name: adminName, email: adminEmail, passwordHash, roleId: roles.SUPER_ADMIN },
    });
    console.log(`Created admin user: ${adminEmail}`);
    if (!suppliedPassword) console.log(`GENERATED ADMIN PASSWORD (store securely): ${password}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail} (password unchanged)`);
  }

  const settings = await prisma.websiteSettings.count();
  if (settings === 0) {
    await prisma.websiteSettings.create({
      data: {
        footerAbout:
          "ArthaLedger is a professional chartered accountancy practice supporting businesses with accounting, tax, compliance and advisory services.",
        footerCopyright: `© ${new Date().getFullYear()} ArthaLedger. All rights reserved.`,
        googleMapsEmbedUrl:
          "https://www.google.com/maps?q=Hyderabad,Telangana,India&output=embed",
      },
    });
  }

  await prisma.homePageContent.upsert({
    where: { id: "main" },
    update: {},
    create: {},
  });
  await prisma.aboutPageContent.upsert({ where: { id: "main" }, update: {}, create: {} });
  await prisma.sEOSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      canonicalBase: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  });

  if ((await prisma.navItem.count()) === 0) {
    await prisma.navItem.createMany({
      data: [
        { label: "Home", href: "/", location: "HEADER", order: 1 },
        { label: "About", href: "/about", location: "HEADER", order: 2 },
        { label: "Services", href: "/services", location: "HEADER", order: 3 },
        { label: "Testimonials", href: "/testimonials", location: "HEADER", order: 4 },
        { label: "Contact", href: "/contact", location: "HEADER", order: 5 },
        { label: "Home", href: "/", location: "FOOTER", order: 1 },
        { label: "About us", href: "/about", location: "FOOTER", order: 2 },
        { label: "Services", href: "/services", location: "FOOTER", order: 3 },
        { label: "Contact", href: "/contact", location: "FOOTER", order: 4 },
        { label: "Terms & Conditions", href: "/legal/terms-conditions", location: "FOOTER", order: 10 },
        { label: "Privacy Policy", href: "/legal/privacy-policy", location: "FOOTER", order: 11 },
        { label: "Disclaimer", href: "/legal/disclaimer", location: "FOOTER", order: 12 },
        { label: "Cookie Policy", href: "/legal/cookie-policy", location: "FOOTER", order: 13 },
      ],
    });
  }

  if ((await prisma.stat.count()) === 0) {
    await prisma.stat.createMany({
      data: [
        { value: "16+", label: "Professional service lines", order: 1 },
        { value: "6", label: "Practice areas", order: 2 },
        { value: "EN / TE", label: "Bilingual support", order: 3 },
        { value: "100%", label: "Confidential handling", order: 4 },
      ],
    });
  }

  if ((await prisma.whyChooseItem.count()) === 0) {
    await prisma.whyChooseItem.createMany({
      data: [
        {
          title: "Partner-led attention",
          description:
            "Your engagement is reviewed by an experienced professional who understands the commercial context, not just the filing.",
          icon: "UserCheck",
          order: 1,
        },
        {
          title: "Clear, timely communication",
          description:
            "We agree response expectations, flag issues early and explain positions in language you can act on.",
          icon: "MessagesSquare",
          order: 2,
        },
        {
          title: "Deadline discipline",
          description:
            "A documented compliance calendar and structured close process keep statutory obligations visible.",
          icon: "CalendarCheck",
          order: 3,
        },
        {
          title: "Confidential by design",
          description:
            "Need-to-know access, secure channels and careful handling of sensitive financial information.",
          icon: "Lock",
          order: 4,
        },
        {
          title: "Practical, not theoretical",
          description:
            "Advice grounded in your cash flows, capacity and growth plans — with implementation support.",
          icon: "Lightbulb",
          order: 5,
        },
        {
          title: "Scope you can see",
          description:
            "Engagement letters set out responsibilities, deliverables and fees so there are no surprises.",
          icon: "FileCheck2",
          order: 6,
        },
      ],
    });
  }

  if ((await prisma.expertiseItem.count()) === 0) {
    await prisma.expertiseItem.createMany({
      data: [
        { title: "Direct taxation", description: "Returns, TDS, assessments and planning support for businesses and professionals.", icon: "FileText", order: 1 },
        { title: "Indirect tax & GST", description: "Registration, returns, reconciliation and compliance process design.", icon: "ReceiptText", order: 2 },
        { title: "Corporate compliance", description: "ROC filings, statutory registers and board governance support.", icon: "Building2", order: 3 },
        { title: "Accounting systems", description: "Reliable books, monthly closes and management reporting.", icon: "BookOpen", order: 4 },
        { title: "Business structuring", description: "Entity selection, incorporation and post-setup compliance planning.", icon: "Network", order: 5 },
        { title: "Financial advisory", description: "Models, cash-flow visibility and finance function support.", icon: "LineChart", order: 6 },
      ],
    });
  }

  if ((await prisma.valueItem.count()) === 0) {
    await prisma.valueItem.createMany({
      data: [
        { title: "Integrity", description: "We say what we can do, disclose limits and stand behind our work.", icon: "ShieldCheck", order: 1 },
        { title: "Clarity", description: "Plain explanations, documented positions and no unnecessary complexity.", icon: "Eye", order: 2 },
        { title: "Responsiveness", description: "Agreed response windows and proactive updates on active matters.", icon: "Zap", order: 3 },
        { title: "Confidentiality", description: "Client information is handled with care and restricted access.", icon: "Lock", order: 4 },
      ],
    });
  }

  const categories = [
    { name: "Taxation", slug: "taxation", description: "Direct tax, TDS and planning support.", order: 1 },
    { name: "GST", slug: "gst", description: "GST registration, returns and reconciliation.", order: 2 },
    { name: "Accounting", slug: "accounting", description: "Books, payroll and management reporting.", order: 3 },
    { name: "Business Setup", slug: "business-setup", description: "Incorporation and registration support.", order: 4 },
    { name: "Compliance & Audit", slug: "compliance-audit", description: "ROC compliance and assurance support.", order: 5 },
    { name: "Advisory", slug: "advisory", description: "Financial consulting and business advisory.", order: 6 },
  ];
  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    const row = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    categoryIds[category.slug] = row.id;
  }

  for (const [index, service] of services.entries()) {
    const existing = await prisma.service.findUnique({ where: { slug: service.slug } });
    if (existing) continue;
    await prisma.service.create({
      data: {
        title: service.title,
        slug: service.slug,
        categoryId: categoryIds[service.category],
        shortDescription: service.shortDescription,
        description: service.description,
        icon: service.icon,
        benefits: [...service.benefits],
        isFeatured: (service as { featured?: boolean }).featured ?? false,
        status: "PUBLISHED",
        order: index + 1,
        seoTitle: `${service.title} | ArthaLedger`,
        seoDescription: service.shortDescription,
      },
    });
  }

  if ((await prisma.fAQ.count()) === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: "What services does ArthaLedger provide?",
          answer:
            "We support businesses and individuals with income tax, GST, accounting and bookkeeping, payroll, company and LLP registration, ROC compliance, audit support, TDS, project reports and financial advisory. The full list is on our Services page; scope is confirmed in writing before work begins.",
          questionTe: "ArthaLedger ఏ సేవలు అందిస్తుంది?",
          answerTe:
            "మేము ఆదాయపు పన్ను, GST, అకౌంటింగ్, పేరోల్, కంపెనీ మరియు LLP నమోదు, ROC కంప్లయన్స్, ఆడిట్ సహాయం, TDS మరియు ఆర్థిక సలహా సేవలను అందిస్తాము. పని ప్రారంభానికి ముందు పరిధిని లిఖితపూర్వకంగా నిర్ధారిస్తాము.",
          order: 1,
        },
        {
          question: "How do I book a consultation?",
          answer:
            "Use the contact form on this website, call our office, or send a WhatsApp message. Tell us briefly what you need help with and a preferred time. We will confirm an available slot and explain what to prepare.",
          questionTe: "సంప్రదింపు సమయాన్ని ఎలా బుక్ చేయాలి?",
          answerTe:
            "ఈ వెబ్‌సైట్‌లోని సంపర్క ఫారం, ఫోన్ లేదా WhatsApp ద్వారా మమ్మల్ని సంప్రదించండి. మీ అవసరం మరియు సౌకర్యవంతమైన సమయాన్ని తెలియజేయండి. అందుబాటులో ఉన్న సమయాన్ని నిర్ధారిస్తాము.",
          order: 2,
        },
        {
          question: "Do you work with clients outside Hyderabad?",
          answer:
            "Yes. Many engagements can be delivered remotely with secure document sharing and scheduled calls. Certain matters may require in-person meetings or local representation, which we will discuss during scoping.",
          order: 3,
        },
        {
          question: "What documents do I need for an income tax return?",
          answer:
            "Typically PAN, Aadhaar, bank details, Form 26AS and AIS, salary or business income records, investment and deduction proofs, and details of any other income. The exact list depends on your income sources and the applicable return form; we confirm it after an initial review.",
          order: 4,
        },
        {
          question: "Can you handle GST compliance for my business?",
          answer:
            "Yes, we support GST registration, periodic return preparation and filing, reconciliation with GSTR-2B and routine compliance. The scope and filing calendar are agreed in the engagement letter.",
          order: 5,
        },
        {
          question: "How is my data protected?",
          answer:
            "We limit access to the engagement team, use secure channels for document exchange and retain records in line with professional and legal requirements. Please do not share passwords, OTPs or bank credentials through website forms or chat.",
          order: 6,
        },
        {
          question: "Do you provide legal or investment advice?",
          answer:
            "No. We provide chartered accountancy and business advisory services within our professional scope. Legal opinions, investment recommendations and specialist valuations should be obtained from appropriately qualified professionals; we can coordinate where needed.",
          order: 7,
        },
        {
          question: "How are your fees determined?",
          answer:
            "Fees are based on the scope, complexity, volume and turnaround required. We provide a written proposal before the engagement begins. Statutory fees and out-of-pocket costs are charged at actuals unless agreed otherwise.",
          order: 8,
        },
      ],
    });
  }

  for (const [type, page] of Object.entries(legalContent)) {
    await prisma.legalPage.upsert({
      where: { id: page.id },
      update: {},
      create: {
        id: page.id,
        type: type as LegalPageType,
        slug: page.slug,
        title: page.title,
        content: page.content,
        status: "PUBLISHED",
        seoTitle: `${page.title} | ArthaLedger`,
        seoDescription: `${page.title} for the ArthaLedger website.`,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Services: ${await prisma.service.count()} | FAQs: ${await prisma.fAQ.count()} | Legal pages: ${await prisma.legalPage.count()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
