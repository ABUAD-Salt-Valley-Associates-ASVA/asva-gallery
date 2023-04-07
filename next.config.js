module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["res.cloudinary.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/epic22`,
        permanent: true,
      },
    ];
  },
};
