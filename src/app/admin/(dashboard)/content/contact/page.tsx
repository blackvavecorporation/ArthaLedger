import { MessageCircle, Save, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveContactSettings, saveMessagingSettings } from "@/actions/cms";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { CheckboxField, Field, FormGrid, FormSection } from "@/components/admin/form";
import { whatsAppDisplay, whatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function ContactSettingsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("settings.write");
  const params = await searchParams;
  const settings = await db.websiteSettings.findUnique({ where: { id: "main" } });
  if (!settings) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Website settings not initialised.</div>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Site setup"
        title="Contact & messaging"
        description="Office contact details, WhatsApp click-to-chat and chatbot configuration. These values appear across the public site."
      />
      <FeedbackBanner params={params} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <form action={saveContactSettings}>
            <FormSection title="Office details" description="Displayed in the navbar utility bar, footer, contact page and structured data.">
              <FormGrid>
                <Field label="Primary phone" htmlFor="primaryPhone" required>
                  <input id="primaryPhone" name="primaryPhone" required defaultValue={settings.primaryPhone} className="admin-input" />
                </Field>
                <Field label="Secondary phone (optional)" htmlFor="secondaryPhone">
                  <input id="secondaryPhone" name="secondaryPhone" defaultValue={settings.secondaryPhone ?? ""} className="admin-input" />
                </Field>
              </FormGrid>
              <div className="mt-5">
                <Field label="Business email" htmlFor="businessEmail" required>
                  <input id="businessEmail" name="businessEmail" type="email" required defaultValue={settings.businessEmail} className="admin-input" />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Office address" htmlFor="officeAddress" required>
                  <textarea id="officeAddress" name="officeAddress" required defaultValue={settings.officeAddress} className="admin-textarea min-h-[90px]" />
                </Field>
              </div>
              <FormGrid>
                <Field label="Working hours" htmlFor="workingHours" required>
                  <input id="workingHours" name="workingHours" required defaultValue={settings.workingHours} className="admin-input" />
                </Field>
                <Field
                  label="Google Maps embed URL"
                  htmlFor="googleMapsEmbedUrl"
                  hint="Use a Google Maps 'Embed a map' URL, or a maps search URL ending in output=embed."
                >
                  <input id="googleMapsEmbedUrl" name="googleMapsEmbedUrl" defaultValue={settings.googleMapsEmbedUrl ?? ""} className="admin-input" />
                </Field>
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <SubmitButton pendingLabel="Saving contact details…">
                  <Save className="h-4 w-4" />
                  Save contact details
                </SubmitButton>
              </div>
            </FormSection>
          </form>

          <form action={saveMessagingSettings}>
            <FormSection
              title="WhatsApp"
              description="The floating WhatsApp widget and click-to-chat links use these values."
            >
              <CheckboxField
                label="Show floating WhatsApp widget"
                name="whatsappEnabled"
                defaultChecked={settings.whatsappEnabled}
                hint="Displayed on every public page, bottom-right."
              />
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="WhatsApp number" htmlFor="whatsappNumber" required hint="Digits only, with country code. Example: 919876543210.">
                  <input id="whatsappNumber" name="whatsappNumber" required defaultValue={settings.whatsappNumber} className="admin-input" />
                </Field>
                <Field label="Pre-filled message" htmlFor="whatsappMessage" required>
                  <input id="whatsappMessage" name="whatsappMessage" required defaultValue={settings.whatsappMessage} className="admin-input" />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Welcome tooltip message" htmlFor="whatsappWelcomeMessage" required>
                  <textarea id="whatsappWelcomeMessage" name="whatsappWelcomeMessage" required defaultValue={settings.whatsappWelcomeMessage} className="admin-textarea min-h-[80px]" />
                </Field>
              </div>
              <a
                href={whatsAppLink(settings.whatsappNumber, settings.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-gold-700 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Test current WhatsApp link ({whatsAppDisplay(settings.whatsappNumber)})
              </a>
            </FormSection>

            <div className="mt-6">
              <FormSection
                title="Chatbot"
                description="The website assistant uses published services and FAQs as its approved knowledge base."
              >
                <CheckboxField
                  label="Enable chat assistant"
                  name="chatbotEnabled"
                  defaultChecked={settings.chatbotEnabled}
                  hint="Shows the floating chat button on all public pages."
                />
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Operating mode" htmlFor="chatbotMode" hint="Demo replies are always rule-based. AI mode is not connected to a provider in this deployment.">
                    <select id="chatbotMode" name="chatbotMode" defaultValue={settings.chatbotMode} className="admin-input">
                      <option value="FAQ">FAQ / rule-based only</option>
                      <option value="HUMAN">Human handoff only</option>
                      <option value="AI">AI label (not connected in demo)</option>
                    </select>
                  </Field>
                  <Field label="Demo mode label" htmlFor="chatbotModel" hint="Display-only value. No model provider is called.">
                    <input id="chatbotModel" name="chatbotModel" required defaultValue={settings.chatbotModel} className="admin-input" />
                  </Field>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Welcome message (English)" htmlFor="chatbotWelcomeEn" required>
                    <textarea id="chatbotWelcomeEn" name="chatbotWelcomeEn" required defaultValue={settings.chatbotWelcomeEn} className="admin-textarea" />
                  </Field>
                  <Field label="Welcome message (Telugu)" htmlFor="chatbotWelcomeTe" required>
                    <textarea id="chatbotWelcomeTe" name="chatbotWelcomeTe" required defaultValue={settings.chatbotWelcomeTe} className="admin-textarea" />
                  </Field>
                </div>
                <div className="mt-5">
                  <Field
                    label="Additional system instructions (optional)"
                    htmlFor="chatbotSystemPrompt"
                    hint="Appended to the fixed safety prompt. Do not add claims, fee amounts or legal/tax positions."
                  >
                    <textarea
                      id="chatbotSystemPrompt"
                      name="chatbotSystemPrompt"
                      defaultValue={settings.chatbotSystemPrompt ?? ""}
                      className="admin-textarea min-h-[100px]"
                    />
                  </Field>
                </div>
                <div className="mt-6 flex justify-end">
                  <SubmitButton pendingLabel="Saving messaging settings…">
                    <Save className="h-4 w-4" />
                    Save WhatsApp & chatbot
                  </SubmitButton>
                </div>
              </FormSection>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-600" />
              <p className="text-[0.72rem] font-semibold text-navy-900">Demo chatbot</p>
            </div>
            <p className="mt-2 text-[0.72rem] leading-6 text-navy-500">
              This deployment uses deterministic, rule-based sample answers. It makes no external AI
              request and reads no provider API key.
            </p>
            <p className="mt-3 text-[0.68rem] leading-5 text-navy-400">
              AI mode is intentionally disabled in the database-free demo. A live deployment would
              need a reviewed provider integration, output safeguards and an explicit privacy notice.
            </p>
          </div>
          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <p className="text-[0.72rem] font-semibold text-navy-900">Privacy reminder</p>
            <p className="mt-2 text-[0.7rem] leading-6 text-navy-500">
              Chat text is kept in the visitor's browser local storage for this demo. No transcript
              or lead details are sent to the server for storage.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
