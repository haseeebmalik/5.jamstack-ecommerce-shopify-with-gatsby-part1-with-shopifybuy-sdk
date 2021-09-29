import { graphql, navigate } from "gatsby";
import * as React from "react";
import Client from "shopify-buy";
// require("dotenv").config();
// require("dotenv").config({
//   path: `.env.${process.env.NODE_ENV}`,
// })
const client = Client.buildClient({
  // domain:process.env.STORE_URL,
  // storefrontAccessToken:process.env.STOREFONT_ACCESS_TOKEN
  domain: "haseeeb-store.myshopify.com",
  storefrontAccessToken: "4791a30ca4703aeb6e78af79ee8e1ab8",
});
const IndexPage = ({ data }) => {
  let count = 0;
  const [checkOut, setCheckout] = React.useState();
  const [totalItems, setTotalItems] = React.useState(0);

  React.useEffect(() => {
    // Create an empty checkout
    client.checkout.create().then((checkout) => {
      // Do something with the checkout
      console.log("checkout in useEffect", checkout);
      setCheckout(checkout);
      localStorage.setItem("checkoutid", checkout.id);
    });
  }, []);
  // console.log("data", data);

  return (
    <main>
      hello world
      <div>
        total price= {checkOut && checkOut.totalPrice}
        <br />
        total items={checkOut && totalItems}
        <br />
        <button
          onClick={() => {
            navigate("/cart");
          }}
        >
          cart
        </button>
        {data.allShopifyProduct.edges.map((node) => (
          <div>
            {console.log("shopify id", node.node.variants[0])}
            {console.log(
              "shopify id...........",
              node.node.variants[0].shopifyId.split("/")[4]
            )}
            {node.node.shopifyId}
            <br />
            <button
              onClick={async () => {
                console.log("checkout id", checkOut.id);
                const session = await client.checkout.addLineItems(
                  checkOut.id,
                  [
                    {
                      variantId: node.node.variants[0].storefrontId,

                      quantity: 2,
                    },
                  ]
                );
                setCheckout(session);
                console.log("session===>", session);
                console.log("Before", count);
                session?.lineItems.map((val) => {
                  count += val.quantity;
                });
                console.log("After", count);
                setTotalItems(count);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default IndexPage;

export const query = graphql`
  {
    allShopifyProduct {
      edges {
        node {
          variants {
            price
            id
            shopifyId
            productId
            storefrontId
          }
          shopifyId
          id
        }
      }
    }
  }
`;
