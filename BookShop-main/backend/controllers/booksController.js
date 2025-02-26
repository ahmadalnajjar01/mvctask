const booksModel = require('../models/booksmodel');

const getBooks = async (req, res) => {
    try {
        const result = await booksModel.getBooks();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBookById = async (req, res) => {   
    try {
        const { id } = req.params;
        const result = await booksModel.getBookById(id);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const addBook = async (req, res) => {
    try {
        const { title, author, genre, publish_date, description, cover_image } = req.body;

        const result = await booksModel.addBook(title, author, genre, publish_date, description, cover_image);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

const editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, publish_date, description, cover_image } =
      req.body;

    if (
      !title &&
      !author &&
      !genre &&
      !publish_date &&
      !description &&
      !cover_image
    ) {
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });
    }

    const result = await booksModel.editBook(
      id,
      title,
      author,
      genre,
      publish_date,
      description,
      cover_image
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await booksModel.deleteBook(id);
        res.json({ message: "Book deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getBooks, getBookById, addBook, editBook, deleteBook };