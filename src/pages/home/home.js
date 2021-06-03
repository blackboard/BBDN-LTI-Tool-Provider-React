import React from 'react';
import './index.css';
import logo from './logo.svg';
import {Link} from "react-router-dom";

/**
 * Default Home Page //TODO Needs to be replaced
 * @returns {JSX.Element}
 * @constructor
 */
function Home() {
  const title = "LTI Tool"
  return (

    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <p>
        {title}
      </p>

      <Link to="/deepLinkContent">
        <button variant="outlined">
          LTIs
        </button>
      </Link>
    </header>
  )
}

export default Home;