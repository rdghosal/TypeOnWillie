import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="nav">
            <div className="nav__logo">Type On, Willie!</div>
            <ul className="nav__nav-links">
                <div className="spacer"></div>
                <li className="nav-links__link"><Link to="/">Home</Link></li>
                <li className="nav-links__link"><Link to="/app">Sonnet Menu</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;