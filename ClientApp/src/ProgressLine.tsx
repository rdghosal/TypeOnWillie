import React from 'react';
import { Line } from 'react-chartjs-2';
import { ScorePoint } from './Profile';

type ProgressLineProps = {
    data: Array<ScorePoint>
};


const ProgressLine : React.FC<ProgressLineProps> = (props) => {
    return (
        <div>
            <Line data={props.data} />
        </div>
    );
}

export default ProgressLine;
