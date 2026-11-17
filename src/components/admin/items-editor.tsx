import type { NavItem, SocialLink, Stat, TeamMember, ValueItem, WhyChooseItem, ExpertiseItem } from "@prisma/client";
import { ChevronDown, Plus } from "lucide-react";
import {
  deleteContentItem,
  deleteNavItem,
  deleteSocialLink,
  deleteStat,
  deleteTeamMember,
  saveContentItem,
  saveNavItem,
  saveSocialLink,
  saveStat,
  saveTeamMember,
} from "@/actions/structure";
import { CheckboxField, Field, FormSection } from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ICON_NAMES } from "@/components/icon";

function Disclosure({
  title,
  meta,
  children,
  defaultOpen = false,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group rounded-lg border border-navy-100 bg-white" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="text-[0.8rem] font-medium text-navy-800">{title}</span>
        <span className="flex items-center gap-2 text-[0.62rem] text-navy-300">
          {meta}
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-navy-100 p-4">{children}</div>
    </details>
  );
}

function RowActions({ formId, children }: { formId: string; children?: React.ReactNode }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-navy-100 pt-3">
      {children}
      <SubmitButton form={formId} size="sm" pendingLabel="Saving…">
        Save
      </SubmitButton>
    </div>
  );
}

export function StatsEditor({ items }: { items: Stat[] }) {
  return (
    <FormSection
      id="statistics"
      title="Statistics band"
      description="Displayed beneath the homepage hero. Use honest, supportable figures and descriptors only."
    >
      <div className="space-y-3">
        {items.map((item) => {
          const formId = `stat-${item.id}`;
          return (
            <Disclosure key={item.id} title={`${item.value} — ${item.label}`} meta={item.isVisible ? "Visible" : "Hidden"}>
              <form id={formId} action={saveStat} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_7rem]">
                  <Field label="Value" htmlFor={`stat-value-${item.id}`}>
                    <input id={`stat-value-${item.id}`} name="value" required defaultValue={item.value} className="admin-input" />
                  </Field>
                  <Field label="Label" htmlFor={`stat-label-${item.id}`}>
                    <input id={`stat-label-${item.id}`} name="label" required defaultValue={item.label} className="admin-input" />
                  </Field>
                  <Field label="Order" htmlFor={`stat-order-${item.id}`}>
                    <input id={`stat-order-${item.id}`} name="order" type="number" min={0} max={999} defaultValue={item.order} className="admin-input" />
                  </Field>
                </div>
                <Field label="Description (optional)" htmlFor={`stat-description-${item.id}`}>
                  <input id={`stat-description-${item.id}`} name="description" defaultValue={item.description ?? ""} className="admin-input" />
                </Field>
                <CheckboxField label="Visible" name="isVisible" defaultChecked={item.isVisible} />
              </form>
              <RowActions formId={formId}>
                <DeleteButton action={deleteStat} id={item.id} name={`${item.value} ${item.label}`} compact />
              </RowActions>
            </Disclosure>
          );
        })}
      </div>

      <Disclosure title="Add statistic" meta="New">
        <form action={saveStat} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_7rem]">
            <Field label="Value" htmlFor="new-stat-value">
              <input id="new-stat-value" name="value" required className="admin-input" placeholder="16+" />
            </Field>
            <Field label="Label" htmlFor="new-stat-label">
              <input id="new-stat-label" name="label" required className="admin-input" placeholder="Professional service lines" />
            </Field>
            <Field label="Order" htmlFor="new-stat-order">
              <input id="new-stat-order" name="order" type="number" min={0} max={999} defaultValue={items.length + 1} className="admin-input" />
            </Field>
          </div>
          <CheckboxField label="Visible" name="isVisible" defaultChecked />
          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Adding…">
              <Plus className="h-3.5 w-3.5" />
              Add statistic
            </SubmitButton>
          </div>
        </form>
      </Disclosure>
    </FormSection>
  );
}

type ContentItem = WhyChooseItem | ExpertiseItem | ValueItem;

