import { Component, Fragment } from 'react';
import firebase from './firebase.js';
import { Link } from 'react-router-dom';

class Bookshelf extends Component {
  // LIFE CYCLE METHODS ----------------------------------------------------------------------------------------------------------------------------------- //
  constructor() {
    super();
    this.dbRef = firebase.database().ref();
    this.state = {
      savedBooks: [],
      windowInnerWidth: 900,
      indexOfDisplayedBook: 0,
      gridDisplay: false
    }
  }

  /**
   * Get data from Firebase
   * Initialize window resize event listener and update the initial inner width of the viewport when the component first mounted
   */
  componentDidMount() {
    this.getFirebaseData();
    this.addWindowEventListener();
    this.setState({
      windowInnerWidth: window.innerWidth
    })
  }

  /**
   * Remove window resize event listener and turn of reference to Firebase when the component unmounts to prevent memory leakage
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
    this.dbRef.off();
  }

  // RENDER METHODS ------------------------------------------------------------------------------------------------------------------------------------------ //
  /**
   * Render individual books on the carousel display
   * @param {string} key The React key for the rendered componet; Firebase ID of the book to be displayed is used to set React key
   * @param {string} className The class name of the book; 'displayed' for the main displayed book; 'shelved' for the adjacent books
   * @param {string} bookImageUrl The source of the book cover image
   * @param {string} altText The alt-Text for the book cover image
   * @param {string} bookTitle The title of the main displayed book to create the link to its detail page
   */
  displayBook = (key, className, bookImageUrl, altText, bookTitle) => {
    return (
      <div key={key} className={className}>
        {
          className === 'displayedBook'
            ? <Link to={`/mybookshelf/${bookTitle}`}>
              <img src={bookImageUrl} alt={altText} />
            </Link>
            : <img src={bookImageUrl} alt={altText} />
        }
      </div>
    )
  }

  /**
   * Render the grid display for the bookshelf
   */
  renderGridDisplay = () => {
    const buttonText = this.props.language.remove;
    return (
      <section className="gridDisplay">
        <div className="bookShelfDisplay">
          {
            this.state.savedBooks.map((book) => {
              const bookImageUrl = book[0].bookImg;
              const altText = `Book cover for ${book[0].title}`;
              const key = book[2];
              const bookTitle = book[0].title;

              return (
                <div key={key} className="displayedBook">
                  <Link to={`/mybookshelf/${bookTitle}`}>
                    <img src={bookImageUrl} alt={altText} />
                  </Link>
                  <button onClick={() => this.handleRemoveBook(key)} className='removeBook'>{buttonText}</button>
                </div>
              )
            })
          }
        </div>
      </section>
    )
  }

  /**
   * Render the carousel display for the bookshelf
   * @param {integer} numOfBooks The number of books to be displayed on the carousel
   */
  renderCarousel = (numOfBooks) => {
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
    const buttonText = this.props.language.remove;
    return (
      <section className="carousel">
        <div className="bookShelfDisplay">
          <button className="chevronButton" aria-label="display next books in bookshelf"><i className="fas fa-chevron-left" onClick={() => this.handleBookshelfNav(-1)}></i></button>
          {
            displayArray.map((book, index) => {
              let className = '';
              if (index === Math.floor(numOfBooks / 2)) {
                className = 'displayedBook';
              } else {
                className = 'shelvedBooks';
              }
              const bookImageUrl = book[0].bookImg;
              const altText = `Book cover for ${book[0].title}`;
              const key = book[2];
              const bookTitle = book[0].title;
              return this.displayBook(key, className, bookImageUrl, altText, bookTitle);
            })
          }
          <button className="chevronButton" aria-label="display previous books in bookshelf"><i className="fas fa-chevron-right" onClick={() => this.handleBookshelfNav(1)}></i></button>
        </div>
        <button onClick={() => this.handleRemoveBook(firebaseIdOfDisplayedBook)} className='removeBook'>{buttonText}</button>
      </section>
    )
  }

