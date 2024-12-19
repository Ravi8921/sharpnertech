const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;  // Check if the 'edit' query parameter is true
  if (!editMode) {
    return res.redirect('/'); // If no 'edit' query, redirect to home page
  }
  const prodId = req.params.productId; // Get the product ID from the URL

  // Use the Product model's findById method to retrieve the product
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/'); // If no product is found, redirect to home
    }
    // Render the edit page with the product data
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode, // Pass the 'editing' flag to the view
      product: product   // Pass the product data to the view
    });
  });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit; // Get the edit query parameter (should be true if editing)
//   if (!editMode) {
//     return res.redirect('/'); // If no 'edit' query parameter, redirect
//   }

//   const prodId = req.params.productId; // Get the product ID from the URL
//   Product.findById(prodId, product => {
//     if (!product) {
//       return res.redirect('/'); // If no product is found, redirect
//     }

//     // Render the edit page with product data
//     res.render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: editMode, // Set the 'editing' flag to true
//       product: product   // Pass the product data to the template
//     });
//   });
// };

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.productId;
//   Product.findById(prodId, product => {
//     if (!product) {
//       return res.redirect('/');
//     }
//     res.render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: editMode,
//       product: product
//     });
//   });
// };

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;  // Get the product ID from the form
  const updatedTitle = req.body.title;  // Get the updated title
  const updatedPrice = req.body.price;  // Get the updated price
  const updatedImageUrl = req.body.imageUrl;  // Get the updated image URL
  const updatedDesc = req.body.description;  // Get the updated description

  // Create a new Product object with the updated data
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );

  // Save the updated product to the database
  updatedProduct.save()
    .then(() => {
      res.redirect('/admin/products');  // Redirect to the products list page
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/products');  // Optionally, handle errors by redirecting
    });
};


// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;
//   const updatedProduct = new Product(
//     prodId,
//     updatedTitle,
//     updatedImageUrl,
//     updatedDesc,
//     updatedPrice
//   );
//   updatedProduct.save();
//   res.redirect('/admin/products');
// };


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/products', {  // Removed the leading slash in the path
        prods: rows,  // rows will contain the fetched products from the database
        pageTitle: 'All Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).render('admin/products', {  // Optionally, render with an error message
        prods: [], 
        pageTitle: 'All Products',
        path: '/admin/products',
        errorMessage: 'Failed to load products.'
      });
    });
};


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
