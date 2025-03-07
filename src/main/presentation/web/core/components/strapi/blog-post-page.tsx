import { DateTime } from "DateTime";
import { StrapiLink } from "infrastructure/cms/strapi-link";
import { BlogPostProps } from "presentation/web/core/components/strapi/components/BlogPostHomeItem";
import { Footer } from "presentation/web/core/components/strapi/components/Footer";
import { Header } from "presentation/web/core/components/strapi/components/Header";
import { Seo } from "presentation/web/core/components/strapi/components/Seo";
import { Image } from "presentation/web/core/shared/image";
import { Link } from "presentation/web/core/shared/links/link";
import { PrimaryLink } from "presentation/web/core/shared/links/primary-link";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export type BlogPostPageProps = {
  header: { loginLinkLabel: string; signUpLinkLabel: string; links: StrapiLink[] };
  post: BlogPostProps;
  footer: { copyright: string };
};

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, header, footer }) => {
  const baseImgUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:1337" : "";
  const dateTimeCreatedAt = DateTime.fromIsoFormattedString(post.createdAt);

  return (
    <>
      <Seo {...post.seo} />
      <Header
        loginLinkLabel={header.loginLinkLabel}
        signUpLinkLabel={header.signUpLinkLabel}
        links={header.links}
      />
      <div className="sm:px-8 pb-10">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <div className="xl:relative">
                <div className="mx-auto max-w-2xl">
                  <Link
                    href="/blog"
                    aria-label="Go back to articles"
                    className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-slate-800/5 ring-1 ring-slate-900/5 transition dark:border dark:border-slate-700/50 dark:bg-slate-800 dark:ring-0 dark:ring-white/10 dark:hover:border-slate-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="h-4 w-4 stroke-slate-500 transition group-hover:stroke-slate-700 dark:stroke-slate-500 dark:group-hover:stroke-slate-400"
                    >
                      <path
                        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  <article>
                    <header className="flex flex-col">
                      <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl">
                        {post.title}
                      </h1>
                      <time
                        dateTime={post.createdAt}
                        className="order-first flex items-center text-base text-slate-400 dark:text-slate-500"
                      >
                        <span className="h-4 w-0.5 rounded-full bg-slate-200 dark:bg-slate-500" />
                        <span className="ml-3">{dateTimeCreatedAt.format("Date")}</span>
                      </time>
                    </header>
                    <div className="mt-8 prose dark:prose-invert">
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          a: ({ children, href }) => (
                            <PrimaryLink href={href || "www.google.com"}>{children}</PrimaryLink>
                          ),
                          img: ({ alt, src, width, height }) => (
                            <Image
                              alt={alt || ""}
                              src={`${baseImgUrl}${src}`}
                              width={(width as number) || 0}
                              height={(height as number) || 0}
                            />
                          ),
                        }}
                      >
                        {post.content}
                      </ReactMarkdown>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer links={header.links} copyright={footer.copyright} />
    </>
  );
};
