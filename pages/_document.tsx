import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Step into a world of nostalgia with ABUAD Salt Valley Associates' breathtaking photo gallery. Immerse yourself in a visual journey through time and relive unforgettable moments captured by our skilled photographers. Join us as we celebrate the beauty and essence of our community through the power of photography."
          />
          <meta property="og:site_name" content="gallery.asva.tech" />
          <meta
            property="og:description"
            content="Step into a world of nostalgia with ABUAD Salt Valley Associates' breathtaking photo gallery. Immerse yourself in a visual journey through time and relive unforgettable moments captured by our skilled photographers. Join us as we celebrate the beauty and essence of our community through the power of photography"
          />
          <meta
            property="og:title"
            content="Relive Past Memories with ABUAD Salt Valley Associates (ASVA)"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="ASVA Photo Gallery" />
          <meta
            name="twitter:description"
            content="Step into a world of nostalgia with ABUAD Salt Valley Associates' breathtaking photo gallery. Immerse yourself in a visual journey through time and relive unforgettable moments captured by our skilled photographers. Join us as we celebrate the beauty and essence of our community through the power of photography"
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
