const { Router } = require("express");
const router = Router();
const { productValidation } = require("../controllers/services");
const Product = require("../models/product")
const productManager = require('../daos/daoProducts');
const cartManager = require('../daos/daoCarts');

const admin = true;

const checkAdmin = () => admin;

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        const productExists = products.length !== 0;
        if (productExists) {
            res.status(200).json(products);
        } else {
            res.json({ error: "Couldn't find any products!" })
        }
    } catch (error) {
        throw new Error(error);
    };
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.getById(id);
        let productExists = true;
        if (!product) {
            productExists = false;
        };
        if (productExists) {
            res.status(200).json(product);
        } else {
            res.json({ error: "Couldn't find the specified product!" })
        }
    } catch (error) {
        throw new Error(error);
    };
});

router.post("/", async (req, res) => {
    if (!checkAdmin()) {
        return res.json({response: "You can not access this page"});
    }
    try {
        const { title, price, description, code, thumbnail, stock, category } = req.body;
        const newProduct = new Product(title, description, code, thumbnail, price, stock, category);
        const validatedProduct = productValidation(newProduct.title, newProduct.price, newProduct.description, newProduct.code, newProduct.thumbnail, newProduct.stock, newProduct.timestamp, newProduct.category);
        if (validatedProduct.error) {
            res.json(validatedProduct);
        } else {
            const product = await productManager.save(validatedProduct);
            res.status(200).json({response: `Product ${product} has been added!`})
        }
    } catch (error) {
        throw new Error(error);
    };
});

router.put("/:id", async (req, res) => {
    if (!checkAdmin()) {
        return res.json({response: "You can not access this page"});
    }
    try {
        let { id } = req.params;
        let updatedProduct = {...req.body, id: id};
        await productManager.updateItem(updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (error) {
        throw new Error(error);
    };
});

router.delete("/:id", async (req, res) => {
    if (!checkAdmin()) {
        return res.json({response: "You can not access this page"});
    }
    try {
        const { id } = req.params;
        res.status(200).json(await productManager.deleteById(id));

        //Cart DAOS?
        let allCarts = await cartManager.getAll();
        console.log(JSON.stringify(allCarts));
        const isMatching = product => (product._id ?? product.id).toString() === id;
        let filteredCart = allCarts.filter(cart => cart.products.find(isMatching));
        console.log('Filtered Cart Index ', filteredCart);

        filteredCart.forEach(c => {
            const cart = c;
            cart.products = c.products.filter(p => !isMatching(p))
            cartManager.updateItem(cart).then(() => console.log('yay :D'))
        })

        /*filteredCart.forEach(async (i) => {
            console.log('pre', allCarts[i].products.length)
            allCarts[i].products = allCarts[i].products.filter(p => !isMatching(p));
            await cartManager.updateItem(filteredCart)
            console.log('\tpost', allCarts[i].products.length)
        });*/

        console.log('All carts after deletion ', JSON.stringify(allCarts));

        await cartManager.updateItem()

        // console.log(allCarts);
        // fs.promises.writeFile(cartManager.name, JSON.stringify(allCarts, null, '\t'))
    } catch (error) {
        throw new Error(error);
    };
});

module.exports = router;