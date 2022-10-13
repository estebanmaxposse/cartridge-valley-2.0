const productValidation = (title, price, description, code, thumbnail, stock, timestamp) => {
    if (!title || !price || !description || !code || !thumbnail || !stock || !timestamp) {
        return { error: 'Please fill out every field'}
    } else {
        return { title, price, description, code, thumbnail, stock, timestamp };
    };
};

module.exports = { productValidation }
