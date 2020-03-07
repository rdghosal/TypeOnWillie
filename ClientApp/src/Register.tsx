import React, { FormEvent, useContext } from 'react'
import { RouteComponentProps } from 'react-router';
import { MainContext } from './Main';

const Register = (props : RouteComponentProps) => {

    const { setUser } = useContext(MainContext);

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
        <div className="login container" id="register">
            <form onSubmit={ handleSubmit }>
                <input type="text" name="username" id="username"/>
                <input type="password" name="password" id="password"/>
                <button type="submit">Register</button>
                <button type="button"
                    onClick={() => props.history.push("/login") }>Log In</button>
            </form>
        </div>
    )
}

function verifyPassword(password: string) : boolean {
    return true;
}

function verifyUsername(username: string) : boolean {
    return true;
}


export default Register;
