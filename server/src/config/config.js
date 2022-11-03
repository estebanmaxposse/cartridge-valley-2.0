require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8080,
    STORAGE_TYPE: process.env.STORAGE_TYPE || "mongo"
}