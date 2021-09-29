import { graphql } from "gatsby";
import * as React from "react";
import Client from "shopify-buy";

const client = Client.buildClient({
  domain: "haseeeb-store.myshopify.com",
  storefrontAccessToken: "4791a30ca4703aeb6e78af79ee8e1ab8",
});
const Cart = ({ data }) => {
  let count = 0;
  const [checkoutSession, setCheckoutSession] = React.useState();
  const [totalItems, setTotalItems] = React.useState();
  React.useEffect(() => {
    (async () => {
      const session = await client.checkout.fetch(
        localStorage.getItem("checkoutid")
      );
      setCheckoutSession(session);
      console.log("session==>", session);
    })();
  }, []);

  return (
    <main>
      <div>
        <button
          onClick={()=>{
            //on clicking it you will go to shopify checkout page for payment,but for it you have to 
            //activate your payment account in the settings.
            window.open(checkoutSession.webUrl)
          }}
        >checkout</button>
        <br />
        Total amount to be paid :{checkoutSession && checkoutSession.totalPrice}
      </div>
      {checkoutSession &&
        checkoutSession?.lineItems?.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              margin: "5px",
            }}
          >
            <div>Name: {item.title}</div>

            <div>
              <img width="100px" src={item?.variant?.image?.src} />
            </div>

            <div>Price per item:{item.variant.price}</div>
            <div>Total quantity: {item.quantity}</div>
            <div>total price: {item.variant.price * item.quantity}</div>
            <div>
              <button
                onClick={async () => {
                  // Update the line item on the checkout (change the quantity or variant)
                  const sessionAdd = await client.checkout.updateLineItems(
                    checkoutSession.id,
                    [
                      {
                        id: item.id,
                        quantity: item.quantity + 1,
                      },
                    ]
                  );
                  setCheckoutSession(sessionAdd);
                }}
              >
                +
              </button>
              <button
                onClick={async () => {
                  // Update the line item on the checkout (change the quantity or variant)
                  const sessionMinus = await client.checkout.updateLineItems(
                    checkoutSession.id,
                    [
                      {
                        id: item.id,
                        quantity: item.quantity - 1,
                      },
                    ]
                  );
                  setCheckoutSession(sessionMinus);
                }}
              >
                -
              </button>
            </div>
          </div>
        ))}
     
    </main>
  );
};

export default Cart;

// export const query = graphql`
//   {
//     allShopifyProduct {
//       edges {
//         node {
//           variants {
//             price
//             id
//             shopifyId
//             productId
//             storefrontId
//             product {
//               title
//             }
//           }
//           shopifyId
//           id
//         }
//       }
//     }
//   }
// `;
