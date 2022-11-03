const firebaseManager = require('../../utils/firebaseManager')

class daoProducts extends firebaseManager {
    constructor() {
        super('products')
    }
}

module.exports = daoProducts