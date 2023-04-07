import { format } from "date-fns";
import { GetServerSideProps } from "next";
import { getStaticPaths } from "./[event]/photo/[photoId]";

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps<{}> = async ({ res }) => {
  res.setHeader("Content-Type", "text/xml");
  const xml = await generateSitemap();
  res.write(xml);
  res.end();
  return {
    props: {},
  };
};

async function generateSitemap(): Promise<string> {
  const fullImagePaths = (await getStaticPaths()).paths;

  const imagePaths = fullImagePaths.map((path) => {
    return {
      url: `https://gallery.asva.tech/${path.params.event}/photo/${path.params.photoId}`,
      lastmod: new Date().toISOString(),
      priority: 0.8,
    };
  });

  // get unique event paths
  const eventPaths = imagePaths
    .map((image) => {
      return {
        url: `https://gallery.asva.tech/${image.url.split("/")[3]}`,
        lastmod: new Date().toISOString(),
        priority: 0.9,
      };
    })
    .filter((image, index, self) => {
      return self.findIndex((t) => t.url === image.url) === index;
    });

  const pages = eventPaths.concat(imagePaths);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => {
    return `<url>
    <loc>${page.url}</loc>
    <lastmod>${format(new Date(page.lastmod), "yyyy-MM-dd")}</lastmod>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join("")}
</urlset>`;
}
