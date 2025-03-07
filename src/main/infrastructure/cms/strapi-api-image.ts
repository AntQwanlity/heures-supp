type StrapiApiImageFormat = {
  url: string;
  width: number;
  height: number;
};

export type StrapiApiImage = {
  data: {
    attributes: {
      formats: {
        large: StrapiApiImageFormat;
        medium: StrapiApiImageFormat;
        small: StrapiApiImageFormat;
        thumbnail: StrapiApiImageFormat;
      };
      url: string;
      width: number;
      height: number;
    };
  };
};
