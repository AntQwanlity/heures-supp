import { StrapiLink } from "infrastructure/cms/strapi-link";
import Head from "next/head";
import {
  BlogPostHomeItem,
  BlogPostProps,
} from "presentation/web/core/components/strapi/components/BlogPostHomeItem";
import { Footer } from "presentation/web/core/components/strapi/components/Footer";
import { Header } from "presentation/web/core/components/strapi/components/Header";
import React from "react";

export type BlogPageProps = {
  header: { loginLinkLabel: string; signUpLinkLabel: string; links: StrapiLink[] };
  posts: BlogPostProps[];
  footer: { copyright: string };
};

export const BlogPage: React.FC<BlogPageProps> = ({ header, posts, footer }) => {
  return (
    <>
      <Head>
        <title>heures-supp.fr - Décompte heures supplémentaires - Blog</title>
        <meta
          name="description"
          content="Blog - Décompter les heures supplémentaires devient simple pour les avocats et les clients"
        />
      </Head>
      <Header
        loginLinkLabel={header.loginLinkLabel}
        signUpLinkLabel={header.signUpLinkLabel}
        links={header.links}
      />
      <main className="max-w-3xl mx-auto pb-10">
        <div className="md:border-l md:border-slate-100 md:pl-6 md:dark:border-slate-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {posts.map((post) => (
              <BlogPostHomeItem key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </main>
      <Footer links={header.links} copyright={footer.copyright} />
    </>
  );
};
