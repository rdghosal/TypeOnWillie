import React, { useContext } from "react";
import Sonnet from "./Sonnet";
import { RouteComponentProps, withRouter } from "react-router";
import { MainContext } from "./Main";
// import TypeSession from "./TypeSession";

interface Props extends RouteComponentProps {
    sonnet: Sonnet
}

const SonnetCard: React.FC<Props> = ({ history, sonnet }): JSX.Element => {

    const { setSonnet } = useContext(MainContext);

    const initSession= () : void => {
        setSonnet(sonnet);
        history.push(`/app?sonnet=${sonnet.id}`)
    }

    return (
        <div className="sonnet-card" onClick={ initSession }>
            <div className="sonnet-card__title">
                { sonnet.title }
            </div>
            <div className="sonnet-card__line">
                { sonnet.lines[0] + "..."}
            </div>
        </div>
    );
}

export default withRouter(SonnetCard);