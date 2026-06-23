import { describe, it, expect } from "vitest";
import {
  contactFormSchema,
  createProjectSchema,
  updateProfileSchema,
} from "@/lib/validations";

describe("contactFormSchema (lead/contact submit) consent gate", () => {
  const base = {
    senderName: "Jane Doe",
    senderEmail: "jane@example.com",
    message: "I would like to hire you.",
    inquiryType: "hiring" as const,
  };

  it("rejects when privacyConsent is false", () => {
    const result = contactFormSchema.safeParse({ ...base, privacyConsent: false });
    expect(result.success).toBe(false);
  });

  it("rejects when privacyConsent is missing", () => {
    const result = contactFormSchema.safeParse({ ...base });
    expect(result.success).toBe(false);
  });

  it("accepts a valid submission with privacyConsent true", () => {
    const result = contactFormSchema.safeParse({ ...base, privacyConsent: true });
    expect(result.success).toBe(true);
  });

  it("accepts each allowed inquiryType", () => {
    for (const inquiryType of ["hiring", "collab", "other"] as const) {
      const result = contactFormSchema.safeParse({
        ...base,
        inquiryType,
        privacyConsent: true,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts when inquiryType is omitted (optional)", () => {
    const { inquiryType: _omit, ...withoutInquiry } = base;
    const result = contactFormSchema.safeParse({
      ...withoutInquiry,
      privacyConsent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid inquiryType", () => {
    const result = contactFormSchema.safeParse({
      ...base,
      inquiryType: "spam",
      privacyConsent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({
      ...base,
      senderEmail: "not-an-email",
      privacyConsent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty senderName", () => {
    const result = contactFormSchema.safeParse({
      ...base,
      senderName: "",
      privacyConsent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = contactFormSchema.safeParse({
      ...base,
      message: "",
      privacyConsent: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("createProjectSchema field contracts", () => {
  it("accepts a project with role/stack/bodyMarkdown/demoUrl/repoUrl", () => {
    const result = createProjectSchema.safeParse({
      title: "My Project",
      role: "Lead Engineer",
      stack: ["TypeScript", "Next.js"],
      bodyMarkdown: "# Heading\n\nSome body content.",
      demoUrl: "https://demo.example.com",
      repoUrl: "https://github.com/example/repo",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createProjectSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing title", () => {
    const result = createProjectSchema.safeParse({ role: "Designer" });
    expect(result.success).toBe(false);
  });
});

describe("updateProfileSchema field contracts", () => {
  it("accepts skills array and resumeUrl", () => {
    const result = updateProfileSchema.safeParse({
      skills: ["React", "Node", "SQL"],
      resumeUrl: "https://example.com/resume.pdf",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid resumeUrl", () => {
    const result = updateProfileSchema.safeParse({
      skills: ["React"],
      resumeUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
