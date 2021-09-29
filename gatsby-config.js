require("dotenv").config();
module.exports = {
  siteMetadata: {},
  plugins: [
    {
      resolve: `gatsby-source-shopify`,
      options: {
        password: process.env.SHOPIFY_ADMIN_PASSWORD,
        storeUrl: process.env.STORE_URL,
      },
    },
  ],
};
