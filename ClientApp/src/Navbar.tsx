import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { AppContext } from "./App";

const Navbar: React.FC<RouteComponentProps> = (props) => {

    const [ isLoggedIn, toggleLogIn ] = useState<boolean>(false);
    const { user, setUser } = useContext(AppContext);

    useEffect(() => {
        if (user && user.id !== "guest") {
            toggleLogIn(true);
        }
    }, [user]);

    const handleLogOut = () => { 
        // Remove user cache and return to landing
        sessionStorage.removeItem("user");
        setUser(null);
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
                    <li className="nav-item">
                        { 
                            isLoggedIn 
                                ? <p className="nav-link fake-link" onClick={ handleLogOut }>Log Out</p>
                                : <p className="nav-link fake-link" onClick={() => props.history.push("/register")}>Sign Up</p>
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default withRouter(Navbar);