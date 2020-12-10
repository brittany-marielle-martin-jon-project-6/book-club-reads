import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SearchResults from './SearchResults';
import LandingPage from './LandingPage';
import HeaderNav from './HeaderNav';
import Bookshelf from './Bookshelf';
import BookDetails from './BookDetails';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <HeaderNav />
          <Route exact path="/project-6" component={LandingPage} />
          <Route exact path="/project-6/search/:search" component={SearchResults}/>
          {/* <Route path="/search/:search/:page" component={SearchResults}/> */}
          <Route exact path="/project-6/mybookshelf" component={Bookshelf} />
          <Route path="/project-6/mybookshelf/:book" component={BookDetails} />
          <Route path="/project-6/moredetails/:book" component={BookDetails}/>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
