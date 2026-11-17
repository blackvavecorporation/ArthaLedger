// Database-free demo repository.
//
// The original application used Prisma + PostgreSQL. This module provides only
// the query methods the existing pages call, backed by the hardcoded arrays in
// src/data. Writes are kept in process memory for the current demo session and
// are lost on reload/restart. No DATABASE_URL is read and no database client is
// imported.

import {
  demoAdminUser,
  demoAppointments,
  demoAuditLogs,
  demoChatMessages,
  demoConversations,
  demoCategories,
  demoEnquiries,
  demoExpertiseItems,
  demoFaqs,
  demoHomeContent,
  demoAboutContent,
  demoLegalPages,
  demoMedia,
  demoNavItems,
  demoRoles,
  demoSeoSettings,
  demoServices,
  demoSocialLinks,
  demoStats,
  demoTestimonials,
  demoValueItems,
  demoWebsiteSettings,
  demoWhyChooseItems,
} from "@/data/site";
import type {
  AdminUser,
  AppointmentRequest,
  AuditLog,
  ChatConversation,
  ChatMessage,
  ContactEnquiry,
  FAQ,
  LegalPage,
  Media,
  Service,
  ServiceCategory,
  Testimonial,
} from "@/lib/demo-types";

type Row = Record<string, any>;
type Query = {
  where?: Record<string, any>;
  orderBy?: Record<string, any> | Record<string, any>[];
  take?: number;
  skip?: number;
  select?: Record<string, unknown>;
  include?: Record<string, any>;
};
type ModelName =
  | "adminUser"
  | "role"
  | "websiteSettings"
  | "navItem"
  | "socialLink"
  | "homePageContent"
  | "aboutPageContent"
  | "stat"
  | "whyChooseItem"
  | "expertiseItem"
  | "valueItem"
  | "teamMember"
  | "serviceCategory"
  | "service"
  | "testimonial"
  | "fAQ"
  | "contactEnquiry"
  | "appointmentRequest"
  | "chatConversation"
  | "chatMessage"
  | "legalPage"
  | "sEOSettings"
  | "media"
  | "auditLog";

type Store = Record<ModelName, Row[]>;

function clone<T>(value: T): T {
  return structuredClone(value);
}

function createStore(): Store {
  return {
    adminUser: clone([demoAdminUser]) as Row[],
    role: clone(demoRoles) as Row[],
    websiteSettings: clone([demoWebsiteSettings]) as Row[],
    navItem: clone(demoNavItems) as Row[],
    socialLink: clone(demoSocialLinks) as Row[],
    homePageContent: clone([demoHomeContent]) as Row[],
    aboutPageContent: clone([demoAboutContent]) as Row[],
    stat: clone(demoStats) as Row[],
    whyChooseItem: clone(demoWhyChooseItems) as Row[],
    expertiseItem: clone(demoExpertiseItems) as Row[],
    valueItem: clone(demoValueItems) as Row[],
    teamMember: [] as Row[],
    serviceCategory: clone(demoCategories) as Row[],
    service: clone(demoServices) as Row[],
    testimonial: clone(demoTestimonials) as Row[],
    fAQ: clone(demoFaqs) as Row[],
    contactEnquiry: clone(demoEnquiries) as Row[],
    appointmentRequest: clone(demoAppointments) as Row[],
    chatConversation: clone(demoConversations) as Row[],
    chatMessage: clone(demoChatMessages) as Row[],
    legalPage: clone(demoLegalPages) as Row[],
    sEOSettings: clone([demoSeoSettings]) as Row[],
    media: clone(demoMedia) as Row[],
    auditLog: clone(demoAuditLogs) as Row[],
  };
}

const globalStore = globalThis as typeof globalThis & { __arthaLedgerDemoStore?: Store };
const store = (globalStore.__arthaLedgerDemoStore ??= createStore());

function relation(model: ModelName, row: Row): Row {
  const copy: Row = { ...row };
  if (model === "service") {
    copy.category = store.serviceCategory.find((category) => category.id === row.categoryId) ?? null;
  }
  if (model === "serviceCategory") {
    copy._count = {
      services: store.service.filter((service) => service.categoryId === row.id).length,
    };
  }
  if (model === "adminUser") {
    copy.role = store.role.find((role) => role.id === row.roleId) ?? demoRoles[0];
  }
  if (model === "contactEnquiry") {
    copy.service = store.service.find((service) => service.id === row.serviceId) ?? null;
    copy.conversation = row.conversationId ? { id: row.conversationId } : null;
  }
  if (model === "appointmentRequest") {
    copy.service = store.service.find((service) => service.id === row.serviceId) ?? null;
  }
  if (model === "chatConversation") {
    copy.messages = store.chatMessage.filter((message) => message.conversationId === row.id);
    copy.enquiries = store.contactEnquiry.filter((enquiry) => enquiry.conversationId === row.id);
    copy._count = { messages: copy.messages.length, enquiries: copy.enquiries.length };
  }
  if (model === "auditLog" && row.userId) {
    const user = store.adminUser.find((item) => item.id === row.userId);
    copy.user = user ? { name: user.name, email: user.email } : null;
  }
  return copy;
}

