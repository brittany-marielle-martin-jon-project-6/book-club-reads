import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

    class HeaderNav extends Component {
    render() { 
        return (
                <header>
                    <h1>Doki Doki Literature Club</h1>
                    <form onSubmit={this.props.submit}>
                        <label htmlFor="searchBook">Search: </label>
                        <input type='text' id='searchbook' name='searchbook' onChange={this.props.inputChange}></input>
                        <Link to={`/${this.props.userSearch}`}>
                        <button>submit</button>
                        </Link>
                    </form>
                </header>
        )
    }
    }

export default HeaderNav;