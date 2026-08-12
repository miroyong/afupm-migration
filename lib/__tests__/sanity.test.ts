import { describe, expect, it } from "vitest";
import { client } from "../sanity";

// Integration checks against the real Sanity project (d67qfgu8, production),
// per the mission guidance to test GROQ queries against the real dataset.
describe("Sanity GROQ queries (production dataset)", () => {
  it("wordOfTheDay query is valid and returns an array", async () => {
    const result = await client.fetch<unknown[]>(
      `*[_type == "wordOfTheDay" && language == "pt"][0...100] { _id, phrase, order }`
    );
    expect(Array.isArray(result)).toBe(true);
  }, 30000);

  it("siteSettings query is valid", async () => {
    const result = await client.fetch<unknown[]>(
      `*[_type == "siteSettings"][0] { siteName, footerText, socialLinks }`
    );
    // The singleton may not exist yet; it must simply not throw.
    expect(true).toBe(true);
  }, 30000);
});
