const express = require('express');
const path = require('path');
const productRouter = require('../routes/productRoutes');
const cartRouter = require('../routes/cartRoutes')
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(productRouter);
app.use(cartRouter);

app.all('*', (req, res) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.status(404).json({error: 404, description: `Couldn't find the route ${fullUrl} with the method ${req.method}`})
  })

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

module.exports = startServer;