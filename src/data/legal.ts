// Static demo legal pages. These pages describe the demonstration deployment
// only. They are not legal advice and should be replaced before any real launch.

export const demoLegalContent = {
  TERMS: {
    id: "legal-terms",
    slug: "terms-conditions",
    title: "Terms & Conditions",
    content: `# Terms & Conditions

**Demo notice:** This is a demonstration website. This page is sample copy and is not a legal agreement, a professional engagement or advice.

**Last updated:** 17 November 2026

## 1. What this website is

This deployment is a hardcoded product demonstration for a chartered accountancy website. It has no database, no live client records and no real professional services behind it. The firm name, contact details, service descriptions and testimonials are illustrative sample content.

## 2. No professional advice

Nothing on this website is accounting, tax, legal, financial, investment or other professional advice. Viewing the site, using the demo forms or chatting with the demo assistant does not create a professional-client relationship or an engagement.

## 3. Demo forms and data

The contact, enquiry and appointment forms validate input and show a confirmation only. They do not save, email or deliver the information to anyone. Do not submit real personal, financial or confidential information through this demo.

The demo admin area uses a fixed, publicly documented login. It is not a security boundary and must not be used for real accounts or confidential data.

## 4. Content and availability

Sample content may be changed or removed at any time. The demo is provided as-is, without warranties of availability, accuracy or fitness for a particular purpose.

## 5. Intellectual property

The ArthaLedger name, design and sample copy are provided for this demonstration. Third-party marks and embedded services remain the property of their respective owners.

## 6. Third-party links

Links to third-party websites or services are provided for convenience. This demo does not control and is not responsible for their content, availability or privacy practices.

## 7. Limitation of liability

To the extent permitted by law, no liability is accepted for loss arising from use of this demonstration website or reliance on its sample content.

## 8. Contact

This is a demo. For questions about the demonstration, use the sample contact details shown on the Contact page.`,
  },
  PRIVACY: {
    id: "legal-privacy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `# Privacy Policy

**Demo notice:** This page describes the actual data handling of this database-free demonstration. It is sample policy copy, not legal advice.

**Last updated:** 17 November 2026

## 1. Information collected by this demo

This deployment does not have a database and does not store form submissions. When you use the contact or chat forms, the information you type is processed in the browser and in the server request only long enough to validate it and return a demo confirmation. It is not saved, emailed, sent to a CRM or delivered to a firm.

Do not enter real names, phone numbers, financial details, passwords, OTPs, bank credentials or other sensitive information.

## 2. Chat history

The demo chat stores its transcript in your browser's local storage so the conversation survives a page refresh. You can clear it by clearing this site's browser data. The transcript is not sent to an AI provider and is not stored on the server.

## 3. Admin demo

The admin demonstration uses a fixed cookie to mark the demo session. It does not authenticate a real person or load an account from a database. Demo edits are held in server memory for the running session and are not permanently saved.

## 4. Cookies and local storage

The site uses a small demo session cookie and local storage for the chat transcript and optional cookie preference. See the Cookie Policy for details.

## 5. Third-party content

The contact page may embed a Google Map, and WhatsApp links open a third-party service. Those providers may process technical information when you interact with them. This demo does not control their practices.

## 6. Analytics

No analytics or advertising service is configured in this demo. If analytics is added in a live deployment, it should be disclosed and, where required, enabled only after consent.

## 7. Your choices

Because this demo does not retain form submissions, there is no stored enquiry to access or delete. Clear your browser storage to remove the local chat transcript and preferences.

## 8. Contact

This is a demonstration website. The contact details shown are sample data and are not a real firm's privacy contact.`,
  },
  DISCLAIMER: {
    id: "legal-disclaimer",
    slug: "disclaimer",
    title: "Disclaimer",
    content: `# Disclaimer

**Demo notice:** This is a demonstration website with illustrative content. Nothing here is professional advice.

**Last updated:** 17 November 2026

## General information only

The content on this website is sample material for demonstrating a chartered accountancy website. It is not professional advice and should not be relied on for any tax, accounting, legal, financial or business decision.

## No professional relationship

Using the demo forms, chat assistant or admin console does not create a chartered accountant-client or adviser-client relationship. No real services are offered through this deployment.

## Sample content

Service descriptions, testimonials, statistics, contact details and legal pages are illustrative. Testimonials are explicitly labelled as demo content and do not represent real clients. No real team member or professional qualification is represented.

## No guarantees

No outcome, approval, registration, refund, deadline or result is promised or guaranteed. Any real engagement would require written scope, due diligence and applicable professional standards.

## Professional scope

A live deployment should clearly describe the firm's actual qualifications and the services it is authorised to provide. Regulated audit, attest and other restricted services must be undertaken only by appropriately qualified and authorised professionals.

## Third-party links

Links to third-party websites or embedded services are provided for convenience. This demo does not endorse or control them.

## Contact

This is a demo. Use the sample contact details on the Contact page for questions about the demonstration.`,
  },
  COOKIE: {
    id: "legal-cookie",
    slug: "cookie-policy",
    title: "Cookie Policy",
    content: `# Cookie Policy

**Demo notice:** This page describes the cookies and browser storage used by this demonstration.

**Last updated:** 17 November 2026

## What are cookies?

Cookies are small text files stored by a website in your browser. Similar technologies, such as local storage, can remember preferences or session state.

## Cookies used by this demo

### Demo session cookie

The admin demonstration sets an HTTP-only cookie when you use the documented demo login. It marks the browser as being in the demo session and expires after eight hours. It does not represent a real authenticated account.

### Local storage

The chat widget stores the demo transcript, a random demo session identifier and the selected language in your browser. The optional analytics consent banner may also store a preference if it is displayed.

## Optional analytics

No analytics provider is configured in this demo. If analytics is added in a live deployment, it should load only after the required consent and be described accurately in this policy.

## Third-party content

The contact page may embed a Google Map, and WhatsApp links open a third-party service. Those providers may set their own cookies or process technical information when you interact with them.

## Managing cookies

You can clear cookies and local storage through your browser settings. Blocking all cookies may affect the demo login and chat history but will not affect the public content.

## Contact

This is a demonstration website. The contact details shown are sample data.`,
  },
} as const;
