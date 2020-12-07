import { Component } from 'react';
import { Link } from 'react-router-dom';

    class HeaderNav extends Component {
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
                    <form onSubmit={this.props.submit}>
                        <label htmlFor="searchBook">Search: </label>
                        <input type='text' id='searchbook' name='searchbook' onChange={this.props.inputChange}></input>
                        <Link to={`/${this.props.userSearch}`}>
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