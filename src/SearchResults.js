import { Component, Fragment } from 'react';
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
        maxResults: 12
      }
    }).then((results) => {
      const bookResults = results.data.items;
      const formattedBookResults = [];
      bookResults.forEach((book) => {
        formattedBookResults.push(this.createBookObj(book));
      });
      this.setState({
        books: formattedBookResults
      });
    }).catch((error) => {
      console.log(error);
    })
  }

  createBookObj = (book) => {
      const bookObj = {};
      bookObj.id = book.id;
      bookObj.title = this.handleMissingInfoError(book.volumeInfo.title, 'Unknown title');
      bookObj.authors = this.handleMissingInfoError(book.volumeInfo.authors, 'Unknown author');
      bookObj.category = this.handleMissingInfoError(book.volumeInfo.categories, 'Unknown genre');
      bookObj.rating = this.handleMissingInfoError(book.volumeInfo.averageRating, 'No rating');
      bookObj.bookImg = this.handleMissingCoverImage(book.volumeInfo) // add stock no image available 
      bookObj.pageCount = this.handleMissingInfoError(book.volumeInfo.pageCount, 'Unknown page count');
      bookObj.publisher = this.handleMissingInfoError(book.volumeInfo.publisher, 'Unknown publisher');
      bookObj.language = this.handleMissingInfoError(book.volumeInfo.language, 'Unknown language');
      bookObj.description = this.handleMissingInfoError(book.volumeInfo.description, 'No description');
      bookObj.publishedDate = this.handleMissingInfoError(book.volumeInfo.publishedDate, 'Unknown published date');
      return bookObj;
  }

  componentDidMount() {
    this.newSearch = this.props.match.params.search;
    this.apiCall(this.props.match.params.search);
  }

  componentDidUpdate() {
    if (this.newSearch !== this.props.match.params.search) {
      this.newSearch = this.props.match.params.search;
      this.apiCall(this.newSearch);
    }
  }

  handleClick = (bookObject) => {
    const dbRef = firebase.database().ref()
    const bookAndCompleted = {
      book: bookObject,
      completed: false
    }
    dbRef.push(bookAndCompleted);
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

  // Render relevant information on screen
  renderInformation = (book) => {
    return (
      <div className="result-box" key={book.id} style={{"background-image": `url(${book.bookImg})`}}>
        <img src={book.bookImg} alt={`Book cover for ${book.title}`} />
        <div className="descriptionContainer">
          <h2 className="title">{book.title}</h2>
          <h3>By: {book.authors}</h3>
          <h3>Genre: {book.category}</h3>
          <h4>Rating: {book.rating}</h4>
        </div>
        <div className="buttonContainer">
          <button><i className='fas fa-info-circle'></i>  More Details</button>
          <button onClick={() => { this.handleClick(book) }}><i className='fas fa-plus'></i>  Add to my bookshelf</button>
        </div>
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
      <section className="searchResSection">
        {
          this.state.books
            ? this.state.books.map((book) => this.renderInformation(book))
            : this.renderNoResultMessage()
        }
      </section>
    )
  }
}


export default SearchResults;