
const { db } = require('../config/firebase.config');
const cartsCollection = db.collection('carts');

const Cart = {
  async getCartByUserId(userId) {
    const snapshot = await cartsCollection.where('userId', '==', userId).limit(1).get();
    if (snapshot.empty) {
      // Si no hay carrito, crear uno nuevo
      const newCartRef = await cartsCollection.add({ userId, items: [] });
      const newCartDoc = await newCartRef.get();
      return { id: newCartDoc.id, ...newCartDoc.data() };
    }
    const cartDoc = snapshot.docs[0];
    return { id: cartDoc.id, ...cartDoc.data() };
  },

  async addItem(userId, productId, quantity) {
    const cart = await this.getCartByUserId(userId);
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      // El producto ya está en el carrito, actualizar cantidad
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Añadir nuevo producto al carrito
      cart.items.push({ productId, quantity });
    }

    await cartsCollection.doc(cart.id).update({ items: cart.items });
    return cart;
  },

  async updateItemQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }
    const cart = await this.getCartByUserId(userId);
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cartsCollection.doc(cart.id).update({ items: cart.items });
    }
    return cart;
  },

  async removeItem(userId, productId) {
    const cart = await this.getCartByUserId(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    await cartsCollection.doc(cart.id).update({ items: cart.items });
    return cart;
  },

  async clearCart(userId) {
    const cart = await this.getCartByUserId(userId);
    await cartsCollection.doc(cart.id).update({ items: [] });
    return { ...cart, items: [] };
  },
};

module.exports = Cart;
