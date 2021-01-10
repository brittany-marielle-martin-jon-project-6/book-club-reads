import { Component } from 'react';
import axios from 'axios';
import noCover from './assets/noCover.jpg';
import firebase from './firebase.js';
import { Link } from 'react-router-dom';

class SearchResults extends Component {
  // LIFE CYCLE METHODS ------------------------------------------------------------------------------------------------------------------------ //
  constructor() {
    super();
    this.noResults = false;
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

  /**
   * Get new search information from component props and bind it to a component global variable
   * Make API call based on the search information
   */
  componentDidMount() {
    this.newSearch = this.props.match.params.search;
    this.apiCall(this.props.match.params.search);
  }

  /**
   * Check if a new search is entered; if so, clear global book array and make new API call
   */
  componentDidUpdate() {
    if (this.newSearch !== this.props.match.params.search) {
      this.newSearch = this.props.match.params.search;
      this.books = [];
      this.apiCall(this.newSearch);
    }
    // Keep track of the global book array size and only make API calls when the search index exceeds the size of the global array
    if (this.state.next && this.state.startIndex > this.maxStartIndexOfDisplayedResults) {
      if (this.state.startIndex > this.maxStartIndexOfDisplayedResults) {
        this.maxStartIndexOfDisplayedResults = this.state.startIndex;
      }
      this.apiCall(this.newSearch);
      this.setState({
        next: false
      })
    }
  }

  // EVENT HANDLING METHODS --------------------------------------------------------------------------------------------------------------------- //
  /**
   * Make API call and return 12 results based on user's submitted input in the search field
   * @param {string} input The user's submitted search input
   */
  apiCall = (input) => {
    this.noResults = false;
    axios({
      url: 'https://www.googleapis.com/books/v1/volumes',
      method: 'GET',
      responseType: 'json',
      params: {
        q: input,
        maxResults: 12,
        startIndex: this.state.startIndex,
        orderBy: 'relevance'
      }
    }).then((results) => {
      const bookResults = results.data.items;
      if (bookResults) {
        bookResults.forEach((book) => {
          this.books.push(this.createBookObj(book));
        });
      } else {
        this.noResults = true;
      }
      this.setState({
        books: this.books
      });
    }).catch((error) => {
      console.log(error);
    })
  }

  /**
   * Cache the relevant information from the API book object
   * @param {Object} book The book object returned from the API call
   */
  createBookObj = (book) => {
    const bookObj = {};
    bookObj.id = book.id;
    bookObj.title = this.handleMissingInfoError(book.volumeInfo.title, 'Unknown title');
    bookObj.authors = this.handleMissingInfoError(book.volumeInfo.authors, 'Unknown author');
    bookObj.category = this.handleMissingInfoError(book.volumeInfo.categories, 'Unknown genre');
    bookObj.rating = this.handleMissingInfoError(book.volumeInfo.averageRating, 'No rating');
    bookObj.bookImg = this.handleMissingCoverImage(book.volumeInfo); // add stock no image available 
    bookObj.pageCount = this.handleMissingInfoError(book.volumeInfo.pageCount, 'Unknown page count');
    bookObj.publisher = this.handleMissingInfoError(book.volumeInfo.publisher, 'Unknown publisher');
    bookObj.language = this.handleMissingInfoError(book.volumeInfo.language, 'Unknown language');
    bookObj.description = this.handleMissingInfoError(book.volumeInfo.description, 'No description');
    bookObj.publishedDate = this.handleMissingInfoError(book.volumeInfo.publishedDate, 'Unknown published date');
    bookObj.searchInput = this.newSearch;
    return bookObj;
  }

  /**
   * Push book data to Firebase
   * @param {Object} bookObject The created book object for each of the books returned from API call
   * @param {boolean} saved A boolean value to show whether or not a book has been saved to the bookshelf by the user
   */
  handleButtonClick = (bookObject, saved) => {
    const bookAndCompleted = {
      book: bookObject,
      completed: false,
      saved: saved
    }
    this.dbRef.push(bookAndCompleted);
  }

  /**
   * Check if a piece of information is missing then display a customized message for it
   * @param {Object} info An object containing the information returned by API call
   * @param {string} message Customized error message depending on the missing information
   */
  handleMissingInfoError = (info, message) => {
    let checkedInfo;
    if (info) {
      checkedInfo = this.parseBookInfo(info);
    } else {
      checkedInfo = message;
    }
    return checkedInfo;
  }

  /**
   * Separate multiple pieces of information with a coma and add the word 'and' before the last one; Oxford coma convention is observed
   * @param {Object} info An object containing the information to be parsed
   */
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

  /**
   * Check if the image link exists; if not, display the no-cover image
   * @param {Object} info An object containing the information about the cover image of a particular book
   */
  handleMissingCoverImage = (info) => {
    if (info.imageLinks) {
      return info.imageLinks.thumbnail;
    } else {
      return noCover;
    }
  }

  /**
   * Truncate long pieces of information based on specified maximum length; ellipses are placed only after complete words
   * @param {string} info The relevant information to be checked for truncation
   * @param {integer} maxLength The maximum number of characters allowable for a particular piece of information; if the maxLength happens in the middle of a word, the ellipsis will be placed after the next blank space, or not at all if it is the end of the string
   */
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

  /**
   * Move to the next search result page
   */
  handleNextPage = () => {
    let newStartIndex = this.state.startIndex + 12;
    this.setState({
      startIndex: newStartIndex,
      next: true,
      pageNumber: this.state.pageNumber + 1
    })
  }

  /**
   * Move to the previous search result page
   */
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

  // RENDER METHODS ------------------------------------------------------------------------------------------------------------------------------------ //
  /**
   * Render each individual book on the screen
   * @param {Object} book The created book object based on the information returned by API call
   */
  renderInformation = (book) => {
    return (
      <div className="resultBox" key={book.id} style={{"backgroundImage": `url(${book.bookImg})`}}>
        <img src={book.bookImg} alt={`Book cover for ${this.handleLongInfo(book.title, 40)}`} />
        <div className="descriptionContainer">
          <h2 className="title">{this.handleLongInfo(book.title, 50)}</h2>
          <h3>{this.props.language.by} {book.authors}</h3>
          <h3>{this.props.language.genre} {book.category}</h3>
          <h4>{this.props.language.rating} {book.rating}</h4>
        </div>
        <div className="buttonContainer">
          <Link to={`/moredetails/${book.title}`}>
            <button onClick={() => { this.handleButtonClick(book, false) }}><i className='fas fa-info-circle'></i>  {this.props.language.moreDetails}</button>
          </Link>
          <button onClick={() => { this.handleButtonClick(book, true) }}><i className='fas fa-plus'></i>  {this.props.language.add}</button>
        </div>
      </div>
    );
  }

  /**
   * Render no result message if API call returns no results
   */
  renderNoResultMessage = () => {
    return (
      <h2>No Results Found :(</h2>
    )
  }

  /**
   * Render the previous and next page buttons
   */
  renderPaginationButtons = () => {
    return(
      <div className="paginationButtonContainer">
        <button onClick={this.handlePreviousPage}>{this.props.language.previous}</button>
        <button onClick={this.handleNextPage}>{this.props.language.next}</button>
      </div>
    )
  }

  // MAIN RENDER METHOD -------------------------------------------------------------------------------------------------------------------------------- //
  render() {
    const displayedResults = this.state.books.slice(this.state.startIndex, this.state.startIndex + 12);
    return (
      <div>
        <section className="searchResSection">
          {
            !this.noResults
              ? displayedResults.map((book) => this.renderInformation(book))
              : this.renderNoResultMessage()
          }
        </section>
        {
          !this.noResults
            ? this.renderPaginationButtons()
            : null
        }
      </div>
    )
  }
}


export default SearchResults;