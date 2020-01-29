import React from "react";
import "./Landing.css";

const Landing: React.FC = () => {
    return (
        <div className="landing__container">
            <p className="landing__brand">Type On Willie!</p>
            <img className="landing__img" src="../public/shakespeare.jpg" alt="image of Shakespeare" />
            <p className="landing__desc">An app to help you type better and faster!</p>
            <button className="btn btn-primary"onClick={() => window.location.href = "/app"}>Onwards!</button>
        </div>
    );
}

export default Landing;