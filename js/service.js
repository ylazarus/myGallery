'use strict'

var gProjs = [
    {
        id: 'minesweeper',
        name: 'Minesweeper',
        title: 'Project sprint 1 CA',
        desc: 'Self written in Vanilla JS with css styling',
        url: 'projects/Minesweeper',
        publishedAt: 'January 2022',
        labels: ['#matrixes', '#games']
    },
    {
        id: 'pac-man',
        name: 'Pacman',
        title: 'My own PacMan',
        desc: 'Simple, pared back design, great for first-time players',
        url: 'projects/Pacman',
        publishedAt: 'January 2022',
        labels: ['#matrixes', '#keyboard events']
    },
    {
        id: 'ball-board',
        name: 'Ball Board',
        title: 'Fun ball game',
        desc: 'Minimalist game that is fun to play',
        url: 'projects/Ball-Board',
        publishedAt: 'January 2022',
        labels: ['#matrixes', '#keyboard events']
    },
    {
        id: 'bookshop',
        name: 'Bookshop',
        title: 'Inventory tracker',
        desc: 'App for an owner of a bookshop to add, update and delete inventory',
        url: 'projects/Bookshop',
        publishedAt: 'February 2022',
        labels: ['#object manipulation', '#inventory']
    },
    {
        id: 'chess',
        name: 'Chess',
        title: 'Simple chess board',
        desc: 'Built to teach user how and where each piece moves',
        url: 'projects/Chess',
        publishedAt: 'January 2022',
        labels: ['#matrixes', '#logic']
    },
    {
        id: 'guess-me',
        name: 'Guess Me',
        title: '20 questions',
        desc: 'A charming djini will guess who you are thinking of, or get smarter trying',
        url: 'projects/Guess-Me',
        publishedAt: 'February 2022',
        labels: ['#linked list', '#conditions']
    }
]



function getProjects() {
    return gProjs
}