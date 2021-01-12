import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { english, français } from './languages';

class HeaderNav extends Component {
  // LIFE CYCLE METHOD ------------------------------------------------------------------------------------------------------------------------- //
  constructor() {
    super();
    this.newInput = false;
    this.state = {
      suggestions: [],
      userInput: '',
      language: english
    }
  }

  /**
   * Set class component state userInput to empty when the component first mounted
   */
  componentDidMount() {
    this.setState({
        userInput: ''
      })
  }
  
  /**
   * Make new API call if there is a new input from the user for autosuggestions
   */
  componentDidUpdate() {
    if (this.newInput) {
      this.apiCall(this.state.userInput);
      this.newInput = false;
    }
  }

  // EVENT HANDLING METHODS -------------------------------------------------------------------------------------------------------------------- //
  /**
   * Make API calls and return 5 suggestions depending on user's input in the search field
   * @param {string} input The user's input in the the search field
   */
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

  /**
   * Check for user's new character input for autosuggestion
   * @param {Event} event The event from onChange event listener
   */
  updateUserInput = (event) => {
    const userSearch = event.target.value;
    if (userSearch) {
      this.newInput = true;
    }
    this.setState({
      userInput: userSearch
    })
  }

  /**
   * Prevent the form submission event from refreshing the page
   * @param {Event} event The form submission event
   */
  handleSubmit = (event) => {
    event.preventDefault();
  }

  /**
   * Remove user's input from state when form submits
   */ 
  handleOnClickSubmit = () => {
    this.setState({
      userInput: ''
    })
  }

  /**
   * Remove user's input from state when a dropdown suggestion is selected
   */
  handleSuggestionDropDown = () => {
    this.setState({
      userInput: ''
    })
  }

  /**
   * Get the suggestions from API call depending on the user's newest input
   * @param {Event} event The event from the onChange event listener
   */
  getSuggestion = (event) => {
    const suggestion = event.target.value;
    this.setState({
      userInput: suggestion
    })
  }

  /**
   * Truncate long pieces of information based on specified maximum length; ellipses are placed only after complete words
   * @param {string} info The relevant information to be checked for truncation
   * @param {integer} maxLength The maximum number of characters allowable for a particular piece of information; if the maxLength happens in the middle of a word, the ellipsis will be placed after the next blank space, or not at all if it is the end of the string
   */
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

  // RENDER METHODS ------------------------------------------------------------------------------------------------------------------------------ //
  /**
   * Render the navigation options and attach corresponding links to them
   */
  renderNav = () => {
    return (
      <nav>
        <ul className="headerNav">
          <li><Link to="/" className="navLinks">{this.state.language.browse}</Link></li>
          <li><Link to="/mybookshelf" className="navLinks">{this.state.language.myBookshelf}</Link></li>
        </ul>
      </nav>
    )
  }

  /**
   * Render the title and the search field
   */
  renderForm = () => {
    return (
      <div className="titleFormContainer">
        <Link to="/" className="logo">
          <h1><i className="fas fa-book-open bookIcon"></i><span className="capitalB">B</span>ook Club Reads</h1>
        </Link>
        <form onSubmit={(e) => this.handleSubmit(e)} onChange={(event) => this.getSuggestion(event)}>
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
      </div>
    )
  }

  /**
   * Render the dropdown autosuggestion field with the information gathered from API call
   * @param {string} titleSuggestion The title of the suggested book from API call
   * @param {integer} index The indexed position of the suggestion in the class component state; used to set the React 'key' property for the component
   */
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

  // LANGUAGE MODULE ------------------------------------------------------------------------------------------------------------------------------ //
  /**
   * Toggle the language on display
   * @param {Object} language The language object imported from language.js component
   */
  toggleLanguage = (language) => {
    this.props.language(language)
    this.setState({
      language: language
    });
  }

  /**
   * Render the language selection buttons and attach corresponding event handlers
   */
  renderLanguageButtons = () => {
    return (
      <div className="languageContainer">
        <button aria-label="choose english language" onClick={() => this.toggleLanguage(english)}>EN</button>

        <button aria-label="choisir la langue française" onClick={() => this.toggleLanguage(français)}>FR</button>
      </div>
    )
  }

  // MAIN RENDER METHOD ---------------------------------------------------------------------------------------------------------------------------- //
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
          {
            this.renderLanguageButtons()
          }
        </div>
      </header>
    )
  }
}

export default HeaderNav;