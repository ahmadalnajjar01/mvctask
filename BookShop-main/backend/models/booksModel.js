const pool = require("../config/db");

const getBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE is_deleted = false");
    return result.rows;
  } catch (err) {
    throw err;
  }
};



const getBookById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1 AND is_deleted = false", [id]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const addBook = async (title, author, genre, publish_date, description, cover_image) => {
  try {
    const result = await pool.query(
      "INSERT INTO books (title, author, genre, publish_date, description, cover_image, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *",
      [title, author, genre, publish_date, description, cover_image]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const editBook = async (id, title, author, genre, publish_date, description, cover_image) => {
  try {
    const result = await pool.query(
      "UPDATE books SET title = $1, author = $2, genre = $3, publish_date = $4, description = $5, cover_image = $6 WHERE id = $7 AND is_deleted = false RETURNING *",
      [title, author, genre, publish_date, description, cover_image, id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const deleteBook = async (id) => {
  try {
    const result = await pool.query("UPDATE books SET is_deleted = true WHERE id = $1 RETURNING *", [id]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = { getBooks, getBookById, addBook, editBook, deleteBook };