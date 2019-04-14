import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = (props) => (
  // eslint-disable-next-line
  <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
    <section className="container">
      <div className="navbar-brand">
        <strong className="navbar-item">{props.title}</strong>
        <span
          className="nav-toggle navbar-burger"
          onClick={() => {
            let toggle = document.querySelector(".nav-toggle");
            let menu = document.querySelector(".navbar-menu");
            toggle.classList.toggle("is-active"); menu.classList.toggle("is-active");
          }}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/about" className="navbar-item">About</Link>
          <Link to="/all-users" className="navbar-item">Users</Link>
          {props.isAuthenticated &&
            <Link to="/status" className="navbar-item">User Status</Link>
          }
          <a href="/swagger" className="navbar-item">Swagger</a>
        </div>
        <div className="navbar-end">
          {!props.isAuthenticated &&
            <div className="navbar-item">
              <Link to="/register" className="button is-primary">Register</Link>
              &nbsp;
              <Link to="/login" className="button is-link">Log In</Link>
            </div>
          }
          {props.isAuthenticated &&
            <Link to="/logout" className="navbar-item">Log Out</Link>
          }
        </div>
      </div>
    </section>
  </nav>
)

export default NavBar;
