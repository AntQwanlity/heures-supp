import Head from "next/head";
import React from "react";

export type SeoProps = {
  metaTitle: string;
  metaDescription: string;
};

export const Seo: React.FC<SeoProps> = ({ metaTitle, metaDescription }) => {
  return (
    <Head>
      {metaTitle && (
        <>
          <title>{metaTitle}</title>
          <meta property="og:title" content={metaTitle} />
          <meta name="twitter:title" content={metaTitle} />
        </>
      )}
      {metaDescription && (
        <>
          <meta name="description" content={metaDescription} />
          <meta property="og:description" content={metaDescription} />
          <meta name="twitter:description" content={metaDescription} />
        </>
      )}
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};
