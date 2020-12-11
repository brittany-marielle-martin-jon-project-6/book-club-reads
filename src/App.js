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
    });
  }
  render() {
    return (
      <Router>
        <div className="App">
          <HeaderNav language={(language) => this.getLanguage(language)}/>
          <Route exact path="/:language" component={LandingPage} />
          <Route exact path="/search/:search/:language" component={SearchResults}/>
          <Route exact path="/mybookshelf/:language" component={Bookshelf} />
          <Route path="/mybookshelf/:book/:language" component={BookDetails} />
          <Route path="/moredetails/:book/:language" component={BookDetails}/>
          <Footer language={this.state.language}/>
        </div>
      </Router>
    );
  }
}

export default App;
