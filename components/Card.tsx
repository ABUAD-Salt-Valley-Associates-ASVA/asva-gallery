import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fadeIn, spring } from "../utils/animationVariants";

const Card = ({
  id,
  public_id,
  format,
  blurDataUrl,
  lastViewedPhoto,
  lastViewedPhotoRef,
  index,
  event,
}) => {
  return (
    <motion.div
      variants={{
        hidden: {
          y: 50,
          opacity: 0,
        },
        show: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            duration: 1,
            delay: index * 0.05,
          },
        },
      }}
      initial="hidden"
      animate="show"

      //   variants={fadeIn("right", "spring", 0.5, 0.75)}
    >
      <Link
        key={id}
        href={{
          pathname: `/${event}`,
          query: { photoId: id },
        }}
        ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
        shallow
        className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
      >
        <Image
          loading="lazy"
          alt="ASVA GALLERY photo"
          className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
          style={{ transform: "translate3d(0, 0, 0)" }}
          placeholder="blur"
          blurDataURL={blurDataUrl}
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
          width={720}
          height={480}
          sizes="(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw"
        />
      </Link>
    </motion.div>
  );
};

export default Card;
