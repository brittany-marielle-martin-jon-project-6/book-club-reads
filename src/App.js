import './App.css';
import axios from 'axios';
// import firebase from './firebase.js';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SearchResults from './SearchResults';
import LandingPage from './LandingPage';
import HeaderNav from './HeaderNav';
import Bookshelf from './Bookshelf';

class App extends Component {
  constructor() {
    super();
    this.newInput = false;
    this.state = {
      suggestions: [],
      userInput: ''
    }
  }

  apiCall = (input) => {
    axios({
      url: 'https://www.googleapis.com/books/v1/volumes',
      method: 'GET',
      responseType: 'json',
      params: {
        q: input,
        maxResults: 5
      }
    }).then((results) => {
      const bookResults = results.data.items;
      this.setState({
        suggestions: bookResults
      });
    }).catch((error) => error);
  }

  componentDidMount() {
    this.apiCall('1');
  }

  // When the component updates with a newInput from the user, make a new API call then set this.newInput to 'false' to stop the infinite componentDidUpdate-setState loop;
  componentDidUpdate() {
    if (this.newInput) {
      this.apiCall(this.state.userInput);
      this.newInput = false;
    }
  }

  // Update user's input; when the user types a new character, set this.newInput to 'true'
  updateUserInput = (e) => {
    const userSearch = e.target.value;
    if (userSearch) { this.newInput = true; }
    this.setState({
      userInput: userSearch
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <HeaderNav 
          submit={((e)=> {
            this.handleSubmit(e);
          })}
          inputChange={this.updateUserInput}
          userSearch={this.state.userInput}/>
          <Route exact path="/" component={LandingPage}/>
          <Route path="/:search" component={SearchResults}/>
          <Route path="/mybookshelf" component={Bookshelf} />
        </div>
      </Router>
    );
  }
}

export default App;
