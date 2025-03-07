export default ({ env }: any) => ({
  seo: {
    enabled: true,
  },
  upload: {
    config: {
      provider: "@strapi-community/strapi-provider-upload-google-cloud-storage",
      providerOptions: {
        bucketName: env("BUCKET_NAME"),
        publicFiles: true,
        uniform: false,
      },
    },
  },
});
