const config = require('../config/config')
const daoCartsMongo = require('./mongo/daoCartsMongo')
const daoCartFile = require('../utils/fileManager')
const daoCartsFirebase = require('./firebase/daoCartsFirebase')

let selectedDB = config.STORAGE_TYPE;
let cartManager

switch (selectedDB) {
    case 'mongo':
        cartManager = new daoCartsMongo()
        break;
    case 'firebase':
        cartManager = new daoCartsFirebase()
        break;
    default:
        cartManager = new daoCartFile('cart.json')
        break;
}

module.exports = cartManager;