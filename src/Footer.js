import { Component } from 'react';

class Footer extends Component {
    render() {
        return(
            <footer>
                <p className="container"><a href="www.junocollege.com">{this.props.language.juno} &copy;2020</a></p>
            </footer>
        )
    }
}

export default Footer;