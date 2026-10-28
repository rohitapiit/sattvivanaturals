import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

export const SITE_URL = "https://sattvivanaturals.com";

export function getAbsoluteUrl(path) {
  return new URL(path, SITE_URL).toString();
}

const SeoHead = ({
  title,
  description,
  image = "/images/logo.png",
  type = "website",
  noindex = false,
  structuredData,
}) => {
  const { pathname } = useLocation();
  const normalizedPath =
    pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const canonicalUrl = getAbsoluteUrl(normalizedPath);
  const imageUrl = image ? getAbsoluteUrl(image) : undefined;
  const schemas = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && (
        <meta name="description" content={description} />
      )}
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content={noindex ? "noindex, follow" : "index, follow"}
      />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Sattviva Naturals" />
      <meta property="og:url" content={canonicalUrl} />
      {title && <meta property="og:title" content={title} />}
      {description && (
        <meta property="og:description" content={description} />
      )}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta
        name="twitter:card"
        content={imageUrl ? "summary_large_image" : "summary"}
      />
      {title && <meta name="twitter:title" content={title} />}
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
