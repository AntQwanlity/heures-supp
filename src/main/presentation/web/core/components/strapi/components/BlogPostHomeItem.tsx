import { DateTime } from "DateTime";
import Link from "next/link";
import { SeoProps } from "presentation/web/core/components/strapi/components/Seo";
import React from "react";

export type BlogPostProps = {
  title: string;
  content: string;
  slug: string;
  seo: SeoProps;
  createdAt: string;
};

export const BlogPostHomeItem: React.FC<BlogPostProps> = ({
  title,
  content,
  slug,
  seo,
  createdAt,
}) => {
  const dateTimeCreatedAt = DateTime.fromIsoFormattedString(createdAt);
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <div className="group relative flex flex-col items-start md:col-span-3">
        <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-slate-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-slate-800/50 sm:-inset-x-6 sm:rounded-2xl" />
          <Link href={`/blog/${slug}`}>
            <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
            <span className="relative z-10">{title}</span>
          </Link>
        </h2>
        <time
          className="md:hidden relative z-10 order-first mb-3 flex items-center text-sm text-slate-400 dark:text-slate-500 pl-3.5"
          dateTime={dateTimeCreatedAt.format("Iso8601")}
        >
          <span className="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
            <span className="h-4 w-0.5 rounded-full bg-slate-200 dark:bg-slate-500" />
          </span>
          {dateTimeCreatedAt.format("Date")}
        </time>
        <p className="relative z-10 mt-2 text-sm text-slate-600 dark:text-slate-400">
          {seo && seo.metaDescription}
        </p>
        <div
          aria-hidden="true"
          className="relative z-10 mt-4 flex items-center text-sm font-medium text-blue-600"
        >
          Lire l'article
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="ml-1 h-4 w-4 stroke-current"
          >
            <path
              d="M6.75 5.75 9.25 8l-2.5 2.25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <time
        className="mt-1 hidden md:block relative z-10 order-first mb-3 flex items-center text-sm text-slate-400 dark:text-slate-500"
        dateTime={dateTimeCreatedAt.format("Iso8601")}
      >
        {dateTimeCreatedAt.format("Date")}
      </time>
    </article>
  );
};
