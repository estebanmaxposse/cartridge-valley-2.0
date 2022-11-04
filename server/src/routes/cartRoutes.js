const { Router } = require("express");
const Cart = require("../models/cart");
const router = Router();
const productManager = require('../daos/daoProducts');
const cartManager = require('../daos/daoCarts');

router.post("/api/cart", async (req, res) => {
    try {
        let newCart = new Cart()
        console.log(typeof newCart);
        res.json(await cartManager.save(newCart))
    } catch {
        throw new Error(error);
    };
});

router.post("/api/cart/:id/products", async (req, res) => {
    let { id } = req.params;
    let cart = await cartManager.getById(id);
    let body = req.body;

    await Promise
        .all(body.map(pId => productManager.getById(pId._id ?? pId.id)))
        .then(products => cart.products.push(...products));

    let updatedCart = await cartManager.updateItem(cart);
    res.json(updatedCart.response);
});

router.get("/api/cart/:id/products", async (req, res) => {
    let { id } = req.params;
    let cart = await cartManager.getById(id);
    if (cart.products.length === 0) {
        res.json({ response: "This cart has no products" })
    } else {
        res.json({cartId: cart._id ?? cart.id, products: cart.products})
    };
});

router.delete("/api/cart/:id", async (req, res) => {
    let { id } = req.params;
    res.json( await cartManager.deleteById(id) );
})

router.delete("/api/cart/:id/products/:id_prod", async (req, res) => {
    let { id, id_prod } = req.params;
    let cart = await cartManager.getById(id);
    let newProducts = cart.products.filter((product) => (product._id ?? product.id).toString() !== id_prod);
    cart.products = newProducts;

    let updatedCart = await cartManager.updateItem(cart);
    res.json(updatedCart.response);
})

module.exports = router;