function valueMatches(actual: unknown, expected: unknown): boolean {
  if (expected instanceof Date) {
    return actual instanceof Date
      ? actual.getTime() === expected.getTime()
      : new Date(String(actual)).getTime() === expected.getTime();
  }
  if (Array.isArray(expected)) return expected.some((item) => valueMatches(actual, item));
  if (expected && typeof expected === "object") {
    const condition = expected as Record<string, any>;
    for (const [operator, value] of Object.entries(condition)) {
      if (operator === "equals") {
        if (!valueMatches(actual, value)) return false;
      } else if (operator === "not") {
        if (valueMatches(actual, value)) return false;
      } else if (operator === "in") {
        if (!Array.isArray(value) || !value.some((item) => valueMatches(actual, item))) return false;
      } else if (operator === "contains") {
        const haystack = String(actual ?? "").toLowerCase();
        const needle = String(value ?? "").toLowerCase();
        if (!haystack.includes(needle)) return false;
      } else if (operator === "gte") {
        if (new Date(String(actual)).getTime() < new Date(String(value)).getTime()) return false;
      } else if (operator === "lte") {
        if (new Date(String(actual)).getTime() > new Date(String(value)).getTime()) return false;
      } else if (operator === "gt") {
        if (new Date(String(actual)).getTime() <= new Date(String(value)).getTime()) return false;
      } else if (operator === "lt") {
        if (new Date(String(actual)).getTime() >= new Date(String(value)).getTime()) return false;
      } else if (operator === "mode") {
        // Case-insensitive matching is always used for string contains operations.
      } else if (!matches(actual as Row, { [operator]: value })) {
        return false;
      }
    }
    return true;
  }
  if (actual instanceof Date) {
    return actual.getTime() === new Date(String(expected)).getTime();
  }
  if (expected && typeof expected === "object" && actual && typeof actual === "object") {
    return matches(actual as Row, expected as Row);
  }
  return actual === expected;
}

function matches(row: Row, where?: Record<string, any>): boolean {
  if (!where) return true;
  for (const [key, expected] of Object.entries(where)) {
    if (key === "AND") {
      if (!Array.isArray(expected) || !expected.every((part) => matches(row, part))) return false;
      continue;
    }
    if (key === "OR") {
      if (!Array.isArray(expected) || !expected.some((part) => matches(row, part))) return false;
      continue;
    }
    if (key === "NOT") {
      if (matches(row, expected as Record<string, any>)) return false;
      continue;
    }
    if (!valueMatches(row[key], expected)) return false;
  }
  return true;
}

function sortRows(rows: Row[], orderBy?: Query["orderBy"]) {
  if (!orderBy) return rows;
  const clauses = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...rows].sort((a, b) => {
    for (const clause of clauses) {
      for (const [key, direction] of Object.entries(clause)) {
        const left = a[key];
        const right = b[key];
        if (left === right) continue;
        if (left === null || left === undefined) return direction === "desc" ? 1 : -1;
        if (right === null || right === undefined) return direction === "desc" ? -1 : 1;
        const leftValue = left instanceof Date ? left.getTime() : left;
        const rightValue = right instanceof Date ? right.getTime() : right;
        const comparison = leftValue < rightValue ? -1 : 1;
        return direction === "desc" ? -comparison : comparison;
      }
    }
    return 0;
  });
}

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

