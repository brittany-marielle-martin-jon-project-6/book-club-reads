import { Component } from 'react';

class LandingPage extends Component {
  render() {
    return (
      <div className="landingPage">
        <h2 className="wrapperContainer">{this.props.language.tagline}</h2>
        <div className="iconContainer">
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
          <a href="#"><i className="fab fa-facebook-square"></i></a>
        </div>
      </div>
    )
  }
}

export default LandingPage;