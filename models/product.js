const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  static findById(id, callback) {
    db.execute('SELECT * FROM products WHERE id = ?', [id])
      .then(([rows, fieldData]) => {
        if (rows.length > 0) {
          callback(rows[0]);  // Return the first product if found
        } else {
          callback(null);  // No product found
        }
      })
      .catch(err => console.log(err));
  }

  save() {
    // If the product has an id, update it; otherwise, insert a new product
    if (this.id) {
      return db.execute(
        'UPDATE products SET title = ?, imageUrl = ?, description = ?, price = ? WHERE id = ?',
        [this.title, this.imageUrl, this.description, this.price, this.id]
      );
    } else {
      return db.execute(
        'INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)',
        [this.title, this.imageUrl, this.description, this.price]
      );
    }
  }




  // save() {
  //   return db.execute(
  //     'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
  //     [this.title, this.price, this.imageUrl, this.description]
  //   );
  // }
  static deleteById(id) {
    return db.execute('DELETE FROM products WHERE id = ?', [id]);
  }
 
  // static updateById(id, title, imageUrl, description, price) {
  //   return db.execute(
  //     'UPDATE products SET title = ?, price = ?, imageUrl = ?, description = ? WHERE id = ?',
  //     [title, price, imageUrl, description, id]
  //   );
  // }
  

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  // static findById(id) {
  //   return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  // }
};



