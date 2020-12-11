import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SearchResults from './SearchResults';
import LandingPage from './LandingPage';
import HeaderNav from './HeaderNav';
import Bookshelf from './Bookshelf';
import BookDetails from './BookDetails';
import Footer from './Footer';
import { english } from './languages';

class App extends Component {
  constructor() {
    super();
    this.state = {
      language: english
    }
  }

  getLanguage = (language) => {
    this.setState({
      language: language
    })
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <HeaderNav language={(language) => this.getLanguage(language)}/>
          <Route exact path="/" render={() => {
            return(
              <LandingPage language={this.state.language}/>
            )
          }}/>
          <Route path="/search/:search" render={(props) => {
            return(
              <SearchResults {...props} language={this.state.language}/>
            )
          }}/>
          <Route exact path="/mybookshelf" render={() => {
            return(
              <Bookshelf language={this.state.language} />
            )
          }}/>
          <Route path="/mybookshelf/:book" render={(props) => {
            return(
              <BookDetails {...props} language={this.state.language}/>
            )
          }} />
          <Route path="/moredetails/:book" render={(props) => {
            return(
              <BookDetails {...props} language={this.state.language} />
            )
          }}/>
          <Footer language={this.state.language}/>
        </div>
      </Router>
    );
  }
}

export default App;
