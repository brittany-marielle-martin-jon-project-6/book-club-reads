import './App.css';
import { Component } from 'react';
import axios from 'axios';
// import firebase from 'firebase';

// import xml2js from 'xml2js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      books: []
    }
  }

  componentDidMount() {
    axios({
      url: 'https://www.googleapis.com/books/v1/volumes',
      method: 'GET',
      responseType: 'jsonp',
      params: {
        q: 'harrypotter',
        key: 'AIzaSyCl7_ThiCPhoMTkiOf6PNAzfAK-b-pAlXA',
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
          {
            this.state.books.map((book) => {
              console.log(book);
              const title = this.handleMissingInfoError(book.volumeInfo.title, 'Unknown title')

              const authors = this.handleMissingInfoError(book.volumeInfo.authors, 'Anonymous author')

              const category = this.handleMissingInfoError(book.volumeInfo.categories, 'Unknown genre')
               
               
              const rating = this.handleMissingInfoError(book.volumeInfo.averageRating, 'No rating')
               
              const bookImg = this.handleMissingInfoError(book.volumeInfo.imageLinks.thumbnail) // add stock no image available 
               
              return (
                <div key={book.id}>
                  <h2>{title}</h2>
                  <h3>{authors}</h3>
                  <h3>{category}</h3>
                  <h3>{rating}</h3>
                  <img src={bookImg} alt={`Book cover for ${title}`}/>
                </div>
          
              )
            })
          }
          


        

        </div>
      )
  }
}

export default App;
