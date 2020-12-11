import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class HeaderNav extends Component {
  constructor() {
    super();
    this.newInput = false;
    this.state = {
      suggestions: [],
      userInput: ''
    }
  }
  componentDidMount() {
    this.setState({
      userInput: ''
    })
  }
  apiCall = (input) => {
    axios({
      url: 'https://www.googleapis.com/books/v1/volumes',
      method: 'GET',
      responseType: 'json',
      params: {
        q: input,
        maxResults: 5,
        startIndex: 0,
        orderBy: 'relevance'
      }
    }).then((results) => {
      const bookResults = results.data.items;
      const suggestedTitles = bookResults.map((book) => {
        return book.volumeInfo.title;
      })
      this.setState({
        suggestions: suggestedTitles
      });
    }).catch((error) => {
      console.log(error);
    })
  }
  componentDidUpdate() {
    if (this.newInput) {
      this.apiCall(this.state.userInput);
      this.newInput = false;
    }
  }
  updateUserInput = (e) => {
    const userSearch = e.target.value;
    if (userSearch) {
      this.newInput = true;
    }
    this.setState({
      userInput: userSearch
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
  }

  handleOnClickSubmit = () => {
    this.setState({
      userInput: ''
    })
  }

  handleSuggestionDropDown = () => {
    this.setState({
      userInput: ''
    })
  }

  renderNav = () => {
    return (
      <nav>
        <ul className="headerNav">
          <li><Link to="/" className="navLinks">Browse</Link></li>
          <li><Link to="/mybookshelf" className="navLinks">My Bookshelf</Link></li>
        </ul>
      </nav>
    )
  }
  renderForm = () => {
    return (
      <div className="titleFormContainer">
        <Link to="/" className="logo">
          <h1><i className="fas fa-book-open bookIcon"></i><span className="capitalB">B</span>ook Club Reads</h1>
        </Link>
        <form onSubmit={(e) => this.handleSubmit(e)} onChange={(event) => this.getSuggestion(event)}>
          <label htmlFor="searchBook" className="srOnly">Search </label>
          <input autoComplete="off" type='text' id='searchbook' name='searchbook' className='searchBook' placeholder='title, author, genre' value={this.state.userInput} onChange={this.updateUserInput}></input>
          <div className="suggestionContainer">
            {
              this.state.userInput
                ? this.state.suggestions.map((suggestion, index) => {
                  return this.renderSuggestion(suggestion, index);
                })
                : null
            }
          </div>
          <Link to={`/search/${this.state.userInput}`}>
            <button className='searchButton' onClick={() => { this.handleOnClickSubmit() }}><i className="fas fa-search"></i></button>
          </Link>
        </form>
      </div>
    )
  }
  renderSuggestion = (titleSuggestion, index) => {
    titleSuggestion = this.handleLongInfo(titleSuggestion, 25);

    return (
      <div key={index} className="individualSuggestion" >
        <Link className="dropDownLink" to={`/search/${titleSuggestion}`} onKeyPress={(e) => this.handleSuggestionDropDown(e)}>
          <p onClick={(e) => this.handleSuggestionDropDown(e)} >{titleSuggestion}</p>
        </Link>
      </div>
    )
  }
  getSuggestion = (event) => {
    const suggestion = event.target.value;
    this.setState({
      userInput: suggestion
    })
  }
  handleLongInfo = (info, maxLength) => {
    if (info.length > maxLength) {
      if (info.charAt(maxLength - 1) !== ' ') {
        const omittedInfo = info.slice(maxLength, info.length);
        let positionOfNextSpace = omittedInfo.search(' ');
        if (positionOfNextSpace < 0) {
          const numOfCharsToEndOfString = info.length - maxLength;
          if (numOfCharsToEndOfString < 10) {
            positionOfNextSpace = numOfCharsToEndOfString;
          }
        }
        maxLength += positionOfNextSpace;
      }
      info = info.slice(0, maxLength);
      info += ' ...';
    }
    return info;
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