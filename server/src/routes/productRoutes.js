const { Router } = require("express");
const { productValidation } = require("../controllers/services");
const Product = require("../models/product")
const fileManager = require("../utils/fileManager")
const router = Router();
const fs = require("fs");

const newFileManager = new fileManager(`products.json`);

const newCartManager = new fileManager('cart.json');

const admin = false;

const checkAdmin = () => admin;

router.get("/", async (req, res) => {
    try {
        const products = await newFileManager.getAll();
        res.json(products);
    } catch (error) {
        throw new Error(error);
    };
});

router.get("/api/products", async (req, res) => {
    try {
        const products = await newFileManager.getAll();
        const productExists = products.length !== 0;
        if (productExists) {
            res.json(products);
        } else {
            res.json({ error: "Couldn't find any products!" })
        }
    } catch (error) {
        throw new Error(error);
    };
});

router.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await newFileManager.getById(id);
        let productExists = true;
        if (!product) {
            productExists = false;
        };
        if (productExists) {
            res.json(product);
        } else {
            res.json({ error: "Couldn't find the specified product!" })
        }
    } catch (error) {
        throw new Error(error);
    };
});

router.post("/api/products", async (req, res) => {
    if (!checkAdmin()) {
        return res.json({response: "You can not access this page"});
    }
    try {
        const { title, price, description, code, thumbnail, stock } = req.body;
        const newProduct = new Product(title, description, code, thumbnail, price, stock);
        const validatedProduct = productValidation(newProduct.title, newProduct.price, newProduct.description, newProduct.code, newProduct.thumbnail, newProduct.stock, newProduct.timestamp);
        if (validatedProduct.error) {
            res.json(validatedProduct);
        } else {
            res.json(validatedProduct)
            const product = await newFileManager.save(validatedProduct);
        }
    } catch (error) {
        throw new Error(error);
    };
});

router.put("/api/products/:id", async (req, res) => {
    if (!checkAdmin()) {
        return res.json({response: "You can not access this page"});
    }
    try {
        let { id } = req.params;
        let updatedProduct = {...req.body, id: parseInt(id)};
        res.json(newFileManager.updateItem(updatedProduct));
    } catch (error) {
        throw new Error(error);
    };
});

router.delete("/api/products/:id", async (req, res) => {
    if (!checkAdmin()) {
        return res.json({response: "You can not access this page"});
    }
    try {
        const { id } = req.params;
        res.json(await newFileManager.deleteById(id));
        let allCarts = await newCartManager.getAll();
        const isMatching = product => product.id === Number(id);
        let filteredCart = allCarts.filter(cart => cart.products.find(isMatching)).map((_, i) => i);

        filteredCart.forEach(i => {
            allCarts[i].products = allCarts[i].products.filter(product => product.id !== Number(id));
        });

        console.log(allCarts);
        fs.promises.writeFile(newCartManager.name, JSON.stringify(allCarts, null, '\t'))
    } catch (error) {
        throw new Error(error);
    };
});

module.exports = router;