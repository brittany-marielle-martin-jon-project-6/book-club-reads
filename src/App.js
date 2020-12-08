import './App.css';
// import axios from 'axios';
// import firebase from './firebase.js';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
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
            submit={((e) => {
              this.handleSubmit(e);
            })}
            inputChange={this.updateUserInput}
            userSearch={this.state.userInput} />
          <Route exact path="/" component={LandingPage} />
          <Route path="/search/:search" component={SearchResults} />
          <Route path="/mybookshelf" component={Bookshelf} />
        </div>
      </Router>
    );
  }
}

export default App;
