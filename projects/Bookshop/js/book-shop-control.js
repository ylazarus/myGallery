'use strict'

function init(){
    renderBooks()
}

function renderBooks(){
    var books = getBooks()
    var strHtmls = books.map(function (book){
        return `
        <tr class="book-row">
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.price}</td>
        
        <td><button class="btn-remove" onclick="onReadBook('${book.id}')">Read</button></td>
        <td><button class="btn-remove" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button class="btn-remove" onclick="onDeleteBook('${book.id}')">Delete</button></td>
        </tr>`
    })
    document.querySelector('tbody').innerHTML = strHtmls.join('')
}

function onSetSort(sortBy){
    setSort(sortBy)
    renderBooks()
}

function onAddBook(){
    var elTitle = document.querySelector('input[name=title]')
    var title = elTitle.value
    var elPrice = document.querySelector('input[name=price]')
    var price = +elPrice.value
    if (!title || !price) return
    addBook(title, price)
    renderBooks()
}

function onDecreaseRating(){
    var book = decreaseRating()
    var elRating = document.querySelector('.rating-container span')    
    elRating.innerText = book.rating
}

function onIncreaseRating(){
    var book = increaseRating()
    var elRating = document.querySelector('.rating-container span')    
    elRating.innerText = book.rating

}

function onReadBook(bookId){
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('p').innerText = book.text
    var elRating = document.querySelector('.rating-container span')    
    elRating.innerText = book.rating
    elModal.classList.add('open')
}


function onUpdateBook(bookId){
    var newPrice = +prompt('What should be the updated price?')
    newPrice = +newPrice.toFixed(2)
    updateBook(bookId, newPrice)
    renderBooks()
}


function onDeleteBook(bookId){
    removeBook(bookId)
    renderBooks()
    flashMsg(`book number ${bookId} has been deleted`)
}

function onCloseModal(){
    document.querySelector('.modal').classList.remove('open')

}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 2000)
}

function onNextPage() {
    setNextPage()
    renderBooks()
}

function onPrevPage() {
    setPrevPage()
    renderBooks()
}