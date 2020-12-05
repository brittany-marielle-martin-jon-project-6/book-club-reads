import './App.css';
import { Component } from 'react';
import axios from 'axios';
// import firebase from 'firebase';

// import xml2js from 'xml2js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      books: [],
      userInput: 'harry',
      newInput: false
    }
  }

  APICall = () => {
    axios({
      url: 'https://www.googleapis.com/books/v1/volumes',
      method: 'GET',
      responseType: 'jsonp',
      params: {
        q: this.state.userInput,
        // key: 'AIzaSyCl7_ThiCPhoMTkiOf6PNAzfAK-b-pAlXA',
      }
    }).then ((results) => {
      const bookResults = results.data.items;
      this.setState({
        books: bookResults
      })
      
    }).catch ((error) => {
      console.log(error);
    })
  }

  componentDidMount() {
    this.APICall()
  }

  componentDidUpdate() {
    if (this.state.newInput) {
      this.APICall()
      this.setState({
        newInput: false
      })
    } 

  }

  handleAutocomplete = (e) => {
    const userSearch = e.target.value
    console.log(userSearch)
    this.setState({
      userInput: userSearch,
      newInput: true
    })
  }

  handleSubmit =(e) => {
    e.preventDefault()
  }

  // may have to check if checkedInfo is an array later on

  handleMissingInfoError = (info, message) => {
    let checkedInfo;
    if (info) {
      checkedInfo = info; // could have multiple categories & error handling if no categories
        } else {
          checkedInfo = message
        }
      return checkedInfo
  }


  render() { 
      console.log(this.state.books);
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="searchBook">Search: </label>
            <input type='text' id='searchbook' name='searchbook' onChange={this.handleAutocomplete}></input>
            <button>submit</button>
          </form>
          {
            this.state.books.map((book) => {
              // console.log(book);
              const title = this.handleMissingInfoError(book.volumeInfo.title, 'Unknown title')

              const authors = this.handleMissingInfoError(book.volumeInfo.authors, 'Anonymous author')

              const category = this.handleMissingInfoError(book.volumeInfo.categories, 'Unknown genre')

              const rating = this.handleMissingInfoError(book.volumeInfo.averageRating, 'No rating')
            
              // const bookImg = this.handleMissingInfoError(book.volumeInfo.imageLinks.thumbnail) // add stock no image available 

              const description = this.handleMissingInfoError(book.volumeInfo.description, 'No description')

               const publishedDate = this.handleMissingInfoError(book.volumeInfo.publishedDate, 'Unknown published date')

              const pageCount = this.handleMissingInfoError(book.volumeInfo.pageCount, 'Unknown page count')

              const buyBook = this.handleMissingInfoError(book.saleInfo.buyLink, 'Not available for purchase on Google Play')

              const publisher = this.handleMissingInfoError(book.volumeInfo.publisher, 'Unknown publisher')

              const language = this.handleMissingInfoError(book.volumeInfo.language, 'Unknown language')
              
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
                  <a href={buyBook}>Buy book</a> 
                  <h4>{description}</h4>
                  {/* <img src={bookImg} alt={`Book cover for ${title}`}/> */}
                </div>
          
              )
            })
          }
          


        

        </div>
      )
  }
}

export default App;
