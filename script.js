// Bookshelf App JavaScript

const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];

// Load books from localStorage
function loadBooksFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData) {
        books = JSON.parse(serializedData);
    }
}

// Save books to localStorage
function saveBooksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Add book to localStorage
function addBookToStorage(book) {
    book.year = parseInt(book.year, 10); // Ensure year is stored as a number
    books.push(book);
    saveBooksToStorage();
    renderBooks();
}

// Remove book by ID
function removeBook(id) {
    books = books.filter((book) => book.id !== id);
    saveBooksToStorage();
    renderBooks();
}

// Toggle book completion status
function toggleBookCompletion(id) {
    const book = books.find((book) => book.id === id);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooksToStorage();
        renderBooks();
    }
}

// Generate book item HTML
function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.classList.add("book-item");

    bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${
        book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
      }</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
    </div>
  `;

    // Add event listeners to buttons
    const toggleButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
    toggleButton.addEventListener("click", () => toggleBookCompletion(book.id));

    const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');
    deleteButton.addEventListener("click", () => removeBook(book.id));

    return bookItem;
}

// Render books to the appropriate sections
function renderBooks() {
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

// Add new book from form
function handleAddBook(event) {
    event.preventDefault();

    const titleInput = document.getElementById("bookFormTitle");
    const authorInput = document.getElementById("bookFormAuthor");
    const yearInput = document.getElementById("bookFormYear");
    const isCompleteInput = document.getElementById("bookFormIsComplete");

    const newBook = {
        id: +new Date(),
        title: titleInput.value,
        author: authorInput.value,
        year: yearInput.value,
        isComplete: isCompleteInput.checked,
    };

    addBookToStorage(newBook);

    // Reset form
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;
}

// Search books by title
function handleSearchBook(event) {
    event.preventDefault();
    const searchInput = document.getElementById("searchBookTitle");
    const searchTerm = searchInput.value.toLowerCase();

    const bookItems = document.querySelectorAll('[data-testid="bookItem"]');
    bookItems.forEach((item) => {
        const title = item.querySelector('[data-testid="bookItemTitle"]').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            item.setAttribute("data-highlight", "true");
        } else {
            item.removeAttribute("data-highlight");
        }
    });
}

// Initialize app
function initApp() {
    loadBooksFromStorage();
    renderBooks();

    const bookForm = document.getElementById("bookForm");
    bookForm.addEventListener("submit", handleAddBook);

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", handleSearchBook);
}

// Run the app
window.addEventListener("DOMContentLoaded", initApp);