export function ContentItemsEditor({
  kind,
  items,
  title,
  description,
}: {
  kind: "why" | "expertise" | "value";
  items: ContentItem[];
  title: string;
  description: string;
}) {
  return (
    <FormSection title={title} description={description}>
      <div className="space-y-3">
        {items.map((item) => {
          const formId = `${kind}-${item.id}`;
          return (
            <Disclosure key={item.id} title={item.title} meta={item.isVisible ? "Visible" : "Hidden"}>
              <form id={formId} action={saveContentItem} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="kind" value={kind} />
                <div className="grid gap-4 md:grid-cols-[1fr_12rem_6rem]">
                  <Field label="Title" htmlFor={`${kind}-title-${item.id}`}>
                    <input id={`${kind}-title-${item.id}`} name="title" required defaultValue={item.title} className="admin-input" />
                  </Field>
                  <Field label="Icon" htmlFor={`${kind}-icon-${item.id}`}>
                    <select id={`${kind}-icon-${item.id}`} name="icon" defaultValue={item.icon} className="admin-input">
                      {ICON_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Order" htmlFor={`${kind}-order-${item.id}`}>
                    <input id={`${kind}-order-${item.id}`} name="order" type="number" min={0} max={999} defaultValue={item.order} className="admin-input" />
                  </Field>
                </div>
                <Field label="Description" htmlFor={`${kind}-description-${item.id}`}>
                  <textarea id={`${kind}-description-${item.id}`} name="description" required defaultValue={item.description} className="admin-textarea min-h-[80px]" />
                </Field>
                <CheckboxField label="Visible on website" name="isVisible" defaultChecked={item.isVisible} />
              </form>
              <RowActions formId={formId}>
                <DeleteButton
                  action={deleteContentItem}
                  id={item.id}
                  name={item.title}
                  extraFields={{ kind }}
                  compact
                />
              </RowActions>
            </Disclosure>
          );
        })}
      </div>

      <Disclosure title="Add item" meta="New">
        <form action={saveContentItem} className="space-y-4">
          <input type="hidden" name="kind" value={kind} />
          <div className="grid gap-4 md:grid-cols-[1fr_12rem_6rem]">
            <Field label="Title" htmlFor={`new-${kind}-title`}>
              <input id={`new-${kind}-title`} name="title" required className="admin-input" />
            </Field>
            <Field label="Icon" htmlFor={`new-${kind}-icon`}>
              <select id={`new-${kind}-icon`} name="icon" defaultValue="ShieldCheck" className="admin-input">
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Order" htmlFor={`new-${kind}-order`}>
              <input id={`new-${kind}-order`} name="order" type="number" min={0} max={999} defaultValue={items.length + 1} className="admin-input" />
            </Field>
          </div>
          <Field label="Description" htmlFor={`new-${kind}-description`}>
            <textarea id={`new-${kind}-description`} name="description" required className="admin-textarea min-h-[80px]" />
          </Field>
          <CheckboxField label="Visible on website" name="isVisible" defaultChecked />
          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Adding…">
              <Plus className="h-3.5 w-3.5" />
              Add item
            </SubmitButton>
          </div>
        </form>
      </Disclosure>
    </FormSection>
  );
}

export function TeamEditor({ members }: { members: TeamMember[] }) {
  return (
    <FormSection
      title="Team members"
      description="Only add real team members with their consent. Do not list qualifications or designations that cannot be substantiated. If empty, the team section is hidden on the About page."
    >
      <div className="space-y-3">
        {members.map((member) => {
          const formId = `team-${member.id}`;
          return (
            <Disclosure key={member.id} title={`${member.name} — ${member.designation}`} meta={member.isVisible ? "Visible" : "Hidden"}>
              <form id={formId} action={saveTeamMember} className="space-y-4">
                <input type="hidden" name="id" value={member.id} />
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_6rem]">
                  <Field label="Name" htmlFor={`team-name-${member.id}`}>
                    <input id={`team-name-${member.id}`} name="name" required defaultValue={member.name} className="admin-input" />
                  </Field>
                  <Field label="Designation" htmlFor={`team-designation-${member.id}`}>
                    <input id={`team-designation-${member.id}`} name="designation" required defaultValue={member.designation} className="admin-input" />
                  </Field>
                  <Field label="Order" htmlFor={`team-order-${member.id}`}>
                    <input id={`team-order-${member.id}`} name="order" type="number" min={0} max={999} defaultValue={member.order} className="admin-input" />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Qualifications (optional)" htmlFor={`team-qualifications-${member.id}`}>
                    <input id={`team-qualifications-${member.id}`} name="qualifications" defaultValue={member.qualifications ?? ""} className="admin-input" />
                  </Field>
                  <Field label="LinkedIn URL (optional)" htmlFor={`team-linkedin-${member.id}`}>
                    <input id={`team-linkedin-${member.id}`} name="linkedinUrl" defaultValue={member.linkedinUrl ?? ""} className="admin-input" />
                  </Field>
                </div>
                <Field label="Short bio (optional)" htmlFor={`team-bio-${member.id}`}>
                  <textarea id={`team-bio-${member.id}`} name="bio" defaultValue={member.bio ?? ""} className="admin-textarea min-h-[80px]" />
                </Field>
                <ImageField name="imageUrl" label="Photo (optional)" defaultValue={member.imageUrl} />
                <CheckboxField label="Visible on website" name="isVisible" defaultChecked={member.isVisible} />
              </form>
              <RowActions formId={formId}>
                <DeleteButton action={deleteTeamMember} id={member.id} name={member.name} compact />
              </RowActions>
            </Disclosure>
          );
        })}
      </div>

      <Disclosure title="Add team member" meta="New">
        <form action={saveTeamMember} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" htmlFor="new-team-name">
              <input id="new-team-name" name="name" required className="admin-input" />
            </Field>
            <Field label="Designation" htmlFor="new-team-designation">
              <input id="new-team-designation" name="designation" required className="admin-input" />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Qualifications (optional)" htmlFor="new-team-qualifications">
              <input id="new-team-qualifications" name="qualifications" className="admin-input" />
            </Field>
            <Field label="LinkedIn URL (optional)" htmlFor="new-team-linkedin">
              <input id="new-team-linkedin" name="linkedinUrl" className="admin-input" />
            </Field>
          </div>
          <Field label="Short bio (optional)" htmlFor="new-team-bio">
            <textarea id="new-team-bio" name="bio" className="admin-textarea min-h-[80px]" />
          </Field>
          <ImageField name="imageUrl" label="Photo (optional)" />
          <Field label="Order" htmlFor="new-team-order">
            <input id="new-team-order" name="order" type="number" min={0} max={999} defaultValue={members.length + 1} className="admin-input" />
          </Field>
          <CheckboxField label="Visible on website" name="isVisible" defaultChecked />
          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Adding…">
              <Plus className="h-3.5 w-3.5" />
              Add team member
            </SubmitButton>
          </div>
        </form>
      </Disclosure>
    </FormSection>
  );
}

