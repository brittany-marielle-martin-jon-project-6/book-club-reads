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

    handleClick = (change) => {
        let newIndex = this.state.indexOfDisplayedBook + change;
        newIndex = this.indexLoop(newIndex);
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

    indexLoop = (index) => {
        if (index < 0) {
            index = this.state.savedBooks.length - 1
        } else if (
            index > this.state.savedBooks.length - 1
        ) {
            index = 0;
        }
        return index;
    }
    // display this.state.savedBooks.slice(indexOfDisplayedBook, indexOfDisplayedBook + 1)

    renderBookDisplay = () => {
        // const book = this.state.savedBooks.slice(this.state.indexOfDisplayedBook, this.state.indexOfDisplayedBook + 2);

        let leftBookIndex = this.state.indexOfDisplayedBook -1;
        leftBookIndex = this.indexLoop(leftBookIndex);

        const leftBook = this.state.savedBooks[leftBookIndex];

        let rightBookIndex = this.state.indexOfDisplayedBook + 1;
        rightBookIndex = this.indexLoop(rightBookIndex);

        const rightBook = this.state.savedBooks[rightBookIndex];
        const displayedBook = this.state.savedBooks[this.state.indexOfDisplayedBook];
        const bookImg = this.handleMissingCoverImage(displayedBook[0]) // add stock no image available 
        const leftBookImg = this.handleMissingCoverImage(leftBook[0]);
        const rightBookImg = this.handleMissingCoverImage(rightBook[0]);
        return(
            <div className="bookShelfDisplay">
                <img src={leftBookImg} alt="dfdf"/>
                <img src={bookImg} alt="dfshu" />
                <img src={rightBookImg} alt="asdf"/>
            </div>

            
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