const Product = require('../models/product');
const Cart = require('../models/cart');

// Fetch all products
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// Fetch a single product by ID
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product ? product.title : 'Product Details',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// Fetch all products for the homepage
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

// Fetch the cart and associated products
exports.getCart = (req, res, next) => {
  Cart.findAll() // Adjust as needed based on Cart model implementation
    .then(cart => {
      return Product.findAll()
        .then(products => {
          const cartProducts = [];
          for (let product of products) {
            const cartProductData = cart.find(item => item.productId === product.id);
            if (cartProductData) {
              cartProducts.push({ productData: product, qty: cartProductData.qty });
            }
          }
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
          });
        });
    })
    .catch(err => console.log(err));
};

// Add a product to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (product) {
        return Cart.addProduct(prodId, product.price); // Adjust for Sequelize usage if Cart is a Sequelize model
      }
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

// Remove a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (product) {
        return Cart.deleteProduct(prodId, product.price); // Adjust for Sequelize usage if Cart is a Sequelize model
      }
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

// Fetch orders (adjust as needed based on the Order model)
exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

// Render checkout page
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
