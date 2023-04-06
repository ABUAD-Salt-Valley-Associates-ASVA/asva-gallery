import cloudinary from "./cloudinary";

let cachedResults;

export default async function getResults(event) {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .expression(`folder:${event}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    cachedResults = fetchedResults;
  }

  return cachedResults;
}
