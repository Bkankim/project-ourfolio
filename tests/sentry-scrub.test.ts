import { describe, it, expect } from "vitest";
import { scrubPII } from "@/lib/sentry-scrub";

describe("scrubPII", () => {
  it("redacts request.data PII but preserves non-PII fields", () => {
    const event = scrubPII({
      request: {
        data: {
          senderEmail: "jane@example.com",
          senderName: "Jane Doe",
          message: "Hire me please",
          projectId: "proj-123",
        },
      },
    });
    const data = event.request!.data as Record<string, unknown>;
    expect(data.senderEmail).toBe("[redacted]");
    expect(data.senderName).toBe("[redacted]");
    expect(data.message).toBe("[redacted]");
    expect(data.projectId).toBe("proj-123");
  });

  it("removes authorization + cookie headers", () => {
    const event = scrubPII({
      request: {
        headers: {
          authorization: "Bearer secret",
          cookie: "session=abc",
          "x-trace": "keep-me",
        },
      },
    });
    const headers = event.request!.headers as Record<string, unknown>;
    expect(headers.authorization).toBeUndefined();
    expect(headers.cookie).toBeUndefined();
    expect(headers["x-trace"]).toBe("keep-me");
  });

  it("removes request.cookies", () => {
    const event = scrubPII({
      request: {
        cookies: { session: "abc" },
      },
    });
    expect(event.request!.cookies).toBeUndefined();
  });

  it("removes user PII but keeps user.id", () => {
    const event = scrubPII({
      user: {
        id: "user-1",
        email: "jane@example.com",
        username: "jane",
        ip_address: "1.2.3.4",
      },
    });
    expect(event.user!.id).toBe("user-1");
    expect(event.user!.email).toBeUndefined();
    expect(event.user!.username).toBeUndefined();
    expect(event.user!.ip_address).toBeUndefined();
  });

  it("redacts nested object and array PII", () => {
    const event = scrubPII({
      request: {
        data: {
          nested: {
            senderEmail: "deep@example.com",
            keep: "ok",
          },
          list: [
            { message: "secret", id: 1 },
            { name: "Bob", id: 2 },
          ],
        },
      },
    });
    const data = event.request!.data as {
      nested: Record<string, unknown>;
      list: Array<Record<string, unknown>>;
    };
    expect(data.nested.senderEmail).toBe("[redacted]");
    expect(data.nested.keep).toBe("ok");
    expect(data.list[0].message).toBe("[redacted]");
    expect(data.list[0].id).toBe(1);
    expect(data.list[1].name).toBe("[redacted]");
    expect(data.list[1].id).toBe(2);
  });
});
