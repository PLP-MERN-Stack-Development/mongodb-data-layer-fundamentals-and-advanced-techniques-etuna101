// Find all books in a specific genre (e.g., 'Fiction')
db.books.find({ genre: 'Fiction' });

// Find books published after a certain year (e.g., 1950)
db.books.find({ published_year: { $gt: 1950 } });

// Find books by a specific author (e.g., 'George Orwell')
db.books.find({ author: 'George Orwell' });

// Update the price of a specific book (e.g., change price of '1984' to 15.99)
db.books.updateOne(
  { title: '1984' },
  { $set: { price: 15.99 } }
);

// Delete a book by its title (e.g., 'Moby Dick')
db.books.deleteOne({ title: 'Moby Dick' });

// Find books that are in stock and published after 2010,
// project only title, author, and price fields
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
);

// Sort books by price ascending
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 });

// Sort books by price descending
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: -1 });

// Pagination: get page 2 (skip first 5, limit next 5)
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).skip(5).limit(5);

// 1. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// 2. Author with the most books in the collection
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: { $concat: [
        { $toString: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] } },
        "s"
      ] },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

// Create an index on the `title` field
db.books.createIndex({ title: 1 });

// Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: 1 });

// Use the `explain()` method to show query performance before and after indexing
// Example: Find a book by title and explain the query plan
db.books.find({ title: "1984" }).explain("executionStats");

// Example: Find books by author and published_year and explain the query plan
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");