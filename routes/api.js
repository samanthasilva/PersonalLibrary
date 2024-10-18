"use strict";
const { Book } = require("../models");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      console.log("GET /api/books"); // Log para GET
      try {
        const data = await Book.find({});
        console.log("Retrieved books:", data); // Log dos livros recuperados
        const formatData = data.map((book) => ({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length,
        }));
        res.json(formatData); // Retorna um array (pode ser vazio)
      } catch (err) {
        console.error("Error retrieving books:", err);
        res.status(500).send("Error retrieving books");
      }
    })

    .post(async function (req, res) {
      console.log("POST /api/books with title:", req.body.title); // Log para POST
      let title = req.body.title;
      if (!title) {
        return res.status(200).send("missing required field title");
      }
      const newBook = new Book({ title, comments: [] });
      try {
        const data = await newBook.save();
        console.log("Book saved:", data); // Log do livro salvo
        res.json({ _id: data._id, title: data.title });
      } catch (err) {
        console.error("Error saving book:", err);
        res.status(500).send("there was an error saving");
      }
    })

    .delete(async function (req, res) {
      console.log("DELETE /api/books"); // Log para DELETE
      try {
        await Book.deleteMany({});
        res.send("complete delete successful");
      } catch (err) {
        console.error("Error deleting books:", err);
        res.status(500).send("error");
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      console.log(`GET /api/books/${bookid}`); // Log para GET com ID
      try {
        const data = await Book.findById(bookid);
        if (!data) {
          return res.status(200).send("no book exists");
        }
        res.json({
          comments: data.comments,
          _id: data._id,
          title: data.title,
          commentcount: data.comments.length,
        });
      } catch (err) {
        console.error("Error retrieving book:", err);
        res.status(500).send("Error retrieving book");
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      console.log(`POST /api/books/${bookid} with comment:`, comment); // Log para POST com ID e comentário
      if (!comment) {
        return res.status(200).send("missing required field comment");
      }
      try {
        const bookdata = await Book.findById(bookid);
        if (!bookdata) {
          return res.status(200).send("no book exists");
        }
        bookdata.comments.push(comment);
        const saveData = await bookdata.save();
        res.json({
          comments: saveData.comments,
          _id: saveData._id,
          title: saveData.title,
          commentcount: saveData.comments.length,
        });
      } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).send("Error updating book");
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      console.log(`DELETE /api/books/${bookid}`); // Log para DELETE com ID
      try {
        const data = await Book.findByIdAndDelete(bookid);
        if (!data) {
          return res.status(200).send("no book exists");
        }
        res.status(200).send("delete successful");
      } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).send("Error deleting book");
      }
    });
};
