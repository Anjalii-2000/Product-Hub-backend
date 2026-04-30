// const wishlist = require("../models/wishlistSchema");

// async function getWishlist(req, res) {
//     try {
//         let wishlist = await Wishlist.findOne({ user: req.user._id })
//             .populate("products");
//         if (!wishlist) {
//             wishlist = await Wishlist.create({
//                 user: req.user._id,
//                 products: []
//             });
//         }
//         res.status(200).json(wishlist);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = { getWishlist };
