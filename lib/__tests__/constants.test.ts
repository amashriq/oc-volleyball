import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants";

describe("SITE_URL", () => {
  it("is the production apex domain over https, with no trailing slash", () => {
    expect(SITE_URL).toBe("https://oc-volleyball.com");
  });

  it("is a valid URL", () => {
    expect(() => new URL(SITE_URL)).not.toThrow();
  });
});

describe("DEFAULT_OG_IMAGE", () => {
  it("points at the site's default Open Graph image", () => {
    expect(DEFAULT_OG_IMAGE.url).toBe("/images/logo/opengraph-image.jpg");
  });

  it("uses the standard 1200x630 Open Graph aspect ratio", () => {
    expect(DEFAULT_OG_IMAGE.width).toBe(1200);
    expect(DEFAULT_OG_IMAGE.height).toBe(630);
  });

  it("has non-empty alt text", () => {
    expect(DEFAULT_OG_IMAGE.alt.length).toBeGreaterThan(0);
  });
});
