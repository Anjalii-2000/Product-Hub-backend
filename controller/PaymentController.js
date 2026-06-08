const stripe = require("../config/stripe");
const Product = require("../models/productSchema");


const createCheckoutSession = async (req, res) => {
  try {

    const { productId } = req.body;

    const customerId = req.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "inr",

              product_data: {
                name: product.productName,
                images: [product.image]
              },

              unit_amount:
                Number(product.price) * 100
            },

            quantity: 1
          }
        ],

        metadata: {
          customerId,
          productId: product._id.toString(),
          sellerId: product.seller.toString()
        },

        success_url:
          "http://localhost:5173/payment-success",

        cancel_url:
          "http://localhost:5173/payment-cancel"
      });

    return res.status(200).json({
      url: session.url
    });

    console.log(session.url);
    console.log(session.id);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message
    });
  }
};


module.exports = { createCheckoutSession };