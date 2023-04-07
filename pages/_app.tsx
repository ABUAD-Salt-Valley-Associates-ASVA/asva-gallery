import type { AppProps } from "next/app";
import "../styles/index.css";
import NextNProgress from "nextjs-progressbar";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        color="#fff"
      />
      <Component {...pageProps} />
    </>
  );
}
