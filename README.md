# sharpnertech
assignment
Commit Id :- b8594e584cf6a76f8456ed8ea8670b577bd5dc38

Github link :- https://github.com/Ravi8921/sharpnertech/commit/b8594e584cf6a76f8456ed8ea8670b577bd5dc38



Ans) A relationship is there between user and product is one to many  because

One User → Multiple Products: A single user can have many products, but each product belongs to only one user.

Example: If a user sells items on an e-commerce site, they can list many products, but each product can only belong to one seller (user).

Why Not Many-to-Many?



A product can belong to multiple users simultaneously.

And, a user can own multiple products simultaneously.

This is usually represented with an intermediate table (e.g., user products) to store the associations between users and products.

In the case described, there is no mention of a product being shared among multiple users, so this is not a Many-to-Many relationship.

Reason for Doing This

The relationship is modeled as One-to-Many because:

Each User has many Products (User.hasMany(Product)).

Each Product belongs to one User (Product.belongsTo(User)).

  