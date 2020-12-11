import { Component } from 'react';
import { english, français } from './languages';

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