import Image from "next/image";
import { Container } from "presentation/web/core/components/strapi/components/Container";
import React from "react";

type Props = {
  title: string;
  subtitle: string;
  items: { question: string; answer: string }[];
};

export const Faqs: React.FC<Props> = ({ title, subtitle, items }) => {
  return (
    <section id="faq" className="relative overflow-hidden bg-slate-50 py-20 sm:py-32">
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src="/background-faqs.jpg"
        alt=""
        width={1558}
        height={946}
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">{subtitle}</p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {items.map((item, idx) => (
            <li key={`faq-question-${item.question}`}>
              <h3 className="font-display text-lg leading-7 text-slate-900">{item.question}</h3>
              <p className="mt-4 text-sm text-slate-700">{item.answer}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
