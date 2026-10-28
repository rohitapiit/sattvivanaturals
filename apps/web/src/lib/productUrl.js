export function createProductSlug(title = "") {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug;
}

export function getProductPath(product, products = []) {
  const slug = createProductSlug(product?.title);
  const matchingProducts = products.filter(
    (item) => createProductSlug(item?.title) === slug
  );
  const needsIdSuffix = matchingProducts.length > 1;
  const productId = product?._id || product?.id;
  const uniqueSlug =
    needsIdSuffix && productId ? `${slug}-${productId}` : slug;

  return `/product/${uniqueSlug || productId}`;
}

export function findProductBySlug(products, slug) {
  const exactMatch = products.find(
    (product) => getProductPath(product, products).split("/").pop() === slug
  );

  if (exactMatch) {
    return exactMatch;
  }

  return products.find((product) => createProductSlug(product?.title) === slug);
}
