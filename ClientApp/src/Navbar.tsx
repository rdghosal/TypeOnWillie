import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { AppContext } from "./App";
import { TokenHandler, User, AuthErrorTypes } from "./AuthUtils";

interface INavbarProps extends RouteComponentProps {
    isLogInPage?: boolean;
};

const Navbar: React.FC<INavbarProps> = (props) => {

    const { user, accessToken, setUser, setToken } = useContext(AppContext);
    const [ isLoggedIn, toggleLogIn ] = useState<boolean>(false);

    useEffect(() => {
        if (accessToken) {
            toggleLogIn(true);
        }
    }, [accessToken]);

    const handleLogOut = async () => {
        // Send refreshToken and accessToken to back-end for blacklisting
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (!TokenHandler.isExpired(accessToken)) { // Blacklist accessToken too if valid
            headers.append("Authorization", `Bearer ${accessToken}`);
        }

        const response = await fetch("/api/token/logout", {
            headers: headers,
            method: "POST"
        });
        
        // Check for errors
        if (!response.ok) return console.log(response.statusText);

        setUser(null);
        toggleLogIn(false);
        props.history.push("/");
    }

    return (
        <nav className="nav navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand nav__logo" to="/">Type On, Willie!</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarLinks" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
                <div className="collapse navbar-collapse" id="navbarLinks">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="react-link nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="react-link nav-link" to="/app">Sonnet Menu</Link>
                        </li>
                        {isLoggedIn
                            ?
                                <>
                                    <li>
                                        <Link className="react-link nav-link" to="/profile">View Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <p className="nav-link fake-link" onClick={handleLogOut}>Log Out</p>
                                    </li>
                                </>
                                
                            :
                                <li>
                                    <p className="nav-link fake-link" onClick={() => props.history.push("/register")}>Sign Up</p>
                                </li>

                        }
                    </ul>
                </div>
        </nav>
    );
}

export default withRouter(Navbar);