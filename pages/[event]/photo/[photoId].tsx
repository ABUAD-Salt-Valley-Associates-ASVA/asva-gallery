import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../../components/Carousel";
import getResults from "../../../utils/cachedImages";
import cloudinary from "../../../utils/cloudinary";
import getBase64ImageUrl from "../../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>ASVA Gallery Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({
  params: { event, photoId },
}) => {
  const results = await getResults(event as string);

  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const currentPhoto = reducedResults.find((img) => img.id === Number(photoId));

  currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

  return {
    props: {
      currentPhoto: currentPhoto,
    },
  };
};

export async function getStaticPaths() {
  const results = await cloudinary.v2.api.root_folders();
  const folders = results.folders;
  let fullPaths = [];

  for (let folder of folders) {
    const photoResults = await cloudinary.v2.search
      .expression(`folder:${folder.name}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    let i = 0;
    for (let photo of photoResults.resources) {
      fullPaths.push({
        params: {
          event: folder.name,
          photoId: i.toString(),
        },
      });
      i++;
    }
  }

  return {
    paths: fullPaths,
    fallback: "blocking",
  };
}
