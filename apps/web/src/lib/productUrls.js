export function createProductSlug(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductPath(product) {
  const identifier = product?.slug || product?._id || product?.id;
  return identifier
    ? `/product/${encodeURIComponent(identifier)}`
    : "/products";
}
