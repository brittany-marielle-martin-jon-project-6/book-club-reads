import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { english, français } from './languages';

class HeaderNav extends Component {
  constructor() {
    super();
    this.newInput = false;
    this.state = {
      suggestions: [],
      userInput: '',
      language: français
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
  handleLanguage = (language) => {
    this.props.language(language);
    this.setState({
      language: language
    });
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

  handleKeyPress = (e) => {
    console.log(e.keyCode);
  }

  renderNav = () => {
    return (
      <nav>
        <ul className="headerNav">
          <li><Link to="/" className="navLinks">{this.state.language.browse}</Link></li>
          <li><Link to="/mybookself" className="navLinks">{this.state.language.myBookshelf}</Link></li>
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
        <form onSubmit={(e) => this.handleSubmit(e)} onChange={(event) => this.getSuggestion(event)} onKeyPress={(e) => this.handleKeyPress(e)}>
          <label htmlFor="searchBook" className="srOnly">Search </label>
          <input autoComplete="off" type='text' id='searchbook' name='searchbook' className='searchBook' placeholder={this.state.language.placeholder} value={this.state.userInput} onChange={this.updateUserInput}></input>
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
        <div className="languageContainer">
          <button onClick={() => this.handleLanguage(english)}>EN</button>
          <button onClick={() => this.handleLanguage(français)}>FR</button>
        </div>
      </div>
    )
  }
  renderSuggestion = (titleSuggestion, index) => {
    titleSuggestion = this.handleLongInfo(titleSuggestion, 25);

    return (
      <div key={index} className="individualSuggestion" >
        <Link to={`/search/${titleSuggestion}`} onKeyPress={(e) => this.handleSuggestionDropDown(e)}>
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