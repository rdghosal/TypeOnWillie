import React from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
    return (
        <nav className="nav">
            <div className="nav__logo">Type On, Willie!</div>
            <ul className="nav__nav-links">
                <div className="spacer"></div>
                <li className="nav-links__link">Home</li>
                <li className="nav-links__link">Sonnet Menu</li>
            </ul>
        </nav>
    );
}

export default Navbar;