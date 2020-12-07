import './App.css';
import axios from 'axios';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SearchResults from './SearchResults';
import LandingPage from './LandingPage';

class App extends Component {
  constructor() {
    super();
    this.newInput = false;
    this.state = {
      suggestions: [],
      userInput: ''
    }
  }

  APICall = (input) => {
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
      console.log(bookResults);
      this.setState({
        suggestions: bookResults
      });
    }).catch((error) => error);
  }

  componentDidMount() {
    this.APICall('1');
  }

  // When the component updates with a newInput from the user, make a new API call then set this.newInput to 'false' to stop the infinite componentDidUpdate-setState loop;
  componentDidUpdate() {
    if (this.newInput) {
      this.APICall(this.state.userInput);
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
          <header>
            <h1>Doki Doki Literature Club</h1>
          </header>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="searchBook">Search: </label>
            <input type='text' id='searchbook' name='searchbook' onChange={this.updateUserInput}></input>
            <Link to={`/${this.state.userInput}`}>
              <button>submit</button>
            </Link>
          </form>
          <Route exact path="/" component={LandingPage}/>
          <Route path="/:search" component={SearchResults}/>
        </div>
      </Router>
    );
  }
}

export default App;
