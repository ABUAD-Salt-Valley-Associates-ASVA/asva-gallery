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
      url: `/${path.params.event}/photo/${path.params.photoId}`,
      lastmod: new Date().toISOString(),
      priority: 0.8,
    };
  });

  const eventPaths = imagePaths
    .map((imagePath) => {
      return {
        url: `/${imagePath.url.split("/")[1]}`,
        lastmod: imagePath.lastmod,
        priority: 0.9,
      };
    })
    .filter((imagePath, index, self) => {
      return (
        index ===
        self.findIndex(
          (t) => t.url === imagePath.url && t.lastmod === imagePath.lastmod
        )
      );
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
