import { Component } from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

class SearchBookDetails extends Component {
    constructor() {
        super();
        this.dbRef = firebase.database().ref();
        this.state = {
            bookToDisplay: {},
            firebaseIdOfDisplayedBook: '',
            removed: false,
            completed: false
        }
    }

    componentDidMount() {
        this.dbRef.on('value', (data) => {
            const firebaseDataObj = data.val();
            for (let key in firebaseDataObj) {
                const bookTitle = firebaseDataObj[key].book.title;
                if (bookTitle === this.props.match.params.book) {
                    const bookObj = firebaseDataObj[key].book;
                    this.setState({
                        bookToDisplay: bookObj,
                        firebaseIdOfDisplayedBook: key,
                        completed: firebaseDataObj[key].completed
                    })
                }
            }
        });
    }

    componentWillUnmount() {
        this.dbRef.off();
    }

    handleRemoveBook = (bookId) => {
        this.dbRef.child(bookId).remove();
        this.setState({
            removed: true
        })
    }

    handleAddBook = (bookObject) => {
        const bookAndCompleted = {
            book: bookObject,
            completed: false
        }
        this.dbRef.push(bookAndCompleted);
        this.setState({
            removed: false
        })
    }

    renderButton = () => {
        return (
            this.state.removed
                ? <button onClick={() => this.handleAddBook(this.state.bookToDisplay)} className='addBook'>Add to bookshelf</button>
                : <button onClick={() => this.handleRemoveBook(this.state.firebaseIdOfDisplayedBook)} className='removeBook'>Remove book</button>
        )
    }

    renderInformation = (book) => {
        return (
            <div className="detailsFlexContainer container">
                <Link to="/mybookshelf">
                    <button className="exitButton"><i className="fas fa-times-circle"></i></button>
                </Link>
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
                <input checked={this.state.completed} onChange={() => this.handleCheckbox()} type="checkbox" name="completed" id="completed" />
                <label htmlFor="completed">Completed</label>

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
        console.log(this.props)
        return (
            this.renderInformation(this.state.bookToDisplay)
        )
    }
}

export default SearchBookDetails;