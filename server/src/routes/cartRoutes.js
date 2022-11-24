const { Router } = require("express");
const Cart = require("../models/cart");
const router = Router();
const productManager = require('../daos/daoProducts');
const cartManager = require('../daos/daoCarts');

router.post("/", async (req, res) => {
    try {
        let newCart = new Cart()
        console.log(typeof newCart);
        res.status(200).json(await cartManager.save(newCart))
    } catch {
        throw new Error(error);
    };
});

router.get('/', async (req, res) => {
    try {
        res.status(200).json(await cartManager.getAll())
    } catch (error) {
        throw new Error(error);
    }
})

router.post("/:id/products", async (req, res) => {
    let { id } = req.params;
    let cart = await cartManager.getById(id);
    let body = req.body;
    await Promise
        .all(body.map(pId => {
            return productManager.getById(pId._id ?? pId.id)}))
        .then(products => {
            cart.products.push(...products)});

    let updatedCart = await cartManager.updateItem(cart);
    res.json(updatedCart.response);
});

router.get("/:id/products", async (req, res) => {
    let { id } = req.params;
    let cart = await cartManager.getById(id);
    if (cart.products.length === 0) {
        res.json({ response: "This cart has no products" })
    } else {
        res.status(200).json({cartId: cart._id ?? cart.id, products: cart.products})
    };
});

router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    res.status(200).json( await cartManager.deleteById(id) );
})

router.delete("/:id/products/:id_prod", async (req, res) => {
    let { id, id_prod } = req.params;
    let cart = await cartManager.getById(id);
    let newProducts = cart.products.filter((product) => (product._id ?? product.id).toString() !== id_prod);
    cart.products = newProducts;

    let updatedCart = await cartManager.updateItem(cart);
    res.status(200).json(updatedCart.response);
})

module.exports = router;