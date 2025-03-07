import { default as NextImage } from "next/image";
import React from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lcp?: boolean;
  topQuality?: boolean;
};
export const Image: React.FC<Props> = ({
  src,
  alt,
  className,
  width,
  height,
  lcp = true,
  topQuality = false,
  ...props
}) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      priority={!lcp}
      quality={topQuality ? 100 : 75}
      {...props}
    />
  );
};
