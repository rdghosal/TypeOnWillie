import React, { useState, useEffect, useContext } from "react";
import Sonnet from "./Sonnet";
import { RouteComponentProps, withRouter } from "react-router";
import { MainContext } from "./Main";
import { User } from "./AuthUtils";


interface ISonnetDetailsProps extends RouteComponentProps {
    sonnet: Sonnet | null;
    user: User;
};

const SonnetDetails: React.FC<ISonnetDetailsProps> = (props) => {

    const [ sonnetHistory, setHistory ] = useState<SonnetHistory | null> (null);
    const { setSonnet } = useContext(MainContext);

    const initSession= () : void => {
        setSonnet(props.sonnet);
        props.history.push(`/app?sonnet=${props.sonnet!.id}`)
    }

    useEffect(() => {
        if (!props.sonnet) {
            return;
        }

        fetch("/api/sonnetmenu/history", {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({
                userId : props.user!.id,
                sonnetId : props.sonnet!.id
            })
        }).then(resp => {
            if (!resp.ok) {
                return window.alert("Failed to fetch sonnet stats!");
            } 
            return resp.json();
        }).then(data => {
            console.log(data);
            return setHistory(data);
        });
    }, [props.sonnet]);
    
    if (!props.sonnet) {
        return <div className="sonnet-details"></div>;
    }

    return (
        <div className="sonnet-details">
            <h2>{ props.sonnet!.title }</h2>
            <button className="sonnet-details__init-button btn btn-primary" onClick={() => initSession()}>
                Start Typing!
            </button>
            
            { props.sonnet!.lines.map((line: string) => line + "\n") }
            {
                sonnetHistory &&
                    <table className="sonnet-details__stats table table-light">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Other Users</th>
                            </tr>
                            <tr>
                                <th>Accuracy</th>
                                <th>Time</th>
                                <th>WPM</th>
                                <th>Accuracy</th>
                                <th>Time</th>
                                <th>WPM</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{sonnetHistory.statistics.user.averageAccuracy}</td>
                                <td>{sonnetHistory.statistics.user.averageTime}</td>
                                <td>{sonnetHistory.statistics.user.averageWpm}</td>
                                <td>{sonnetHistory.statistics.global.averageAccuracy}</td>
                                <td>{sonnetHistory.statistics.global.averageTime}</td>
                                <td>{sonnetHistory.statistics.global.averageWpm}</td>
                            </tr>
                        </tbody>
                    </table> 
            }
        </div>
    );
}

type SonnetHistory = {

    statistics: {
        user: SonnetStatistic,
        global: SonnetStatistic
    },

    misspellings: {
        user: Array<Misspelling>;
        global: Array<Misspelling>;
    }

};

type Misspelling = {
    modelWord: string,
    frequency: number,
    lineNumber: number,
    index: number,
    scope: ScopeType
};

type SonnetStatistic = {
    averageAccuracy: number,
    averageTime: number,
    averageWpm: number,
    scope: ScopeType
};

enum ScopeType {
    GLOBAL,
    USER
}


export default withRouter(SonnetDetails);