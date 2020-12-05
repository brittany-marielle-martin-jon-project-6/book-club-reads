import './App.css';
import { Component } from 'react';
import axios from 'axios';
// import firebase from 'firebase';

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
      console.log(results);
    })
  }

  render() { 
      return (
          <h1>Hi</h1>
      )
  }
}

export default App;
