import Image from "next/image";
import { Button } from "presentation/web/core/components/strapi/components/Button";
import { Container } from "presentation/web/core/components/strapi/components/Container";
import React from "react";

type Props = {
  title: string;
  subtitle: string;
  cta: string;
};
export const CallToAction: React.FC<Props> = ({ title, subtitle, cta }) => {
  return (
    <section id="get-started-today" className="relative overflow-hidden bg-blue-600 py-32">
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src="/background-call-to-action.jpg"
        alt=""
        width={2347}
        height={1244}
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg tracking-tight text-white">{subtitle}</p>
          <Button href="/app/signup" color="white" className="mt-10" asLink={false}>
            {cta}
          </Button>
        </div>
      </Container>
    </section>
  );
};
