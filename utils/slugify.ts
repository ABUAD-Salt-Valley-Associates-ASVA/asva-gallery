function slugify(text: string): string {
  if (!text) {
    return "";
  }
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/-+$/, "");
}

export default slugify;
