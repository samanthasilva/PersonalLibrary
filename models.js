const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
});

// Exportando o modelo Book
const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