  /**
   * Render all books, display toggle button, and completion percentage on the screen
   * @param {integer} numOfBooks The number of books to be displayed on the carousel
   */
  renderBookDisplay = (numOfBooks) => {
    return (
      <Fragment>
        <div className="dashboardContainer">
          <button className="gridDisplayButton" onClick={() => this.toggleDisplay()}>
            {
              this.state.gridDisplay
                ? <i className="fas fa-sort"></i>
                : <i className="fas fa-grip-horizontal"></i>
            }   
          </button>
          <h3>{`${this.completedCalculation()}% ${this.props.language.readingCompleted}!`}</h3>
        </div>
        {
          this.state.gridDisplay
            ? this.renderGridDisplay()
            : this.renderCarousel(numOfBooks)
        }
      </Fragment>
    )
  }

  /**
   * Render the message when there are no saved books
   */
  renderNoBooksMessage = () => {
    return (
      <h2 className="bookshelfEmptyMessage">No saved books yet!</h2>
    )
  }

  // EVENT HANDLING METHODS --------------------------------------------------------------------------------------------------------------------------------- //
  /**
   * Get saved books data from Firebase and update the class component state 
   */
  getFirebaseData = () => {
    this.dbRef.on('value', (data) => {
      const firebaseBookObj = data.val();
      const bookArray = [];
      for (let bookKey in firebaseBookObj) {
        const eachBook = firebaseBookObj[bookKey].book;
        const finishedReading = firebaseBookObj[bookKey].completed;
        const saved = firebaseBookObj[bookKey].saved;
        if (saved) {
          bookArray.push([eachBook, finishedReading, bookKey]);
        }
      }
      this.setState({
        savedBooks: bookArray
      })
    });
  }

  /**
   * Update the class component state 'windowInnerWidth' when the window size changes
   */
  resizeWindow = () => {
    this.setState({
      windowInnerWidth: window.innerWidth
    })
  }

  /**
   * Handle window resize event
   */
  addWindowEventListener = () => {
    this.resizeWindow();
    window.addEventListener('resize', this.resizeWindow);
  }

  /**
   * Determine the number of books to display on the carousel depending on the inner width of the viewport
   */
  getNumOfBooksToDisplayOnCarousel = () => {
    if (this.state.windowInnerWidth > 1250) {
      return 9;
    } else if (this.state.windowInnerWidth > 900) {
      return 5;
    } else if (this.state.windowInnerWidth > 800) {
      return 3;
    } else {
      return 1;
    }
  }

  /**
   * Remove a book from Firebase and update the class component state
   * @param {string} bookId The Firebase ID of the book to be removed
   */
  handleRemoveBook = (bookId) => {
    this.dbRef.child(bookId).remove();
    // Error handling when the index of displayed book is greater than the max index of saveBooks array
    if (this.state.indexOfDisplayedBook >= this.state.savedBooks.length - 1) {
      this.setState({
        indexOfDisplayedBook: this.state.indexOfDisplayedBook - 1
      })
    }
  }

  /**
   * Handle carousel book display navigation
   * @param {integer} change Increment / Decrement of the index of the displayed book; +1 if next book button is clicked; -1 if previous book button is clicked
   */
  handleBookshelfNav = (change) => {
    let newIndex = this.state.indexOfDisplayedBook + change;
    newIndex = this.indexLoop(newIndex);
    this.setState({
      indexOfDisplayedBook: newIndex
    })
  }

  /**
   * Create the infinite index loop for the carousel book display
   * @param {integer} index The index of the main displayed book
   */
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

  /**
   * Calculate the percentage of completed books against entire book collection
   */
  completedCalculation = () => {
    let completedBook = 0;
    this.state.savedBooks.forEach((book) => {
      if (
        book[1]
      ) { completedBook++ }
    })
    let completionPercentage = (completedBook * 100) / this.state.savedBooks.length;
    completionPercentage = Math.ceil(completionPercentage);
    return completionPercentage;
  }

  /**
   * Toggle between grid and carousel display
   */
  toggleDisplay = () => {
    this.setState({
      gridDisplay: !this.state.gridDisplay
    })
  }
  
  // MAIN RENDER METHOD ------------------------------------------------------------------------------------------------------------------------------------- //
  render() {
    let className;
    this.state.gridDisplay ? className = 'gridBookshelf' : className = "carouselBookshelf";
    return (
      <div className={className}>
        {
          this.state.savedBooks.length
            ? this.renderBookDisplay(this.getNumOfBooksToDisplayOnCarousel())
            : this.renderNoBooksMessage()
        }
      </div>
    )
  }
}

export default Bookshelf;