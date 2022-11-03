const mongoManager = require('../../utils/mongoManager')

class daoCartsMongo extends mongoManager {
    constructor() {
        super('cart')
    }
}

module.exports = daoCartsMongo;