import { Component } from 'react';
import axios from 'axios';
import noCover from './assets/noCover.jpg';
import firebase from './firebase.js';

class SearchResults extends Component {
    constructor() {
        super();
        this.newSearch = '';
        this.state = {
            books: [],
        }
    }

    apiCall = (input) => {
        axios({
            url: 'https://www.googleapis.com/books/v1/volumes',
            method: 'GET',
            responseType: 'json',
            params: {
                q: input,
                maxResults: 10
            }
        }).then((results) => {
            const bookResults = results.data.items;
            this.setState({
                books: bookResults
            });
        }).catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.newSearch = this.props.match.params.search;
        this.apiCall(this.props.match.params.search);
    }

    componentDidUpdate() {
        if (this.newSearch !== this.props.match.params.search){
            this.newSearch = this.props.match.params.search;
            this.apiCall(this.newSearch);
        }
    }

    handleClick = (bookObject) => {
        const dbRef = firebase.database().ref(2)
        dbRef.push(bookObject)
        // dbRef.child()
    }

    // Function to check if an info is missing. If so, display the corresponding message
    handleMissingInfoError = (info, message) => {
        let checkedInfo;
        if (info) {
            checkedInfo = this.parseBookInfo(info);
        } else {
            checkedInfo = message;
        }
        return checkedInfo;
    }

    // In case of multiple pieces of information, separate each with a comma, and add the word 'and' before the last one
    parseBookInfo = (info) => {
        if (typeof info === 'object') {
            if (info.length === 1) {
                return info;
            } else if (info.length === 2) {
                return `${info[0]} and ${info[1]}`;
            } else if (info.length > 2) {
                let parsedInfo = '';
                info.forEach((value, index) => {
                    if (index === info.length - 1) {
                        parsedInfo += `and ${value}`;
                    } else {
                        parsedInfo += `${value}, `;
                    }
                });
                return parsedInfo;
            }
        } else {
            return info;
        }
    }


    // If the cover image is missing, display no-cover image
    handleMissingCoverImage = (info) => {
        if (info.imageLinks) {
            return info.imageLinks.thumbnail;
        } else {
            return noCover;
        }
    }

    setUpDataBase() {
        // Make reference to database
        const dbRef = firebase.database().ref();
        // Get data from database
        let firebaseDataObj;
        dbRef.on('value', (data) => {
            firebaseDataObj = data.val();
        });
    }

    // createBookObject = () => {
    //     return 
    // }

    // Render relevant information on screen
    renderInformation = (book) => {
        const title = this.handleMissingInfoError(book.volumeInfo.title, 'Unknown title');
        const authors = this.handleMissingInfoError(book.volumeInfo.authors, 'Unknown author');
        const category = this.handleMissingInfoError(book.volumeInfo.categories, 'Unknown genre');
        const rating = this.handleMissingInfoError(book.volumeInfo.averageRating, 'No rating');
        const bookImg = this.handleMissingCoverImage(book.volumeInfo) // add stock no image available 
        const pageCount = this.handleMissingInfoError(book.volumeInfo.pageCount, 'Unknown page count');
        const buyBook = this.handleMissingInfoError(book.saleInfo.buyLink, 'Not available for purchase on Google Play');
        const publisher = this.handleMissingInfoError(book.volumeInfo.publisher, 'Unknown publisher');
        const language = this.handleMissingInfoError(book.volumeInfo.language, 'Unknown language');
        const description = this.handleMissingInfoError(book.volumeInfo.description, 'No description');
        const publishedDate = this.handleMissingInfoError(book.volumeInfo.publishedDate, 'Unknown published date');

        return (
            <div key={book.id}>
                <h2>{title}</h2>
                <h3>{authors}</h3>
                <h3>{category}</h3>
                <h4>{rating}</h4>
                <h4>{publishedDate}</h4>
                <h4>{publisher}</h4>
                <h4>{pageCount}</h4>
                <h4>{language}</h4>
                {
                    buyBook.includes('https')
                        ? <a href={buyBook}>Buy book</a>
                        : <p>{buyBook}</p>
                }
                <h4>{description}</h4>
                <img src={bookImg} alt={`Book cover for ${title}`} />
                <button onClick={() => {this.handleClick(book)}}>Add to my bookshelf</button>
            </div>
        );
    }

    // In case API call returns no results, render the following error message
    renderNoResultMessage = () => {
        return (
            <h2>No Results Found :(</h2>
        )
    }

    render() {
        return (
            <div>
                {
                    this.state.books
                        ? this.state.books.map((book) => this.renderInformation(book))
                        : this.renderNoResultMessage()
                }
            </div>
        )
    }
}

export default SearchResults;