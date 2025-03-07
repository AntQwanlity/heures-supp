import classNames from "classnames";
import Image from "next/image";
import React from "react";

type Props = {
  url?: string;
  size?: 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
};
const DefaultAvatar = () => (
  <svg className="h-full w-full text-blue-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const Avatar: React.FC<Props> = ({ url, size = 10 }) => {
  return (
    <div
      className={classNames(
        "inline-block overflow-hidden rounded-full bg-blue-100",
        { "h-5 w-5": size === 5 },
        { "h-6 w-6": size === 6 },
        { "h-7 w-7": size === 7 },
        { "h-8 w-8": size === 8 },
        { "h-9 w-9": size === 9 },
        { "h-10 w-10": size === 10 },
        { "h-11 w-11": size === 11 },
        { "h-12 w-12": size === 12 },
        { "h-13 w-13": size === 13 },
        { "h-14 w-14": size === 14 },
        { "h-15 w-15": size === 15 },
        { "h-16 w-16": size === 16 },
        { "h-17 w-17": size === 17 },
        { "h-18 w-18": size === 18 },
        { "h-19 w-19": size === 19 },
        { "h-20 w-20": size === 20 },
      )}
    >
      {url ? <Image src={url} alt="Avatar" width={0} height={0} fill /> : <DefaultAvatar />}
    </div>
  );
};
