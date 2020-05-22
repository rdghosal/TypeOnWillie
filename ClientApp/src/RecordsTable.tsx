import React from 'react'
import { RecordCollection } from './Profile';


type RecordsTableProps  = {
    data: RecordCollection
};

const RecordsTable : React.FC<RecordsTableProps> = (props) => {
    return (
        <div>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th>Best Accuracy</th>
                        <th>Worst Accuracy</th>
                        <th>Best WPM</th>
                        <th>Worst WPM</th>
                        <th>Best Time</th>
                        <th>Worst Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.data.bestAccuracy} (Sonnet {props.data.bestAccuracySonnet})</td>
                        <td>{props.data.worstAccuracy} (Sonnet {props.data.worstAccuracySonnet})</td>
                        <td>{props.data.bestWpm} (Sonnet {props.data.bestWpmSonnet})</td>
                        <td>{props.data.worstWpm} (Sonnet {props.data.worstWpmSonnet})</td>
                        <td>{props.data.bestTime} (Sonnet {props.data.bestTimeSonnet})</td>
                        <td>{props.data.worstTime} (Sonnet {props.data.worstTimeSonnet})</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default RecordsTable
