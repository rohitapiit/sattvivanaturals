export function getOptimizedImageUrl(source, width) {
  if (!source || !/^https?:\/\//i.test(source)) {
    return source;
  }

  const cloudinaryImagePath =
    /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)/i;
  const normalizedWidth = Math.max(1, Math.round(Number(width) || 1));

  return source.replace(
    cloudinaryImagePath,
    `$1f_auto,q_auto,w_${normalizedWidth}/`
  );
}
