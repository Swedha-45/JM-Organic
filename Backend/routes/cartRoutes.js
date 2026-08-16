// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Cart = require("../models/cart");
const Product = require("../models/product");

// Get cart
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price image description stock");

    if (!cart) {
      return res.json({
        success: true,
        items: [],
        total: 0,
        count: 0
      });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      items: cart.items,
      total: total,
      count: cart.items.length
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart"
    });
  }
});

// Add to cart
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock"
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{
          product: productId,
          quantity: quantity,
          price: product.price
        }]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product.stock < newQuantity) {
          return res.status(400).json({
            success: false,
            message: "Not enough stock"
          });
        }
        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: quantity,
          price: product.price
        });
      }
    }

    await cart.save();
    await cart.populate("items.product", "name price image");

    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: "Item added to cart",
      items: cart.items,
      total: total,
      count: cart.items.length
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart"
    });
  }
});

// Update cart item
router.put("/update/:itemId", protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const cartItem = cart.items.find(
      item => item._id.toString() === itemId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    const product = await Product.findById(cartItem.product);
    if (product && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock"
      });
    }

    cartItem.quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "name price image");

    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      items: cart.items,
      total: total,
      count: cart.items.length
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart"
    });
  }
});

// Remove from cart
router.delete("/remove/:itemId", protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();
    await cart.populate("items.product", "name price image");

    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      items: cart.items,
      total: total,
      count: cart.items.length
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from cart"
    });
  }
});

// Clear cart
router.delete("/clear", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ user: userId });

    res.json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart"
    });
  }
});

module.exports = router;