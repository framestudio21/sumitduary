import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/jodit/4.2.41/jodit.min.css"
        />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/jodit/4.2.47/jodit.min.css"
        />
        {/* <script src="//cdnjs.cloudflare.com/ajax/libs/jodit/4.2.47/jodit.min.js"></script> */}
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
        src="//cdnjs.cloudflare.com/ajax/libs/jodit/4.2.47/jodit.min.js"
        strategy="lazyOnload"
      />
      </body>
    </Html>
  );
}
