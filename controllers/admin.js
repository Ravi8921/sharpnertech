const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  Product.create({
    title,
    imageUrl,
    price,
    description
  })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/products'); // Optionally, handle errors by redirecting
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  // Use findByPk to find the product by primary key (id)
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/');
    });
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;  // Get the product ID from the form
  const updatedTitle = req.body.title;  // Get the updated title
  const updatedPrice = req.body.price;  // Get the updated price
  const updatedImageUrl = req.body.imageUrl;  // Get the updated image URL
  const updatedDesc = req.body.description;  // Get the updated description

  // Find the product by primary key (id)
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/admin/products');
      }

      // Update the product with new values
      return product.update({
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc
      });
    })
    .then(() => {
      res.redirect('/admin/products');  // Redirect to the products list page
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/products');  // Optionally, handle errors by redirecting
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'All Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).render('admin/products', {
        prods: [],
        pageTitle: 'All Products',
        path: '/admin/products',
        errorMessage: 'Failed to load products.'
      });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.destroy({
    where: {
      id: prodId
    }
  })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/products');  // Optionally, handle errors by redirecting
    });
};
