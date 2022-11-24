const { firebaseConfig } = require('../config/configFirebase')
const { initializeApp } = require('firebase/app')
const { collection, doc, addDoc, getFirestore, getDocs, getDoc, updateDoc, deleteDoc } = require('firebase/firestore')

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class ContainerFirebase {
    constructor(name) {
        this.collectionName = name;
    }

    async getAll() {
        const itemCollection = await getDocs(collection(db, this.collectionName))
        const items = itemCollection.docs.map(element => ({id: element.id, ...element.data()}))
        return items
    };

    async save(object) {
        try {
            const savedObject = await addDoc(collection(db, this.collectionName), {...object} )
            const saveRef = doc(db, this.collectionName, savedObject.id)
            const objectWithId = await updateDoc(saveRef, {
                'id': savedObject.id
            })
            return savedObject.id
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to add object!`)
        };
    };

    async getById(id) {
        try {
            const foundElement = await getDoc(doc(db, this.collectionName, id));
            if (foundElement.data()) {
                const element = {id: foundElement.id, ...foundElement.data()}
                return element;
            } else {
                return ({ response: `Item ${id} doesn't exist!` })
            }
        } catch (error) {
            throw new Error(`Couldn't find ${id} object! ${error}`);
        };
    };

    async updateItem(item) {
        try {
            const toUpdate = await doc(db, this.collectionName, item.id)
            const updatedItem = await updateDoc(toUpdate, item)
            return { response: `Item ${item.id} updated!` };
        } catch (error) {
            console.log(error);
            return { response: Error`updating ${item}`, error };
        }
    } 

    async deleteById(id) {
        try {
            const deleteItem = await deleteDoc(doc(db, this.collectionName, id))
            return { response: `Deleted item: ${id}` };
        } catch (error) {
            return { response: Error`deleting ${id}`, error };
        }
    };

    async deleteAll() {
        try {
            await deleteDoc(doc(db, this.collectionName));
            console.log(`All products deleted!`);
        } catch (error) {
            throw new Error(`Error deleting all products: ${error}`);
        };
    };
}


module.exports = ContainerFirebase