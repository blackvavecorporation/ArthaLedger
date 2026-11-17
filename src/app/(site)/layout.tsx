import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { WhatsAppWidget } from "@/components/site/whatsapp-widget";
import { ChatWidget } from "@/components/site/chat-widget";
import { JsonLd } from "@/components/site/json-ld";
import { AnalyticsConsent } from "@/components/site/analytics-consent";
import {
  getNavigation,
  getSeoSettings,
  getServices,
  getSettings,
  getSocialLinks,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";
import { whatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, headerNav, footerNav, socialLinks, services, seo] = await Promise.all([
    getSettings(),
    getNavigation("HEADER"),
    getNavigation("FOOTER"),
    getSocialLinks(),
    getServices(),
    getSeoSettings(),
  ]);

  const legalLinks = footerNav.filter((item) => item.href.startsWith("/legal/"));
  const exploreLinks = footerNav.filter((item) => !item.href.startsWith("/legal/"));
  const waLink = whatsAppLink(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AccountingService",
          name: settings.brandName,
          description: settings.tagline,
          url: absoluteUrl("/"),
          telephone: settings.primaryPhone,
          email: settings.businessEmail,
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.officeAddress,
            addressCountry: "IN",
          },
          openingHours: settings.workingHours,
          areaServed: { "@type": "Country", name: "India" },
        }}
      />
      <Navbar
        brandName={settings.brandName}
        logoUrl={settings.logoUrl}
        tagline={settings.tagline}
        items={headerNav}
        phone={settings.primaryPhone}
        email={settings.businessEmail}
        hours={settings.workingHours}
      />
      <main id="main-content">{children}</main>
      <Footer
        brandName={settings.brandName}
        logoUrl={settings.logoUrl}
        tagline={settings.tagline}
        about={settings.footerAbout}
        address={settings.officeAddress}
        phone={settings.primaryPhone}
        email={settings.businessEmail}
        hours={settings.workingHours}
        copyright={settings.footerCopyright}
        footerLinks={exploreLinks}
        legalLinks={legalLinks}
        services={services}
        socialLinks={socialLinks}
      />
      {settings.chatbotEnabled && (
        <ChatWidget
          brandName={settings.brandName}
          welcomeEn={settings.chatbotWelcomeEn}
          welcomeTe={settings.chatbotWelcomeTe}
          whatsappLink={waLink}
          whatsappEnabled={settings.whatsappEnabled}
          services={services.map((service) => ({ id: service.id, title: service.title }))}
        />
      )}
      {settings.whatsappEnabled && (
        <WhatsAppWidget
          link={waLink}
          welcome={settings.whatsappWelcomeMessage}
          brandName={settings.brandName}
          stacked={settings.chatbotEnabled}
        />
      )}
      {seo?.gaMeasurementId && <AnalyticsConsent gaMeasurementId={seo.gaMeasurementId} />}
    </>
  );
}
