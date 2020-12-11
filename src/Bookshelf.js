import { Component, Fragment } from 'react';
import firebase from './firebase.js';
import { Link } from 'react-router-dom';

class Bookshelf extends Component {
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


  componentDidMount() {
    this.getFirebaseData();
    this.addWindowEventListener();
    this.setState({
      windowInnerWidth: window.innerWidth
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
    this.dbRef.off();
  }

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

  resizeWindow = () => {
    this.setState({
      windowInnerWidth: window.innerWidth
    })
  }

  // Add event listener to window resizes
  addWindowEventListener = () => {
    this.resizeWindow();
    window.addEventListener('resize', this.resizeWindow);
  }

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

  handleRemoveBook = (bookId) => {
    this.dbRef.child(bookId).remove();
    // Error handling when the index of displayed book is greater than the max index of saveBooks array
    if (this.state.indexOfDisplayedBook >= this.state.savedBooks.length - 1) {
      this.setState({
        indexOfDisplayedBook: this.state.indexOfDisplayedBook - 1
      })
    }
  }

  // Function to move navigate bookshelf display
  handleBookshelfNav = (change) => {
    let newIndex = this.state.indexOfDisplayedBook + change;
    newIndex = this.indexLoop(newIndex);
    this.setState({
      indexOfDisplayedBook: newIndex
    })
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
  displayBook = (key, className, bookImageUrl, altText, bookTitle) => {
    return (
      <div key={key} className={className}>
        {
          className === 'displayedBook'
            ? this.createLink(bookTitle, () => <img src={bookImageUrl} alt={altText} />)
            : <img src={bookImageUrl} alt={altText} />
        }
      </div>
    )
  }

  // Create link for each book
  createLink = (bookTitle, callbackHtml) => {
    return (
      <Link to={`/mybookshelf/${bookTitle}`}>
        {
          callbackHtml()
        }
      </Link>
    )
  }

  // Toggle between grid and carousel display
  toggleDisplay = () => {
    this.setState({
      gridDisplay: !this.state.gridDisplay
    })
  }

  // Render the books on the screen
  renderBookDisplay = (numOfBooks) => {
    return (
      <Fragment>
        <div className="dashboardContainer">
          <button className="gridDisplayButton" onClick={() => this.toggleDisplay()}><i className="fas fa-grip-horizontal"></i></button>
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
          {
        
          }
          <button className="chevronButton" aria-label="display previous books in bookshelf"><i className="fas fa-chevron-right" onClick={() => this.handleBookshelfNav(1)}></i></button>
        </div>
        <button onClick={() => this.handleRemoveBook(firebaseIdOfDisplayedBook)} className='removeBook'>{buttonText}</button>
      </section>
    )
  }

  renderErrorMessage = () => {
    return (
      <h2 className="bookshelfEmptyMessage">No saved books yet!</h2>
    )
  }

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

  render() {
    let className;
    this.state.gridDisplay ? className = 'gridBookshelf' : className = "carouselBookshelf";
    return (
      <div className={className}>
        {
          this.state.savedBooks.length
            ? this.renderBookDisplay(this.getNumOfBooksToDisplayOnCarousel())
            : this.renderErrorMessage()
        }
      </div>
    )
  }
}

export default Bookshelf;