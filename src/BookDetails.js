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
        return(
            this.state.removed || !this.state.saved
                ? <button onClick={() => this.handleAddBook(this.state.bookToDisplay)} className='addBook'>Add to bookshelf</button>
                : <button onClick={() => this.handleRemoveBook(this.state.firebaseIdOfDisplayedBook)} className='removeBook'>Remove book</button>
        )
    }

    renderCheckbox = () => {
        return(
            this.state.saved
                ?   <div>
                        <input checked={this.state.completed} onChange={() => this.handleCheckbox()} type="checkbox" name="completed" id="completed"/>
                        <label htmlFor="completed">Completed</label>
                    </div>
                :   null
        )
    }

    renderExitButton = () => {
        return(
            this.state.saved
                ? <Link to="/mybookshelf">
                    <button className="exitButton"><i className="fas fa-times-circle"></i></button>
                  </Link>
                : <Link to={`/search/${this.state.bookToDisplay.searchInput}`}>
                    <button className="exitButton"><i className="fas fa-times-circle"></i></button>
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
                    <h2>{book.title}</h2>
                    <h3>By: {book.authors} | Genre: {book.category}</h3>
                    <h4>Reader rating: {book.rating}</h4>
                    <h4>Published by: {book.publisher} on: {book.publishedDate}</h4>
                    <h4 className="lastRow">Page count: {book.pageCount} | Language: {book.language}</h4>
                    <h4>{book.description}</h4>
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
        this.dbRef.child(this.state.firebaseIdOfDisplayedBook).update({completed: this.state.completed});
    }

    render() {
        return(
            this.renderInformation(this.state.bookToDisplay)
        )
    }
}

export default BookDetails;