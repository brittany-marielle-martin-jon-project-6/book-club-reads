import { Component } from 'react';
import firebase from './firebase.js';
import noCover from './assets/noCover.jpg';

class Bookshelf extends Component {
    constructor() {
        super();
        this.state = {
            savedBooks: [],
            indexOfDisplayedBook: 0
        }
    }

    componentDidMount() {
        const dbRef = firebase.database().ref();
        dbRef.on('value', (data) => {
            const firebaseBookObj = data.val();
            const bookArray = [];
            for (let bookKey in firebaseBookObj) {
                const eachBook = firebaseBookObj[bookKey].book;
                const finishedReading = firebaseBookObj[bookKey].completed;
                bookArray.push([eachBook, finishedReading]);
            }
            this.setState({
                savedBooks: bookArray
            })
        });
    }

    componentDidUpdate() {

    }

    handleClick = (change) => {
        let newIndex = this.state.indexOfDisplayedBook + change;
        if (newIndex < 0) {
            newIndex = this.state.savedBooks.length - 1;
        } else if (newIndex > this.state.savedBooks.length - 1) {
            newIndex = 0;
        }
        this.setState({
            indexOfDisplayedBook: newIndex
        })
    }

    // If the cover image is missing, display no-cover image
    handleMissingCoverImage = (info) => {
        if (info.imageLinks) {
            return info.imageLinks.thumbnail;
        } else {
            return noCover;
        }
    }

    // display this.state.savedBooks.slice(indexOfDisplayedBook, indexOfDisplayedBook + 1)

    renderBookDisplay = () => {
        const book = this.state.savedBooks[this.state.indexOfDisplayedBook];
        const bookImg = this.handleMissingCoverImage(book[0]) // add stock no image available 
        console.log(book[0][0])
        console.log(book)
        return(
            <img src={bookImg} alt="dfshu"/>
        )
    }

    renderErrorMessage = () => {
        return(
            <h2>No saved books yet!</h2>
        )
    }

    render() {
        return(
            <div className="bookshelf">
                <button onClick={() => this.handleClick(-1)}>Previous</button>
                {
                    this.state.savedBooks.length
                        ? this.renderBookDisplay()
                        : this.renderErrorMessage()
                }
                <button onClick={() => this.handleClick(1)}>Next</button>
            </div>
        )
    }
}

export default Bookshelf;