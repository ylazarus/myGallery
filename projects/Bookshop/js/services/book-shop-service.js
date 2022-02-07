'use strict'
const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 5
const gTitles = ['Harry Potter', 'The Lord of the Rings', 'The Bible', 'War and Peace']

var gBooks
var gCurrBookForModal
var gSortBy
var gPageIdx = 0


_createBooks()

function getBooks() {
    if (gSortBy === 'title') gBooks.sort((a, b) => {
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
    })
    if (gSortBy === 'id') gBooks.sort((a, b) => {
        if (a.id > b.id) return 1
        if (a.id < b.id) return -1

    })
    if (gSortBy === 'price') gBooks.sort((a, b) => a.price - b.price)

    const startIdx = gPageIdx * PAGE_SIZE
    var books = gBooks.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}


function addBook(title, price) {
    var bookToAdd = {
        title: title,
        price: price,
        id: makeId(),
        text: makeLorem(),
        rating: 0
    }
    gBooks.unshift(bookToAdd)
    _saveBooksToStorage()
}

function getBookById(bookId) {
    const book = gBooks.find((book) => bookId === book.id)
    gCurrBookForModal = book
    return book
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex((book) => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find((book) => bookId === book.id)
    book.price = newPrice
    _saveBooksToStorage
}

function decreaseRating() {
    const book = gBooks.find((book) => gCurrBookForModal === book)
    if (book.rating === 0) return
    book.rating--
    _saveBooksToStorage
    return book
}

function increaseRating() {
    const book = gBooks.find((book) => gCurrBookForModal === book)
    if (book.rating > 9) return
    book.rating++
    _saveBooksToStorage
    return book
}

function setSort(sortBy) {
    gSortBy = sortBy
}

function setNextPage() {
    if ((gPageIdx + 1) * PAGE_SIZE >= gBooks.length) return
    gPageIdx++
}

function setPrevPage(){
    if (gPageIdx === 0) return
    gPageIdx--
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []

        for (let i = 0; i < 16; i++) {
            var title = gTitles[getRandomIntInclusive(0, gTitles.length - 1)]
            books.push(_createBook(title))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(title) {
    return {
        id: makeId(),
        title: title,
        text: makeLorem(),
        rating: 0,
        price: getRandomIntInclusive(1, 20) + '.' + getRandomIntInclusive(0, 9) + '0'
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

