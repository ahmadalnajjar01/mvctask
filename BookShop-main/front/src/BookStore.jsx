
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/storybook");
        setBooks(response.data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب البيانات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(6);

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    author: '',
    genre: '',
    publishDate: '',
    description: '',
    coverImage: 'https://via.placeholder.com/150'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // التعامل مع تغييرات النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   if (!formData.title || !formData.author || !formData.genre) {
     setError("يرجى ملء جميع الحقول المطلوبة");
     return;
   }

   try {
     if (isEditing) {
       // تحديث كتاب موجود
       const response = await axios.patch(
         `http://localhost:8000/api/editbook/${formData.id}`,
         {
           title: formData.title,
           author: formData.author,
           genre: formData.genre,
           publish_date: formData.publishDate,
           description: formData.description,
           cover_image: formData.coverImage,
         }
       );
       console.log("Updated Book:", response.data); // Log the response
       setBooks(
         books.map((book) => (book.id === formData.id ? response.data : book))
       );
       setIsEditing(false);
     } else {
       // إضافة كتاب جديد
       const response = await axios.post("http://localhost:8000/api/newbook", {
         title: formData.title,
         author: formData.author,
         genre: formData.genre,
         publish_date: formData.publishDate,
         description: formData.description,
         cover_image: formData.coverImage,
       });
       console.log("Added Book:", response.data); // Log the response
       setBooks([...books, response.data]);
     }

     setFormData({
       id: null,
       title: "",
       author: "",
       genre: "",
       publishDate: "",
       description: "",
       coverImage: "https://via.placeholder.com/150",
     });

     setShowForm(false);
     setError(null);
   } catch (err) {
     setError("حدث خطأ أثناء معالجة الطلب");
     console.error("API Error:", err.response?.data || err.message);
   }
 };

// تحميل بيانات الكتاب للتحرير
const handleEdit = (book) => {
    setFormData({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        publishDate: book.publish_data,  // ✅ تصحيح الحقل
        description: book.description,
        coverImage: book.cover_image
    });
    
    setIsEditing(true);
    setShowForm(true);
    setError(null);
};




  // حذف كتاب
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/deletebook/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      setError('حدث خطأ أثناء حذف الكتاب');
    }
  };

  // البحث في الكتب
 const filteredBooks = books.filter(
   (book) =>
     (book.title?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
     (book.author?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
     (book.genre?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
 );
  // ترتيب الكتب
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy].localeCompare(b[sortBy]);
    } else {
      return b[sortBy].localeCompare(a[sortBy]);
    }
  });

  // الصفحات
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  // التنقل بين الصفحات
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">متجر الكتب العربية</h1>

      {/* شريط البحث والترتيب */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="ابحث عن كتاب، مؤلف، أو تصنيف..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <label className="font-medium text-gray-700">ترتيب حسب:</label>
          <select
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">العنوان</option>
            <option value="author">المؤلف</option>
            <option value="publishDate">تاريخ النشر</option>
          </select>

          <button
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <button
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              setFormData({
                id: null,
                title: '',
                author: '',
                genre: '',
                publishDate: '',
                description: '',
                coverImage: '/api/placeholder/150/200'
              });
              setIsEditing(false);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'إلغاء' : 'إضافة كتاب جديد'}
          </button>
        </div>
      </div>

      {/* نموذج إضافة/تحرير كتاب */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'تحرير كتاب' : 'إضافة كتاب جديد'}</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">عنوان الكتاب*</label>
              <input
                type="text"
                name="title"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">المؤلف*</label>
              <input
                type="text"
                name="author"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">التصنيف*</label>
              <input
                type="text"
                name="genre"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.genre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">تاريخ النشر</label>
              <input
                type="date"
                name="publishDate"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.publishDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">الوصف</label>
              <textarea
                name="description"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? 'تحديث الكتاب' : 'إضافة الكتاب'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* قائمة الكتب */}
      {loading ? (
        <p className="text-center">جاري تحميل الكتب...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBooks.map(book => (
            <div key={book.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">المؤلف: {book.author}</p>
                <p className="text-sm text-gray-500">التصنيف: {book.genre}</p>
                <p className="text-sm text-gray-500">تاريخ النشر: {book.publishDate}</p>
                <p className="text-sm mt-2">{book.description}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(book)}
                  >
                    تعديل
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(book.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* التنقل بين الصفحات */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`p-2 px-4 rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookStore;