export function NavEditor({ items, location }: { items: NavItem[]; location: "HEADER" | "FOOTER" }) {
  return (
    <FormSection
      title={location === "HEADER" ? "Header navigation links" : "Footer navigation links"}
      description={
        location === "HEADER"
          ? "These links appear in the main navigation. The Login link and consultation button are fixed interface elements and are always present."
          : "These links appear in the footer. Legal links are also pulled from the published legal pages shown in this list."
      }
    >
      <div className="space-y-3">
        {items.map((item) => {
          const formId = `nav-${item.id}`;
          return (
            <Disclosure key={item.id} title={item.label} meta={item.isVisible ? "Visible" : "Hidden"}>
              <form id={formId} action={saveNavItem} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="location" value={location} />
                <div className="grid gap-4 md:grid-cols-[1fr_1.4fr_6rem]">
                  <Field label="Label" htmlFor={`nav-label-${item.id}`}>
                    <input id={`nav-label-${item.id}`} name="label" required defaultValue={item.label} className="admin-input" />
                  </Field>
                  <Field label="Link" htmlFor={`nav-href-${item.id}`}>
                    <input id={`nav-href-${item.id}`} name="href" required defaultValue={item.href} className="admin-input" />
                  </Field>
                  <Field label="Order" htmlFor={`nav-order-${item.id}`}>
                    <input id={`nav-order-${item.id}`} name="order" type="number" min={0} max={999} defaultValue={item.order} className="admin-input" />
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CheckboxField label="Visible" name="isVisible" defaultChecked={item.isVisible} />
                  <CheckboxField label="External link" name="isExternal" defaultChecked={item.isExternal} />
                </div>
              </form>
              <RowActions formId={formId}>
                <DeleteButton action={deleteNavItem} id={item.id} name={item.label} compact />
              </RowActions>
            </Disclosure>
          );
        })}
      </div>

      <Disclosure title="Add navigation link" meta="New">
        <form action={saveNavItem} className="space-y-4">
          <input type="hidden" name="location" value={location} />
          <div className="grid gap-4 md:grid-cols-[1fr_1.4fr_6rem]">
            <Field label="Label" htmlFor="new-nav-label">
              <input id="new-nav-label" name="label" required className="admin-input" />
            </Field>
            <Field label="Link" htmlFor="new-nav-href">
              <input id="new-nav-href" name="href" required className="admin-input" placeholder="/contact" />
            </Field>
            <Field label="Order" htmlFor="new-nav-order">
              <input id="new-nav-order" name="order" type="number" min={0} max={999} defaultValue={items.length + 1} className="admin-input" />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <CheckboxField label="Visible" name="isVisible" defaultChecked />
            <CheckboxField label="External link" name="isExternal" />
          </div>
          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Adding…">
              <Plus className="h-3.5 w-3.5" />
              Add link
            </SubmitButton>
          </div>
        </form>
      </Disclosure>
    </FormSection>
  );
}

