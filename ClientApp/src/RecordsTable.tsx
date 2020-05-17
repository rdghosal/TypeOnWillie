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
                        <th>Favorite Sonnet</th>
                        <th>Best Accuracy</th>
                        <th>Best WPM</th>
                        <th>Best Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.data.favoriteSonnet}</td>
                        <td>{props.data.topAccuracy}</td>
                        <td>{props.data.topWpm}</td>
                        <td>{props.data.topTime}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default RecordsTable
