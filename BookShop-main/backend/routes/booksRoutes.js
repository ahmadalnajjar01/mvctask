const express = require("express");
const router = express.Router();
const {getBooks,addBook,editBook,deleteBook} = require('../controllers/bookscontroller');

router.get("/storybook",getBooks);
router.post("/newbook",addBook);
router.patch("/editbook/:id",editBook);
router.delete("/deletebook/:id",deleteBook);

module.exports = router;
