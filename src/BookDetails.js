import { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

class BookDetails extends Component {
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

  componentDidMount() {
    this.getDataFromFirebase();
  }

  componentWillUnmount() {
    this.dbRef.off();
  }

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

  handleRemoveBook = (bookId) => {
    this.dbRef.child(bookId).remove();
    this.setState({
      removed: true,
      saved: false
    })
  }

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

  renderButton = () => {
    return (
      this.state.removed || !this.state.saved
        ? <button onClick={() => this.handleAddBook(this.state.bookToDisplay)} className='addBook'>Add to bookshelf</button>
        : <button onClick={() => this.handleRemoveBook(this.state.firebaseIdOfDisplayedBook)} className='removeBook'>Remove book</button>
    )
  }

  renderCheckbox = () => {
    return (
      this.state.saved
        ? <div className="checkbox">
          <input checked={this.state.completed} onChange={() => this.handleCheckbox()} type="checkbox" name="completed" id="completed" />
          <label htmlFor="completed">Finsihed Reading</label>
        </div>
        : null
    )
  }

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

  renderInformation = (book) => {
    return (
      <div className="detailsFlexContainer container">
        {
          this.renderExitButton()
        }
        <div className="imageContainer">
          <img src={book.bookImg} alt={`Book cover for ${book.title}`} />
        </div>
        <div className="description">
          <h2 className="bold">{book.title}</h2>

          <h3>By: <span>{book.authors}</span>  | Genre: <span>{book.category}</span></h3>
          <h4><i className="fas fa-star"></i> : <span>{book.rating}</span></h4>
          <h4>Published by: <span>{book.publisher}</span> on: <span>{book.publishedDate}</span></h4>
          <h4 className="lastRow ">Page count:<span>{book.pageCount}</span> | Language: <span>{book.language}</span></h4>
          <h4><span>{book.description}</span></h4>

        </div>
        {
          this.renderButton()
        }
        {
          this.renderCheckbox()
        }
      </div>
    );
  }

  handleCheckbox = () => {
    this.setState({
      completed: !this.state.completed
    })
  }

  componentDidUpdate() {
    this.dbRef.child(this.state.firebaseIdOfDisplayedBook).update({ completed: this.state.completed });
  }

  render() {
    return (
      this.renderInformation(this.state.bookToDisplay)
    )
  }
}

export default BookDetails;