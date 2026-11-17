// Static demo service catalogue. Edit this file to change the public services and chatbot knowledge.
export const demoServiceSeed = [
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
