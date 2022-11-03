const {initializeApp} = require('firebase/app')
const { collection, addDoc, getFirestore } = require("firebase/firestore")
const productsJSON = require('../database/products.json')

let admin = require("firebase-admin");

let serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
  apiKey: "AIzaSyBQ7dFkrxGwi8E-fGgb3nT0SqP5KEVFHvE",
  authDomain: "ecomm-cartridge-valley-2.firebaseapp.com",
  projectId: "ecomm-cartridge-valley-2",
  storageBucket: "ecomm-cartridge-valley-2.appspot.com",
  messagingSenderId: "370380906495",
  appId: "1:370380906495:web:6feba0aacf0d19138e11ca"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const populateDb = async () => {
    console.log(productsJSON);
    const products = productsJSON;
    products.forEach(async element => {
        await addDoc(collection(db, 'products'), {
            title: element.title,
            description: element.description,
            price: element.price,
            stock: element.stock,
            code: element.code,
            category: element.category,
            thumbnail: element.thumbnail
        })
        console.log('Elements added');
    });
}

//populateDb()

module.exports = {db, firebaseConfig}