import { Component, Fragment } from 'react';
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
        <ul className="headerNav">
          <li><Link to="/" className="navLinks">Browse</Link></li>
          <li><Link to="/connect" className="navLinks">Connect</Link></li>
          <li><Link to="/mybookshelf" className="navLinks">My Bookshelf</Link></li>
        </ul>
      </nav>
    )
  }
  renderForm = () => {
    return(
      <Fragment>
        <Link to="/" className="logo"><h1><i className="fas fa-book-open"></i>Book Club Reads<i className="fas fa-book-open"></i></h1></Link>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="searchBook">Search </label>
          <input type='text' id='searchbook' name='searchbook' className='searchBook' placeholder='title, author, genre' onChange={this.updateUserInput}></input>
          <Link to={`/search/${this.state.userInput}`}>
            <button className='searchButton'><i className="fas fa-search"></i></button>
          </Link>
        </form>
      </Fragment>
    )
  }
  render() {
    return (
      <header>
        <div className="flexContainer container">
          {
            this.renderForm()
          }
          {
            this.renderNav()
          }
        </div>
      </header>
    )
  }
}

export default HeaderNav;