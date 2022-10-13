const { Router } = require("express");
const Cart = require("../models/cart");
const fileManager = require("../utils/fileManager");
const router = Router();

const newFileManager = new fileManager('cart.json');

const newProductManager = new fileManager('products.json');

router.post("/api/cart", async (req, res) => {
    try {
        let newCart = new Cart()
        res.json(newFileManager.save(newCart))
    } catch {
        throw new Error(error);
    };
});

router.post("/api/cart/:id/products", async (req, res) => {
    let { id } = req.params;
    let cart = await newFileManager.getById(id);
    let body = req.body.productId;

    await Promise
        .all(body.map(pId => newProductManager.getById(pId)))
        .then(products => cart.products.push(...products));

    let updatedCart = await newFileManager.updateItem(cart);
    res.json(updatedCart);
});

router.get("/api/cart/:id/products", async (req, res) => {
    let { id } = req.params;
    let cart = await newFileManager.getById(id);
    if (cart.products.length === 0) {
        res.json({ error: "This cart has no products" })
    } else {
        res.json({cartId: cart.id, products: cart.products})
    };
});

router.delete("/api/cart/:id", async (req, res) => {
    let { id } = req.params;
    res.json( await newFileManager.deleteById(id) );
})

router.delete("/api/cart/:id/products/:id_prod", async (req, res) => {
    let { id, id_prod } = req.params;
    let cart = await newFileManager.getById(id);
    let newProducts = cart.products.filter((product) => product.id !== Number(id_prod));
    cart.products = newProducts;
    let updatedCart = await newFileManager.updateItem(cart);
    res.json(updatedCart);
})

module.exports = router;