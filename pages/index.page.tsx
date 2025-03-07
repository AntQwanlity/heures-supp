import { StrapiApiImage } from "infrastructure/cms/strapi-api-image";
import { StrapiApiLink } from "infrastructure/cms/strapi-api-link";
import { GetStaticProps } from "next";
import { SecondaryFeature } from "presentation/web/core/components/strapi/components/SecondaryFeatures";
import { HomePage, HomePageProps } from "presentation/web/core/components/strapi/home-page";
import { createGetStaticProps } from "presentation/web/infrastructure/next/server/createGetStaticProps";
import { createNextPage } from "presentation/web/infrastructure/next/server/createNextPage";

export default createNextPage(HomePage);

export const getStaticProps: GetStaticProps<HomePageProps> = createGetStaticProps(
  "",
  async (cmsService): Promise<HomePageProps> => {
    const [
      header,
      hero,
      primaryFeatures,
      secondaryFeatures,
      callToAction,
      faq,
      testimonials,
      pricing,
      footer,
    ] = await Promise.all([
      cmsService.getOne<{
        loginLinkLabel: string;
        signUpLinkLabel: string;
        headerLinks: { data: StrapiApiLink[] };
      }>("header"),
      cmsService.getOne<{ title: string; subtitle: string; cta: string }>("hero"),
      cmsService.getOne<{
        title: string;
        subtitle: string;
        feat1Title: string;
        feat1Subtitle: string;
        feat1Image: StrapiApiImage;
        feat2Title: string;
        feat2Subtitle: string;
        feat2Image: StrapiApiImage;
        feat3Title: string;
        feat3Subtitle: string;
        feat3Image: StrapiApiImage;
        feat4Title: string;
        feat4Subtitle: string;
        feat4Image: StrapiApiImage;
      }>("primary-feat"),
      cmsService.getOne<{
        title: string;
        subtitle: string;
        features: { data: { attributes: SecondaryFeature }[] };
      }>("secondary-feat"),
      cmsService.getOne<{ title: string; subtitle: string; cta: string }>("call-to-action"),
      cmsService.getOne<{
        title: string;
        subtitle: string;
        items: { data: { attributes: { question: string; answer: string } }[] };
      }>("faq"),
      cmsService.getOne<{
        title: string;
        subtitle: string;
        items: {
          data: {
            attributes: {
              content: string;
              authorName: string;
              authorTitle: string;
              authorAvatar: StrapiApiImage;
            };
          }[];
        };
      }>("testimonials"),
      cmsService.getOne<{
        title: string;
        subtitle: string;
        pricingPlans: {
          data: {
            attributes: {
              name: string;
              price: number;
              description: string;
              cta: string;
              pricingFeatures: { data: { attributes: { content: string } }[] };
              highlighted: boolean;
            };
          }[];
        };
      }>("pricing"),
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
      hero: { title: hero.title, subtitle: hero.subtitle, cta: hero.cta },
      primaryFeatures: {
        title: primaryFeatures.title,
        subtitle: primaryFeatures.subtitle,
        features: [
          {
            title: primaryFeatures.feat1Title,
            subtitle: primaryFeatures.feat1Subtitle,
            image: {
              url: cmsService.getImageUrl(primaryFeatures.feat1Image.data.attributes.url),
              width: primaryFeatures.feat1Image.data.attributes.width,
              height: primaryFeatures.feat1Image.data.attributes.height,
            },
          },
          {
            title: primaryFeatures.feat2Title,
            subtitle: primaryFeatures.feat2Subtitle,
            image: {
              url: cmsService.getImageUrl(primaryFeatures.feat2Image.data.attributes.url),
              width: primaryFeatures.feat2Image.data.attributes.width,
              height: primaryFeatures.feat2Image.data.attributes.height,
            },
          },
          {
            title: primaryFeatures.feat3Title,
            subtitle: primaryFeatures.feat3Subtitle,
            image: {
              url: cmsService.getImageUrl(primaryFeatures.feat3Image.data.attributes.url),
              width: primaryFeatures.feat3Image.data.attributes.width,
              height: primaryFeatures.feat3Image.data.attributes.height,
            },
          },
          {
            title: primaryFeatures.feat4Title,
            subtitle: primaryFeatures.feat4Subtitle,
            image: {
              url: cmsService.getImageUrl(primaryFeatures.feat4Image.data.attributes.url),
              width: primaryFeatures.feat4Image.data.attributes.width,
              height: primaryFeatures.feat4Image.data.attributes.height,
            },
          },
        ],
      },
      secondaryFeatures: {
        title: secondaryFeatures.title,
        subtitle: secondaryFeatures.subtitle,
        features: secondaryFeatures.features.data.map((feature) => ({
          name: feature.attributes.name,
          summary: feature.attributes.summary,
          description: feature.attributes.description,
          icon: feature.attributes.icon,
        })),
      },
      callToAction: {
        title: callToAction.title,
        subtitle: callToAction.subtitle,
        cta: callToAction.cta,
      },
      faq: {
        title: faq.title,
        subtitle: faq.subtitle,
        items: faq.items.data.map((item) => ({
          question: item.attributes.question,
          answer: item.attributes.answer,
        })),
      },
      testimonials: {
        title: testimonials.title,
        subtitle: testimonials.subtitle,
        testimonials: testimonials.items.data.map((testimonial) => ({
          content: testimonial.attributes.content,
          author: {
            name: testimonial.attributes.authorName,
            title: testimonial.attributes.authorTitle,
            avatar: {
              url: cmsService.getImageUrl(
                testimonial.attributes.authorAvatar.data.attributes.formats.thumbnail.url,
              ),
              width: testimonial.attributes.authorAvatar.data.attributes.formats.thumbnail.width,
              height: testimonial.attributes.authorAvatar.data.attributes.formats.thumbnail.height,
            },
          },
        })),
      },
      pricing: {
        title: pricing.title,
        subtitle: pricing.subtitle,
        pricingPlans: pricing.pricingPlans.data.map((plan) => ({
          name: plan.attributes.name,
          price: plan.attributes.price,
          description: plan.attributes.description,
          cta: plan.attributes.cta,
          pricingFeatures: plan.attributes.pricingFeatures.data.map(
            (feature) => feature.attributes.content,
          ),
          highlighted: plan.attributes.highlighted,
        })),
      },
      footer: {
        copyright: footer.copyright,
      },
    };
  },
);
