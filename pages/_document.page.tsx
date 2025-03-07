import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import Script from "next/script";
import { GTMIframe } from "presentation/web/infrastructure/analytics/gtm-iframe";
import React from "react";

const MyDocument = (props: any) => {
  const path = props.__NEXT_DATA__.page;
  const isApp = path.startsWith("/app");
  return isApp ? (
    <Html className="h-full bg-gray-100" lang="fr">
      <Head />
      <body className="h-full">
        <GTMIframe />
        <Main />
        <NextScript />
        {process.env.NEXT_PUBLIC_REACT_DEVTOOLS && (
          <Script src="http://localhost:8097" strategy="beforeInteractive"></Script>
        )}
      </body>
    </Html>
  ) : (
    <Html
      className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
      lang="fr"
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&display=swap"
        />
      </Head>
      <body className="flex h-full flex-col">
        <GTMIframe />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
  return await Document.getInitialProps(ctx);
};

export default MyDocument;
