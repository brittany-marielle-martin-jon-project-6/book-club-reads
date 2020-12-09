import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SearchResults from './SearchResults';
import LandingPage from './LandingPage';
import HeaderNav from './HeaderNav';
import Bookshelf from './Bookshelf';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <HeaderNav />
          <Route exact path="/" component={LandingPage} />
          <Route path="/search/:search" component={SearchResults} />
          <Route path="/mybookshelf" component={Bookshelf} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
