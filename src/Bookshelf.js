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
        bookArray.push([eachBook, finishedReading, bookKey]);
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

  handleRemoveBook = (bookId) => {
    const dbRef = firebase.database().ref()
    dbRef.child(bookId).remove();
  }

  // If the cover image is missing, display no-cover image
  handleMissingCoverImage = (info) => {
    if (info.imageLinks) {
      return info.imageLinks.thumbnail;
    } else {
      return noCover;
    }
  }

  // Create infinite loop for the carousel display  
  indexLoop = (index) => {
    if (index < 0) {
      // if the index is less than 0, then set it to max index minus the value of the index itself; '+' is used in the code because index is negative  
      index = this.state.savedBooks.length + index;
    } else if (index > this.state.savedBooks.length - 1) {
      // if the index is more than max index, then set it to be the difference between itself and the length of the array
      index = index - this.state.savedBooks.length;
    }
    return index;
  }
  
  // Function to display individual books  
  displayBook = (key, className, bookImageUrl, altText) => {
      return(
          <div key={key} className={className}>
              <img src={bookImageUrl} alt={altText} />
          </div>
      )
  }
  
  // Render the books on the screen
  renderBookDisplay = (numOfBooks) => {
    // Check if the number of books to display exceeds the number of saved books; if so, then set the number of books to display to equal the number of saved books
    if (numOfBooks > this.state.savedBooks.length) {
        numOfBooks = this.state.savedBooks.length;
    }
    // If the number of books to display is even, make it odd by take 1 away so the carousel display is balanced
    if (numOfBooks % 2 === 0) {
        numOfBooks -= 1;
    }
    // Set the start index of the books on the carousel display
    let startIndex = this.state.indexOfDisplayedBook - Math.floor(numOfBooks / 2);
    // Push the books to display into the displayArray
    let displayArray = [];
    for (let i = 0; i < numOfBooks; i++) {
        startIndex = this.indexLoop(startIndex);
        displayArray.push(this.state.savedBooks[startIndex]);
        startIndex++;
    }
    // Find the firebase ID of the displayed book; to be passed as a parameter into the handleRemoveBook function
    const firebaseIdOfDisplayedBook = this.state.savedBooks[this.state.indexOfDisplayedBook][2];
    return (
        <section className="carousel">
            <div className="bookShelfDisplay">
                <i className="fas fa-chevron-left" onClick={() => this.handleClick(-1)}></i>
                {
                    displayArray.map((book, index) => {
                        let className = '';
                        if (index === Math.floor(numOfBooks / 2)) {
                            className = 'displayedBook';
                        } else {
                            className = 'shelvedBooks';
                        }
                        const bookImageUrl = this.handleMissingCoverImage(book[0]);
                        const altText = book[0].title;
                        const key = book[2];
                        return this.displayBook(key, className, bookImageUrl, altText);
                    })
                }
                <i className="fas fa-chevron-right" onClick={() => this.handleClick(1)}></i>
            </div>
            <button onClick={() => this.handleRemoveBook(firebaseIdOfDisplayedBook)} className='removeBook'>Remove</button>
        </section>
    )
  }

  renderErrorMessage = () => {
    return (
      <h2 className="bookshelfEmptyMessage">No saved books yet!</h2>
    )
  }

  render() {
    return (
      <div className="bookshelf">
        {
          this.state.savedBooks.length
            ? this.renderBookDisplay(9)
            : this.renderErrorMessage()
        }
      </div>
    )
  }
}

export default Bookshelf;