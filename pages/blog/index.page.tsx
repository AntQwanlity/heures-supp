import { StrapiApiLink } from "infrastructure/cms/strapi-api-link";
import { GetStaticProps } from "next";
import { BlogPage, BlogPageProps } from "presentation/web/core/components/strapi/blog-page";
import { BlogPostProps } from "presentation/web/core/components/strapi/components/BlogPostHomeItem";
import { createGetStaticProps } from "presentation/web/infrastructure/next/server/createGetStaticProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";

export default createNextPage(BlogPage);

export const getStaticProps: GetStaticProps<BlogPageProps> = createGetStaticProps(
  "",
  async (cmsService): Promise<BlogPageProps> => {
    const [header, blogPosts, footer] = await Promise.all([
      cmsService.getOne<{
        loginLinkLabel: string;
        signUpLinkLabel: string;
        headerLinks: { data: StrapiApiLink[] };
      }>("header"),
      cmsService.getMany<BlogPostProps>("blog-posts"),
      cmsService.getOne<{
        copyright: string;
      }>("footer"),
    ]);

    return {
      header: {
        loginLinkLabel: header.loginLinkLabel,
        signUpLinkLabel: header.signUpLinkLabel,
        links: header.headerLinks.data.map((link) => ({
          label: link.attributes.label,
          href: link.attributes.href,
        })),
      },
      posts: blogPosts,
      footer: {
        copyright: footer.copyright,
      },
    };
  },
);
