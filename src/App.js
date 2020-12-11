import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SearchResults from './SearchResults';
import LandingPage from './LandingPage';
import HeaderNav from './headerNav';
import Bookshelf from './Bookshelf';
import BookDetails from './BookDetails';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <HeaderNav />
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/search/:search" component={SearchResults} />
          {/* <Route path="/search/:search/:page" component={SearchResults}/> */}
          <Route exact path="/mybookshelf" component={Bookshelf} />
          <Route path="/mybookshelf/:book" component={BookDetails} />
          <Route path="/moredetails/:book" component={BookDetails} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
