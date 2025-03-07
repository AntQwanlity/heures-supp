import {
  HomeIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";

export const ButtonIconIds = [
  "identification",
  "home",
  "location_marker",
  "phone",
  "question_mark",
] as const;

export type ButtonIconId = (typeof ButtonIconIds)[number];

export type ButtonIconComponent = React.ComponentType<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>
>;

export const ButtonIcons: {
  [K in ButtonIconId]: ButtonIconComponent;
} = {
  identification: IdentificationIcon,
  home: HomeIcon,
  location_marker: MapPinIcon,
  phone: PhoneIcon,
  question_mark: QuestionMarkCircleIcon,
};
