class Cart {
  constructor() {
    this.carts = [];
  };

  getCarts() {
    return this.carts;
  }

  addCart(cart) {
    try {
      const newCart = {
        id: this.carts.length
          ? this.carts[this.carts.length - 1].id + 1
          : 1,
        ...cart,
      };
      this.carts.push(newCart);
      return newCart;
    } catch (error) {
      throw new Error(error);
    };
  };

  deleteCart(id) {
    try {
      this.getCarts;
      const deleteCart = this.carts.find((cart) => cart.id === Number(id)) || {
        error: "Cart not found.",
      };
      this.carts = this.carts.filter((cart) => cart.id !== Number(id));
      return deleteCart;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  findCart(id) {
    if (this.carts.length !== 0) {
      const cart = this.carts.find(cart => cart.id === id);
      return cart
    } else {
      console.log(error);
      return { error: "Cart not found" }
    }
  }

  isInCart(cartId, productId) {
    try {
      const cart = this.findCart(cartId)
      cart.find((product) => product.id === productId) ? true : false;
    } catch (error) {
      console.log(error);
      return { error: "Product not found in cart" }
    }
  }

  removeProduct(cartId, productId) {
    try {
      const cart = this.findCart(cartId)
      cart.filter((product) => product.id !== productId);
    } catch (error) {
      console.log(error);
      return { error: "Product not found in cart" }
    };
  };

  addProduct(cartId, item, quantity) {
    try {
      let cart = this.findCart(cartId)
      if (this.isInCart(cartId, item.id)) {
        cart.map(product => {
          return product.id = item.id
            ? { ...product, quantity: product.quantity + quantity }
            : product;
        })
      } else {
        cart = [...cart, { item: quantity }]
      };
    } catch (error) {
      console.log(error);
      return { error: "Couldn't add selected product" };
    };
  };

  totalProducts() {
    return this.cart.reduce(
      (accumulatedProducts, addedProduct) =>
        accumulatedProducts + addedProduct.quantity,
      0
    );
  };

  totalPrice() {
    return this.cart.reduce(
      (accumulatedValue, addedValue) =>
        accumulatedValue + addedValue.quantity * addedValue.price,
      0
    );
  };
}

module.exports = new Cart();