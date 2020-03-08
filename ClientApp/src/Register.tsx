import React, { FormEvent, useContext, Fragment } from 'react'
import { RouteComponentProps } from 'react-router';
import { AppContext } from './App';
import Navbar from './Navbar';

const Register = (props : RouteComponentProps) => {

    const { setUser } = useContext(AppContext);

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isValid = false;

        const form = document.getElementById("register") as HTMLFormElement;
        const formData = new FormData(form);

        // Non-nullable entries
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const confirmation = formData.get("confirmation") as string;

        // Nullable entries
        const age = formData.get("age") as string;
        const highestEducation = formData.get("highestEducation") as string;
        const nationality = formData.get("nationality") as string;
        
        [ username, password, confirmation ].forEach(item => {
            if (!item) {
                alert("Must fill in username, password, confirmation");
                return isValid;
            }
        });

        // Verify data
        if (!verifyPassword(password)) {
            alert("Password must contain 8-12 characters, including one of each of the following:\n\
            lowercase letter, uppercase letter, a number, and special character");
        } else if (password !== confirmation) {
            alert("Password and Confirmation fields do not match!");
        } else if (!verifyUsername(username)) {
            alert("Username must start with letter and contain zero spaces.");
        } else if (age && isNaN(parseInt(age))) {
            alert("Age must be a number!");
        } else {
            // Send to registration endpt
            fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).then(response => {
                if (!response.ok) {
                    alert("Check registration form and try again.");
                    return isValid;
                } else {
                    // Cache new user data
                    const user = response.json();
                    sessionStorage.setItem("user", JSON.stringify(user));
                    setUser(user);
                    isValid = true;
                }
            }).catch(err => {
                alert("A network connection error occurred.\nPlease try again.");
            });
        }

        return isValid;
    }

    return (
        <Fragment>
            <Navbar />
            <div className="login container">
                <h2 className="form__title">Registration</h2>
                <form onSubmit={ handleSubmit } id="register">
                    <h3 className="form__subtitle">Required</h3>
                    <div className="form-group">
                        <label htmlFor="username">Your username</label>
                        <input type="text" className="form-control" placeholder="Username" name="username" id="username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password of 8-12 characters with one of each:<br/>
                                                Lowercase letter, uppercase letter, number, special character</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="Password"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmation">Your password once more</label>
                        <input type="password" className="form-control" name="confirmation" id="confirmation" placeholder="Password (again)"/>
                    </div>
                    <hr/>
                    <h3 className="form__subtitle">Optional</h3>
                    <div className="form-group">
                        <label htmlFor="confirmation">Your age</label>
                        <input type="text" className="form-control" name="age" id="age" placeholder="Age"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nationality">Your nationality</label>
                        <input type="text" className="form-control" name="nationality" id="nationality" placeholder="Nationality"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="highestEducation">Your highest education</label>
                        <select name="highestEducation" className="form-control" id="highestEducation">
                            <option value="highSchool">High school</option>
                            <option value="college">College / university</option>
                            <option value="graduateSchool">Graduate school (Masters/PhD)</option>
                        </select>
                    </div>
                    <button  className="btn btn-primary" type="submit">Register</button>
                    <button className="btn btn-secondary" type="button"
                        onClick={() => props.history.push("/login") }>Back to Log In</button>
                </form>
            </div>
        </Fragment>
    )
}

function verifyPassword(password: string) : boolean {
    return true;
}

function verifyUsername(username: string) : boolean {
    return true;
}


export default Register;
