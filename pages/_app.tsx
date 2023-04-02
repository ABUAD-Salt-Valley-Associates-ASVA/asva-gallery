import type { AppProps } from "next/app";
import { EventProvider } from "../contexts/eventContext";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EventProvider>
      <Component {...pageProps} />
    </EventProvider>
  );
}
