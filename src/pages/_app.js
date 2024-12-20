import "@/styles/globals.css";
import dynamic from 'next/dynamic';
import Head from "next/head";
import Script from "next/script";


const PageLayout = dynamic(() => import('@/components/PageLayout'), {
  // ssr: false, // Server-Side Rendering disabled for this component
});


export const metadata = {
  title: "SUMIT DUARY",
  description: "This page invites people to see, buy and contact with us for the purpose of art/design/coding in graphic, website, AI art, digital art, photography",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={metadata.icons.icon} />
        {/* <script src="//cdnjs.cloudflare.com/ajax/libs/jodit/4.2.47/jodit.min.js"></script> */}
    </Head>
    <PageLayout>
    <Component {...pageProps} />
    </PageLayout>
    <Script
        src="//cdnjs.cloudflare.com/ajax/libs/jodit/4.2.47/jodit.min.js"
        strategy="lazyOnload"
      />
    </>
  );
}
