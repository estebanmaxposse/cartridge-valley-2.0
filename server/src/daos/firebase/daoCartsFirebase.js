const firebaseManager = require('../../utils/firebaseManager')

class daoCartsFirebase extends firebaseManager {
    constructor() {
        super('cart')
    }
}

module.exports = daoCartsFirebase