export function SocialEditor({ items }: { items: SocialLink[] }) {
  return (
    <FormSection title="Social links" description="Visible social profiles shown in the footer. Only add accounts owned by the firm.">
      <div className="space-y-3">
        {items.map((item) => {
          const formId = `social-${item.id}`;
          return (
            <Disclosure key={item.id} title={`${item.platform} — ${item.url}`} meta={item.isVisible ? "Visible" : "Hidden"}>
              <form id={formId} action={saveSocialLink} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-4 md:grid-cols-[1fr_2fr_6rem]">
                  <Field label="Platform" htmlFor={`social-platform-${item.id}`}>
                    <input id={`social-platform-${item.id}`} name="platform" required defaultValue={item.platform} className="admin-input" />
                  </Field>
                  <Field label="URL" htmlFor={`social-url-${item.id}`}>
                    <input id={`social-url-${item.id}`} name="url" type="url" required defaultValue={item.url} className="admin-input" />
                  </Field>
                  <Field label="Order" htmlFor={`social-order-${item.id}`}>
                    <input id={`social-order-${item.id}`} name="order" type="number" min={0} max={999} defaultValue={item.order} className="admin-input" />
                  </Field>
                </div>
                <CheckboxField label="Visible" name="isVisible" defaultChecked={item.isVisible} />
              </form>
              <RowActions formId={formId}>
                <DeleteButton action={deleteSocialLink} id={item.id} name={item.platform} compact />
              </RowActions>
            </Disclosure>
          );
        })}
      </div>

      <Disclosure title="Add social link" meta="New">
        <form action={saveSocialLink} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_2fr_6rem]">
            <Field label="Platform" htmlFor="new-social-platform">
              <input id="new-social-platform" name="platform" required className="admin-input" placeholder="LinkedIn" />
            </Field>
            <Field label="URL" htmlFor="new-social-url">
              <input id="new-social-url" name="url" type="url" required className="admin-input" placeholder="https://www.linkedin.com/company/…" />
            </Field>
            <Field label="Order" htmlFor="new-social-order">
              <input id="new-social-order" name="order" type="number" min={0} max={999} defaultValue={items.length + 1} className="admin-input" />
            </Field>
          </div>
          <CheckboxField label="Visible" name="isVisible" defaultChecked />
          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Adding…">
              <Plus className="h-3.5 w-3.5" />
              Add social link
            </SubmitButton>
          </div>
        </form>
      </Disclosure>
    </FormSection>
  );
}
