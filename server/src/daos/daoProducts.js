const config = require('../config/config')
const daoProductsMongo = require('./mongo/daoProductsMongo')
const daoProductsFile = require('../utils/fileManager')
const daoProductsFirebase = require('./firebase/daoProductsFirebase')

let selectedDB = config.STORAGE_TYPE;
let productManager

switch (selectedDB) {
    case 'mongo':
        productManager = new daoProductsMongo()
        break;
    case 'firebase':
        productManager = new daoProductsFirebase()
        break;
    default:
        productManager = new daoProductsFile('cart.json')
        break;
}

module.exports = productManager;