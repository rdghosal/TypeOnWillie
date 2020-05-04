import React, { useEffect, useState, useContext } from 'react';
import ProgressLine from './ProgressLine';
import SkillsGraph from './SkillsGraph';
import Navbar from './Navbar';
import { AppContext } from './App';
import { User } from "./AuthUtils"
import { LoadingMessage } from './LoadingMessage';

const Profile : React.FC = () => {

    const { user, accessToken, setUser } = useContext(AppContext);
    const [ data, setData ] = useState<Array<Object>>([]);
    useEffect(() => {
        // fetch data
    }, []);

    if (!user) {
        return (
            <>
            <Navbar />
            <LoadingMessage insertText={"profile"} />
            </>
        );
    }
    return (
            <>
                <Navbar />
                <div className="container-fluid profile__container"> 
                    <div className="col-8 profile__greeting">Welcome back, {user.username}</div>
                    <div className="col-8 profile__global-stats"></div>
                    <div className="profile__user-stats container-fluid">
                        <ProgressLine />
                        <SkillsGraph />
                    </div>
                </div>
            </>
    );
}

export default Profile;
