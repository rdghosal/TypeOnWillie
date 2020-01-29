import React from "react";

const Home: React.FC = () => {
    return (
        <div className="main--home">
            <div>This is home</div>
            <button onClick={() => window.location.href = "/app"}>Go to app!</button>
        </div>
    );
}

export default Home;