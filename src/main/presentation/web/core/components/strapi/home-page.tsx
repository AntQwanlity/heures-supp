import { StrapiImage } from "infrastructure/cms/strapi-image";
import { StrapiLink } from "infrastructure/cms/strapi-link";
import Head from "next/head";
import { CallToAction } from "presentation/web/core/components/strapi/components/CallToAction";
import { Faqs } from "presentation/web/core/components/strapi/components/Faqs";
import { Footer } from "presentation/web/core/components/strapi/components/Footer";
import { Header } from "presentation/web/core/components/strapi/components/Header";
import { Hero } from "presentation/web/core/components/strapi/components/Hero";
import { Pricing } from "presentation/web/core/components/strapi/components/Pricing";
import { PrimaryFeatures } from "presentation/web/core/components/strapi/components/PrimaryFeatures";
import {
  SecondaryFeatureIcon,
  SecondaryFeatures,
} from "presentation/web/core/components/strapi/components/SecondaryFeatures";
import { Testimonials } from "presentation/web/core/components/strapi/components/Testimonials";
import React from "react";

export type HomePageProps = {
  header: { loginLinkLabel: string; signUpLinkLabel: string; links: StrapiLink[] };
  hero: { title: string; subtitle: string; cta: string };
  primaryFeatures: {
    title: string;
    subtitle: string;
    features: { title: string; subtitle: string; image: StrapiImage }[];
  };
  secondaryFeatures: {
    title: string;
    subtitle: string;
    features: { name: string; summary: string; description: string; icon: SecondaryFeatureIcon }[];
  };
  callToAction: {
    title: string;
    subtitle: string;
    cta: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    pricingPlans: {
      name: string;
      price: number;
      description: string;
      cta: string;
      pricingFeatures: string[];
      highlighted: boolean;
    }[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    testimonials: {
      content: string;
      author: {
        name: string;
        title: string;
        avatar: StrapiImage;
      };
    }[];
  };
  footer: { copyright: string };
};

export const HomePage: React.FC<HomePageProps> = ({
  header,
  hero,
  primaryFeatures,
  secondaryFeatures,
  callToAction,
  faq,
  testimonials,
  pricing,
  footer,
}) => {
  return (
    <>
      <Head>
        <title>heures-supp.fr - Décompte heures supplémentaires</title>
        <meta
          name="description"
          content="Décompter les heures supplémentaires devient simple pour les avocats et les clients"
        />
      </Head>
      <Header
        loginLinkLabel={header.loginLinkLabel}
        signUpLinkLabel={header.signUpLinkLabel}
        links={header.links}
      />
      <main>
        <Hero title={hero.title} subtitle={hero.subtitle} cta={hero.cta} />
        <PrimaryFeatures
          title={primaryFeatures.title}
          subtitle={primaryFeatures.subtitle}
          features={primaryFeatures.features}
        />
        <SecondaryFeatures
          title={secondaryFeatures.title}
          subtitle={secondaryFeatures.subtitle}
          features={secondaryFeatures.features}
        />
        <CallToAction
          title={callToAction.title}
          subtitle={callToAction.subtitle}
          cta={callToAction.cta}
        />
        <Testimonials
          title={testimonials.title}
          subtitle={testimonials.subtitle}
          testimonials={testimonials.testimonials}
        />
        <Faqs title={faq.title} subtitle={faq.subtitle} items={faq.items} />
      </main>
      <Footer links={header.links} copyright={footer.copyright} />
    </>
  );
};
