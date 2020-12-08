import { Component } from 'react';
import { Link } from 'react-router-dom';

class HeaderNav extends Component {
  constructor() {
    super();
    this.newInput = false;
    this.state = {
      suggestions: [],
      userInput: ''
    }
  }

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


  renderNav = () => {
    return (
      <nav>
        <ul>
          <li><Link to="/mybookshelf">My Bookshelf</Link></li>
          <li><Link to="/">Browse</Link></li>
          <li><Link to="/connect">Connect</Link></li>
        </ul>
      </nav>
    )
  }
  render() {
    return (

      <header>
        <Link to="/"><h1><i className="fas fa-book-open"></i>Doki Doki Literature Club<i className="fas fa-book-open"></i></h1></Link>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="searchBook">Search: </label>
          <input type='text' id='searchbook' name='searchbook' onChange={this.updateUserInput}></input>
          <Link to={`/search/${this.state.userInput}`}>
            <button>submit</button>
          </Link>
        </form>
        {
          this.renderNav()
        }
      </header>
    )
  }
}

export default HeaderNav;