import React from 'react';
import { Radar } from 'react-chartjs-2';
import { SkillsGraphData } from './Profile';

type SkillsGraphProps = {
    data : SkillsGraphData
};

const SkillsGraph : React.FC<SkillsGraphProps> = (props) => {

    return (
        <div>
            <Radar data={props.data}/>
        </div>
    );
}

export default SkillsGraph;
