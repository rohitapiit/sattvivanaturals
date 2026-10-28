import fs from "node:fs";
import path from "node:path";

const siteUrl = "https://sattvivanaturals.com";
const publicDirectory = path.resolve("public");
const sitemapPath = path.join(publicDirectory, "sitemap.xml");
const staticPaths = [
  "/",
  "/our-story",
  "/lab-reports",
  "/know-your-facility",
  "/products",
  "/contact",
  "/terms",
  "/privacy",
];
const envFiles = [
  ".env.production.local",
  ".env.local",
  ".env.production",
  ".env",
];

function readEnvFileValue(key) {
  for (const file of envFiles) {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const assignment = fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .find((line) => new RegExp(`^\\s*${key}\\s*=`).test(line));

    if (!assignment) {
      continue;
    }

    const value = assignment
      .slice(assignment.indexOf("=") + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2");

    if (value) {
      return value;
    }
  }

  return null;
}

function configuredApiUrl() {
  const sitemapApiUrl =
    process.env.SEO_SITEMAP_API_URL ||
    readEnvFileValue("SEO_SITEMAP_API_URL");
  if (sitemapApiUrl) {
    return sitemapApiUrl;
  }

  const apiUrl =
    process.env.VITE_API_URL ||
    readEnvFileValue("VITE_API_URL");
  if (!apiUrl) {
    return null;
  }

  let hostname;
  try {
    hostname = new URL(apiUrl).hostname.toLowerCase();
  } catch {
    throw new Error("VITE_API_URL must be an absolute URL for sitemap generation.");
  }

  if (["localhost", "127.0.0.1", "::1"].includes(hostname)) {
    return null;
  }

  return apiUrl;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createRouteSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function createSitemap(products) {
  const entries = new Map(
    staticPaths.map((route) => [route, null])
  );
  const activeProducts = products.filter(
    (product) => /^[a-f\d]{24}$/i.test(product.id || "")
  );

  for (const product of activeProducts) {
    const category = createRouteSlug(product.category);
    const subcategory = createRouteSlug(product.subcategory);

    if (category) {
      entries.set(`/products/${category}`, null);
    }
    if (category && subcategory) {
      entries.set(`/products/${category}/${subcategory}`, null);
    }

    const lastModified = product.updatedAt
      ? new Date(product.updatedAt)
      : null;
    entries.set(
      `/product/${product.id}`,
      lastModified && !Number.isNaN(lastModified.getTime())
        ? lastModified.toISOString().slice(0, 10)
        : null
    );
  }

  const urls = [...entries].map(([route, lastModified]) => {
    const lastmod = lastModified
      ? `\n    <lastmod>${lastModified}</lastmod>`
      : "";
    return `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>${lastmod}\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

async function main() {
  const apiUrl = configuredApiUrl();
  let products = [];

  if (apiUrl) {
    const baseUrl = apiUrl.replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/products/seo-index`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(
        `Product sitemap endpoint returned HTTP ${response.status}.`
      );
    }

    const data = await response.json();
    if (!data.success || !Array.isArray(data.products)) {
      throw new Error("Product sitemap endpoint returned invalid data.");
    }

    products = data.products;
  } else {
    console.warn(
      "No remote sitemap API URL is configured; generating a sitemap without dynamic product and category URLs. Set SEO_SITEMAP_API_URL or a remote VITE_API_URL."
    );
  }

  fs.mkdirSync(publicDirectory, { recursive: true });
  fs.writeFileSync(sitemapPath, createSitemap(products), "utf8");
  const productRouteCount = products.filter((product) =>
    /^[a-f\d]{24}$/i.test(product.id || "")
  ).length;
  console.log(
    `Generated sitemap with ${staticPaths.length} static routes, ${productRouteCount} active product routes, and their active categories.`
  );
}

main().catch((error) => {
  console.error("Unable to generate sitemap:", error.message);
  process.exitCode = 1;
});
