import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "./contact-form";
import { PageHero } from "@/components/site/page-hero";
import { getServices, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { whatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Contact",
    description:
      "Speak with ArthaLedger about tax, GST, accounting, registration, compliance or advisory support. Call, email, message on WhatsApp or send an enquiry.",
    path: "/contact",
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const preselected = params.service
    ? services.find((service) => service.slug === params.service)?.id
    : undefined;
  const waLink = whatsAppLink(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Start with a conversation."
        description="This demo shows a complete contact experience. The form validates your input and returns a confirmation, but it does not save or send anything."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section bg-ivory">
        <div className="container grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <ContactForm
            services={services.map((service) => ({ id: service.id, title: service.title }))}
            defaultServiceId={preselected}
          />

          <div className="space-y-5">
            <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-soft">
              <p className="eyebrow">Office</p>
              <h2 className="mt-3 font-display text-2xl font-medium text-navy-950">
                {settings.brandName}
              </h2>
              <ul className="mt-5 space-y-4 text-[0.82rem] leading-6 text-navy-600">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>{settings.officeAddress}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <div>
                    <a
                      href={`tel:${settings.primaryPhone.replace(/\s/g, "")}`}
                      className="hover:text-navy-900"
                    >
                      {settings.primaryPhone}
                    </a>
                    {settings.secondaryPhone && (
                      <a
                        href={`tel:${settings.secondaryPhone.replace(/\s/g, "")}`}
                        className="mt-1 block text-navy-400 hover:text-navy-900"
                      >
                        {settings.secondaryPhone}
                      </a>
                    )}
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <a href={`mailto:${settings.businessEmail}`} className="break-all hover:text-navy-900">
                    {settings.businessEmail}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>{settings.workingHours}</span>
                </li>
              </ul>

              {settings.whatsappEnabled && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#128C4A] px-4 py-3 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[#0f7a40]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Demo WhatsApp link
                </a>
              )}
            </div>

            <div className="rounded-xl border border-gold-200 bg-gold-50/60 p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                <div>
                  <p className="text-[0.8rem] font-semibold text-navy-900">A note on privacy</p>
                  <p className="mt-1.5 text-[0.72rem] leading-6 text-navy-600">
                    Please do not send passwords, OTPs, bank credentials or sensitive documents
                    through this page or WhatsApp. If we need documents, we will explain a secure
                    way to share them.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-navy-100 bg-navy-950 p-6 text-white">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-400">
                About this demo
              </p>
              <ol className="mt-3 space-y-3 text-[0.76rem] leading-6 text-white/55">
                <li className="flex gap-2.5">
                  <span className="text-gold-400">01</span> The form checks required fields and shows
                  a confirmation.
                </li>
                <li className="flex gap-2.5">
                  <span className="text-gold-400">02</span> Nothing is stored in a database, emailed
                  or delivered to a firm.
                </li>
                <li className="flex gap-2.5">
                  <span className="text-gold-400">03</span> The office details, map and WhatsApp
                  number are sample data for layout demonstration.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {settings.googleMapsEmbedUrl && (
          <div className="container mt-10">
            <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-soft">
              <iframe
                src={settings.googleMapsEmbedUrl}
                title={`Map showing the ${settings.brandName} office`}
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
            <p className="mt-2 text-[0.65rem] text-navy-400">
              Map data is provided by Google. This is a sample Hyderabad location for demonstration
              only.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
