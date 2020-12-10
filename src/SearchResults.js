import { Component } from 'react';
import axios from 'axios';
import noCover from './assets/noCover.jpg';
import firebase from './firebase.js';
import { Link } from 'react-router-dom';

class SearchResults extends Component {
  constructor() {
    super();
    this.newSearch = '';
    this.dbRef = firebase.database().ref();
    this.books = [];
    this.maxStartIndexOfDisplayedResults = 0;
    this.state = {
      books: [],
      startIndex: 0,
      next: false,
      pageNumber: 1
    }
  }

  apiCall = (input) => {
    axios({
      url: 'https://www.googleapis.com/books/v1/volumes',
      method: 'GET',
      responseType: 'json',
      params: {
        q: input,
        maxResults: 12,
        startIndex: this.state.startIndex
      }
    }).then((results) => {
      const bookResults = results.data.items;
      bookResults.forEach((book) => {
        this.books.push(this.createBookObj(book));
      });
      this.setState({
        books: this.books
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
    console.log('start index', this.state.startIndex)
    console.log('max start index', this.maxStartIndexOfDisplayedResults)
    if (this.state.next && this.state.startIndex > this.maxStartIndexOfDisplayedResults) {
      console.log('api call')
      if (this.state.startIndex > this.maxStartIndexOfDisplayedResults) {
        this.maxStartIndexOfDisplayedResults = this.state.startIndex;
      }
      this.apiCall(this.newSearch);
      this.setState({
        next: false
      })
    }
  }

  handleSaveBook = (bookObject) => {
    const bookAndCompleted = {
      book: bookObject,
      completed: false,
      saved: true
    }
    this.dbRef.push(bookAndCompleted);
  }

  handleMoreDetails = (bookObject) => {
    const bookAndCompleted = {
      book: bookObject,
      completed: false,
      saved: false
    }
    this.dbRef.push(bookAndCompleted);
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
  handleLongInfo = (info, maxLength) => {
    if (info.length > maxLength) {
      if (info.charAt(maxLength - 1) !== ' ') {
        const omittedInfo = info.slice(maxLength, info.length);
        let positionOfNextSpace = omittedInfo.search(' ');
        if (positionOfNextSpace < 0) {
          const numOfCharsToEndOfString = info.length - maxLength;
          if (numOfCharsToEndOfString < 10) {
            positionOfNextSpace = numOfCharsToEndOfString;
          }
        }
        maxLength += positionOfNextSpace;
      }
      info = info.slice(0, maxLength);
      info += ' ...';
    }
    return info;
  }

  // Render relevant information on screen
  renderInformation = (book) => {
    return (
      <div className="result-box" key={book.id} style={{"backgroundImage": `url(${book.bookImg})`}}>
        <img src={book.bookImg} alt={`Book cover for ${this.handleLongInfo(book.title, 40)}`} />
        <div className="descriptionContainer">
          <h2 className="title">{this.handleLongInfo(book.title, 50)}</h2>
          <h3>By: {book.authors}</h3>
          <h3>Genre: {book.category}</h3>
          <h4>Rating: {book.rating}</h4>
        </div>
        <div className="buttonContainer">
          <Link to={`/search/moredetails/${book.title}`}>
          <button onClick={() => { this.handleMoreDetails(book) }}><i className='fas fa-info-circle'></i>  More Details</button>
          </Link>
          <button onClick={() => { this.handleSaveBook(book) }}><i className='fas fa-plus'></i>  Add to my bookshelf</button>
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

  handleNextPage = () => {
    let newStartIndex = this.state.startIndex + 12;
    this.setState({
      startIndex: newStartIndex,
      next: true,
      pageNumber: this.state.pageNumber + 1
    })
  }

  handlePreviousPage = () => {
    let newStartIndex = this.state.startIndex - 12;
    if (newStartIndex < 0) {
      newStartIndex = 0;
    }
    this.setState({
      startIndex: newStartIndex,
      pageNumber: this.state.pageNumber - 1
    })
  }

  renderPaginationButtons = () => {
    return(
      <div>
        <button onClick={this.handlePreviousPage}>Previous</button>
        <button onClick={this.handleNextPage}>Next</button>
      </div>
    )
  }

  render() {
    const displayedResults = this.state.books.slice(this.state.startIndex, this.state.startIndex + 12);
    return (
      <div>

        <section className="searchResSection">
          {
            displayedResults
              ? displayedResults.map((book) => this.renderInformation(book))
              : this.renderNoResultMessage()
          }
        </section>
        {
          this.renderPaginationButtons()
        }
      </div>
    )
  }
}


export default SearchResults;