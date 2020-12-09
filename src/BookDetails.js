import { Component } from 'react';
import firebase from 'firebase';

class BookDetails extends Component {
    constructor() {
        super();
        this.dbRef = firebase.database().ref();
        this.state = {
            bookToDisplay: {}
        }
    }

    renderInformation = (book) => {
        return (
            <div>
                <h2>{book.title}</h2>
                <h3>{book.authors}</h3>
                <h3>{book.category}</h3>
                <h4>{book.rating}</h4>
                <h4>{book.publishedDate}</h4>
                <h4>{book.publisher}</h4>
                <h4>{book.pageCount}</h4>
                <h4>{book.language}</h4>
                <h4>{book.description}</h4>
                <img src={book.bookImg} alt={`Book cover for ${book.title}`} />
            </div>
        );
    }

    componentDidMount() {
        this.dbRef.on('value', (data) => {
            const firebaseDataObj = data.val();
            for (let key in firebaseDataObj) {
                const bookTitle = firebaseDataObj[key].book.title;
                if (bookTitle === this.props.match.params.book) {
                    const bookObj = firebaseDataObj[key].book;
                    this.setState({
                        bookToDisplay: bookObj
                    })
                }
            }
        });
    }

    componentWillUnmount() {
        this.dbRef.off();
    }

    render() {
        return(
            this.renderInformation(this.state.bookToDisplay)
        )
    }

}

export default BookDetails;