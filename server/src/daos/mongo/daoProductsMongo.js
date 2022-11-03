const mongoManager = require('../../utils/mongoManager')

class daoProductsMongo extends mongoManager {
    constructor() {
        super('products')
    }
}

module.exports = daoProductsMongo;