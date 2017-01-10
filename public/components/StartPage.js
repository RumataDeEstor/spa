import React from 'react'
import { render } from 'react-dom'
import { Link, IndexLink } from 'react-router'

const StartPage = ({ children }) => (
  <div>
    <div className = "topmenu">
      <div className = "logo">
        <Link to="/"><img src = "/logo/Logo.png"/></Link>
        Goalpi
      </div> 
      <ul className = "links">
        <li><IndexLink to="/signup" activeClassName="active">Signup</IndexLink></li>
        <li><IndexLink to="/login" activeClassName="active">Login</IndexLink></li>
      </ul>
    </div>
    {children}
  </div>
)

// StartPage.propTypes = {
//   *chilren*
// }

export default StartPage
