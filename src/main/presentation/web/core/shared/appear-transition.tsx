import { Transition } from "@headlessui/react";
import React from "react";

const AppearTransition: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Transition
      appear
      show
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
};
