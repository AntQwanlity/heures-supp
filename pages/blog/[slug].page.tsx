import { StrapiApiLink } from "infrastructure/cms/strapi-api-link";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  BlogPostPage,
  BlogPostPageProps,
} from "presentation/web/core/components/strapi/blog-post-page";
import { BlogPostProps } from "presentation/web/core/components/strapi/components/BlogPostHomeItem";
import { createGetStaticPaths } from "presentation/web/infrastructure/next/server/createGetStaticPaths";
import { createGetStaticProps } from "presentation/web/infrastructure/next/server/createGetStaticProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";

export default createNextPage(BlogPostPage);

export const getStaticPaths: GetStaticPaths = createGetStaticPaths<{ slug: string }>(
  async (cmsService) => {
    const blogPosts = await cmsService.getMany<{ slug: string }>("blog-posts");

    return blogPosts.map((blogPost) => ({ slug: blogPost.slug }));
  },
);

export const getStaticProps: GetStaticProps<BlogPostPageProps> = createGetStaticProps(
  "",
  async (cmsService, s, params): Promise<BlogPostPageProps | undefined> => {
    if (!params) throw new Error("No params !");

    const [header, post, footer] = await Promise.all([
      cmsService.getOne<{
        loginLinkLabel: string;
        signUpLinkLabel: string;
        headerLinks: { data: StrapiApiLink[] };
      }>("header"),
      cmsService.findOne<BlogPostProps>("blog-posts", [["slug", params.slug as string]]),
      cmsService.getOne<{
        copyright: string;
      }>("footer"),
    ]);

    if (!post) return undefined;

    return {
      header: {
        loginLinkLabel: header.loginLinkLabel,
        signUpLinkLabel: header.signUpLinkLabel,
        links: header.headerLinks.data.map((link) => ({
          label: link.attributes.label,
          href: link.attributes.href,
        })),
      },
      post,
      footer: {
        copyright: footer.copyright,
      },
    };
  },
);
