import React from 'react';
import { Line } from 'react-chartjs-2';
import { ScoreData } from './Profile';

type ProgressLineProps = {
    data: ScoreData
};


const ProgressLine : React.FC<ProgressLineProps> = (props) => {
    return (
        <div>
            <Line data={props.data.getChartData()} />
        </div>
    );
}

export default ProgressLine;