function modelApi(name: ModelName) {
  const rows = () => store[name];
  const decorate = (row: Row) => relation(name, row);

  function findMany(query: Query = {}): any[] {
    const filtered = rows().filter((row) => matches(decorate(row), query.where));
    const sorted = sortRows(filtered, query.orderBy);
    const start = query.skip ?? 0;
    const end = query.take === undefined ? undefined : start + query.take;
    return sorted.slice(start, end).map(decorate);
  }

  function findFirst(query: Query = {}): any | null {
    return findMany({ ...query, take: 1 })[0] ?? null;
  }

  function create(args: { data: Row; select?: unknown; include?: unknown }): any {
    const data = { ...args.data };
    const timestamp = new Date();
    if (!data.id) data.id = nextId(name);
    if (!data.createdAt) data.createdAt = timestamp;
    if (!data.updatedAt) data.updatedAt = timestamp;
    rows().push(data);
    return decorate(data);
  }

  function update(args: { where: Record<string, any>; data: Row; select?: unknown; include?: unknown }): any {
    const index = rows().findIndex((row) => matches(decorate(row), args.where));
    if (index < 0) throw new Error(`${name} record not found`);
    const current = rows()[index];
    const updated = { ...current, ...args.data, updatedAt: new Date() };
    rows()[index] = updated;
    return decorate(updated);
  }

  function upsert(args: {
    where: Record<string, any>;
    update: Row;
    create: Row;
  }): any {
    const existing = findFirst({ where: args.where });
    if (existing) return update({ where: args.where, data: args.update });
    return create({ data: args.create });
  }

  function remove(args: { where: Record<string, any> }): any {
    const index = rows().findIndex((row) => matches(decorate(row), args.where));
    if (index < 0) throw new Error(`${name} record not found`);
    const [removed] = rows().splice(index, 1);
    if (name === "chatConversation") {
      store.chatMessage = store.chatMessage.filter((message) => message.conversationId !== removed.id);
      store.contactEnquiry = store.contactEnquiry.map((enquiry) =>
        enquiry.conversationId === removed.id ? { ...enquiry, conversationId: null } : enquiry,
      );
    }
    if (name === "serviceCategory") {
      store.service = store.service.map((service) =>
        service.categoryId === removed.id ? { ...service, categoryId: null } : service,
      );
    }
    return decorate(removed);
  }

  return {
    findMany: async (query?: Query) => findMany(query),
    findFirst: async (query?: Query) => findFirst(query),
    findUnique: async (query?: Query) => findFirst(query),
    create: async (args: { data: Row; select?: unknown; include?: unknown }) => create(args),
    update: async (args: { where: Record<string, any>; data: Row; select?: unknown; include?: unknown }) =>
      update(args),
    upsert: async (args: { where: Record<string, any>; update: Row; create: Row }) => upsert(args),
    delete: async (args: { where: Record<string, any> }) => remove(args),
    deleteMany: async (query: Query = {}) => {
      const target = rows().filter((row) => matches(decorate(row), query.where));
      store[name] = rows().filter((row) => !target.includes(row));
      return { count: target.length };
    },
    createMany: async (args: { data: Row[] }) => {
      for (const item of args.data) create({ data: item });
      return { count: args.data.length };
    },
    count: async (query: Query = {}) =>
      rows().filter((row) => matches(decorate(row), query.where)).length,
    groupBy: async (query: Query & { by: string[]; _count?: Record<string, unknown> }): Promise<any[]> => {
      const groups = new Map<string, { key: Row; count: number }>();
      for (const row of rows().filter((item) => matches(decorate(item), query.where))) {
        const key: Row = {};
        for (const field of query.by) key[field] = row[field];
        const serialized = JSON.stringify(key);
        const existing = groups.get(serialized);
        if (existing) existing.count += 1;
        else groups.set(serialized, { key, count: 1 });
      }
      return [...groups.values()].map(({ key, count }) => ({
        ...key,
        _count: { _all: count },
      }));
    },
  };
}

export const db = {
  adminUser: modelApi("adminUser"),
  role: modelApi("role"),
  websiteSettings: modelApi("websiteSettings"),
  navItem: modelApi("navItem"),
  socialLink: modelApi("socialLink"),
  homePageContent: modelApi("homePageContent"),
  aboutPageContent: modelApi("aboutPageContent"),
  stat: modelApi("stat"),
  whyChooseItem: modelApi("whyChooseItem"),
  expertiseItem: modelApi("expertiseItem"),
  valueItem: modelApi("valueItem"),
  teamMember: modelApi("teamMember"),
  serviceCategory: modelApi("serviceCategory"),
  service: modelApi("service"),
  testimonial: modelApi("testimonial"),
  fAQ: modelApi("fAQ"),
  contactEnquiry: modelApi("contactEnquiry"),
  appointmentRequest: modelApi("appointmentRequest"),
  chatConversation: modelApi("chatConversation"),
  chatMessage: modelApi("chatMessage"),
  legalPage: modelApi("legalPage"),
  sEOSettings: modelApi("sEOSettings"),
  media: modelApi("media"),
  auditLog: modelApi("auditLog"),
};

// These exports keep the data layer explicit and useful for demo tooling.
export const demoStore = store;
export type { AdminUser, AppointmentRequest, AuditLog, ChatConversation, ContactEnquiry, FAQ, LegalPage, Media, Service, ServiceCategory, Testimonial };
