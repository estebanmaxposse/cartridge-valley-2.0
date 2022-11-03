class Product {
    constructor(title, description, code, thumbnail, price, stock, category) {

        this.timestamp = new Date().toLocaleString()
        this.title = title || ""
        this.description = description || ""
        this.code = code || ""
        this.thumbnail = thumbnail || ""
        this.price = price || ""
        this.stock = stock || ""
        this.category = category || ""
    }
}

module.exports = Product