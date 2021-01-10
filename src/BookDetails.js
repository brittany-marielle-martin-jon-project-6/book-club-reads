import { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

class BookDetails extends Component {
  // LIFE CYCLE METHODS -------------------------------------------------------------------------------------------------------------------------- //
  constructor() {
    super();
    this.dbRef = firebase.database().ref();
    this.state = {
      bookToDisplay: {},
      firebaseIdOfDisplayedBook: '',
      removed: false,
      completed: false,
      saved: false
    }
  }

  /**
   * Get data from Firebase when the component mounted
   */
  componentDidMount() {
    this.getDataFromFirebase();
  }

  /**
   * Update Firbase to match the current class component state
   */
  componentDidUpdate() {
    this.dbRef.child(this.state.firebaseIdOfDisplayedBook).update({ completed: this.state.completed });
  }

  /**
   * Turn off reference to Firebase to prevent memory leakage
   */
  componentWillUnmount() {
    this.dbRef.off();
  }

  // RENDER METHODS -------------------------------------------------------------------------------------------------------------------------------- //
  /**
   * Render the add-to-bookshelf / remove-book button with corresponding event handler methods for onClick event
   */
  renderAddRemoveButton = () => {
    return (
      this.state.removed || !this.state.saved

        ? <button onClick={() => this.handleAddBook(this.state.bookToDisplay)} className='addBook'>{this.props.language.add}</button>

        : <button onClick={() => this.handleRemoveBook(this.state.firebaseIdOfDisplayedBook)} className='removeBook'>{this.props.language.removeBook}</button>
    )
  }

  /**
   * Render the completion checkbox with 'handleCheckbox' method for onChange event
   */
  renderCheckbox = () => {
    return (
      this.state.saved
        ? <div className="checkbox">
          <input checked={this.state.completed} onChange={() => this.handleCheckbox()} type="checkbox" name="completed" id="completed" />
          <label htmlFor="completed">{this.props.language.finishedReading}</label>
        </div>
        : null
    )
  }

  /**
   * Render the exit button and attach the corresponding event handlers depending on whether the user has saved the book
   * If the user has saved the book, link will take them to bookshelf; otherwise, link will take them back to the same search result page they were on
   */
  renderExitButton = () => {
    return (
      this.state.saved
        ? <Link to="/mybookshelf">
          <button className="exitButton" aria-label="return to previous screen"><i className="fas fa-times-circle"></i></button>
        </Link>
        : <Link to={`/search/${this.state.bookToDisplay.searchInput}`}>
          <button className="exitButton" aria-label="return to previous screen"><i className="fas fa-times-circle"></i></button>
        </Link>
    )
  }

  // EVENT HANDLING METHODS ------------------------------------------------------------------------------------------------------------------------ //
  /**
   * Get Date from firebase and save to states; check if the user has added a book to the bookshelf; if not, remove the temp book info from firebase
   */
  getDataFromFirebase = () => {
    this.dbRef.on('value', (data) => {
      const firebaseDataObj = data.val();
      for (let key in firebaseDataObj) {
        if (firebaseDataObj[key].book) {
          const bookTitle = firebaseDataObj[key].book.title;
          if (bookTitle === this.props.match.params.book) {
            const bookObj = firebaseDataObj[key].book;
            this.setState({
              bookToDisplay: bookObj,
              firebaseIdOfDisplayedBook: key,
              completed: firebaseDataObj[key].completed,
              saved: firebaseDataObj[key].saved
            })
          }
        } else {
          this.dbRef.child(key).remove();
        }
        if (!firebaseDataObj[key].saved) {
          this.dbRef.child(key).remove();
        }
      }
    });
  }

  /**
   * Remove book from Firebase and update class component state
   * @param {string} bookId The Firebase ID of the book to be removed 
   */
  handleRemoveBook = (bookId) => {
    this.dbRef.child(bookId).remove();
    this.setState({
      removed: true,
      saved: false
    })
  }

  /**
   * Add book to Firebase and update the class component state
   * @param {Object} bookObject The Object from Google Books API call that contains the information of the book to display
   */

  handleAddBook = (bookObject) => {
    const bookAndCompleted = {
      book: bookObject,
      completed: false,
      saved: true
    }
    this.dbRef.push(bookAndCompleted);
    this.setState({
      removed: false
    })
  }

  /**
   * Toggle the state 'completed' depending on whether the user has checked the checkbox
   */
  handleCheckbox = () => {
    this.setState({
      completed: !this.state.completed
    })
  }

  // MAIN RENDER METHOD ----------------------------------------------------------------------------------------------------------------------------- //
  render() {
    // Get the information for the book to display from state
    const book = this.state.bookToDisplay;
    return (
      <div className="detailsFlexContainer container">
        {
          this.renderExitButton()
        }
        <figure className="imageContainer">
          <img src={book.bookImg} alt={`Book cover for ${book.title}`} />
        </figure>
        <div className="description">
          <h2 className="bold">{book.title}</h2>

          <h3>{this.props.language.by} <span>{book.authors}</span>  | {this.props.language.genre} <span>{book.category}</span></h3>

          <h4><i className="fas fa-star"></i> : <span>{book.rating}</span></h4>

          <h4>{this.props.language.published} <span>{book.publisher}</span> - <span>{book.publishedDate}</span></h4>

          <h4 className="lastRow ">{this.props.language.pageCount}:<span>{book.pageCount}</span> | {this.props.language.language} <span>{book.language}</span></h4>

          <h4><span>{book.description}</span></h4>
        </div>
        {
          this.renderAddRemoveButton()
        }
        {
          this.renderCheckbox()
        }
      </div>
    );
  }
}

export default BookDetails;