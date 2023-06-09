import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Bridge from "../../components/Icons/Bridge";
import Logo from "../../components/Icons/Logo";
import Modal from "../../components/Modal";
import cloudinary from "../../utils/cloudinary";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";
import { motion } from "framer-motion";
import Card from "../../components/Card";
import slugify from "../../utils/slugify";

interface Folders {
  name: string;
  path: string;
}

const Home: NextPage = ({
  images,
  folders,
}: {
  images: ImageProps[];
  folders: Folders[];
}) => {
  const router = useRouter();
  const { photoId } = router.query;

  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const options = folders?.map((folder) => {
    return {
      value: slugify(folder.name),
      label: folder.name,
    };
  });

  return (
    <>
      <Head>
        <title>ASVA GALLERY</title>
        <meta
          property="og:image"
          content="https://gallery.asva.tech/og-image.jpg"
        />
        <meta
          name="twitter:image"
          content="https://gallery.asva.tech/og-image.jpg"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <motion.div
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            },
          }}
          initial={"hidden"}
          whileInView={"show"}
          viewport={{ once: false, amount: 0.25 }}
          className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4"
        >
          <motion.div
            // variants={fadeIn("up", "tween", 0.1, 1)}
            className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Bridge />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <Logo />
            <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              ABUAD SALT VALLEY ASSOCIATES (ASVA) PHOTO GALLERY
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Our incredible ASVA community @{" "}
            </p>

            <select
              className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition  md:mt-4"
              onChange={(e) => {
                router.push(`/${e.target.value}`);
              }}
              defaultValue={router.query.event}
            >
              {options?.map((option) => {
                return (
                  <option
                    key={option.value}
                    value={option.value}
                    // className="hover:bg-white/10 hover:text-white"
                  >
                    {option.label}
                  </option>
                );
              })}
            </select>
          </motion.div>

          {images?.map(
            ({ id, public_id, format, blurDataUrl, event }, index) => (
              <Card
                key={index}
                id={id}
                public_id={public_id}
                format={format}
                blurDataUrl={blurDataUrl}
                lastViewedPhoto={lastViewedPhoto}
                lastViewedPhotoRef={lastViewedPhotoRef}
                index={index}
                event={event}
              />
            )
          )}
        </motion.div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to{" "}
        <a
          href="https://www.instagram.com/sean_not_shaun/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Sean Omoluabi
        </a>{" "}
        for the pictures.
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps({ params: { event } }) {
  const { folders } = await cloudinary.v2.api.root_folders();

  const folder = folders.find((folder) => slugify(folder.name) === event);

  if (!folder) {
    return {
      notFound: true,
    };
  }

  const results = await cloudinary.v2.search
    .expression(`folder:${folder.name}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      event,
    });
    i++;
  }

  const blurImagePromises = results?.resources?.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
      folders,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const results = await cloudinary.v2.api.root_folders();

  const events = results?.folders?.map((folder) => {
    return {
      params: {
        event: slugify(folder.name),
      },
    };
  });

  return {
    paths: events,
    fallback: true,
  };
}
