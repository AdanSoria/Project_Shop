
const { db } = require('../config/firebase.config');
const productsCollection = db.collection('products');

const Product = {
  async findAll() {
    const snapshot = await productsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async findById(id) {
    const doc = await productsCollection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async create(productData) {
    const docRef = await productsCollection.add(productData);
    return { id: docRef.id, ...productData };
  },

  async update(id, updateData) {
    await productsCollection.doc(id).update(updateData);
    return this.findById(id);
  },

  async remove(id) {
    await productsCollection.doc(id).delete();
  },
};

module.exports = Product;
