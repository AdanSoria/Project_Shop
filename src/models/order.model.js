const { db } = require('../config/firebase.config');
const ordersCollection = db.collection('orders');
const { FieldValue } = require('firebase-admin/firestore');

const Order = {
  async createOrder({ userId, items, total, paymentId, status }) {
    const newOrderRef = await ordersCollection.add({
      userId,
      items,
      total,
      paymentId,
      status: status || 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return this.findById(newOrderRef.id);
  },

  async findById(id) {
    const orderDoc = await ordersCollection.doc(id).get();
    if (!orderDoc.exists) {
      return null;
    }
    return { id: orderDoc.id, ...orderDoc.data() };
  },

  async findByUserId(userId) {
    const snapshot = await ordersCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateStatus(id, status) {
    await ordersCollection.doc(id).update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return this.findById(id);
  },
};

module.exports = Order;