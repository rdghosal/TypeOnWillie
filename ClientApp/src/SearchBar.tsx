import React from 'react'
import { Sonnet } from './Sonnet';


type SearchBarProps = {
    sonnetCollection: Array<Sonnet> | null;
    sonnetsDisplayed: Array<Sonnet> | null;
    setSonnetsDisplayed: React.Dispatch<React.SetStateAction<Sonnet[] | null>>;
};


const SearchBar : React.FC<SearchBarProps> = (props) => {

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {

        let input = e.target.value;

        console.log("INPUT=", input)
        if (!input) {
            return props.setSonnetsDisplayed(props.sonnetCollection);
        }

        input = input.charAt(0).toUpperCase() + input.substring(1, input.length).toLowerCase();

        if (input.indexOf(" ") > -1) {
            const title = input.split(" ")[0];
            const numeral = input.split(" ")[1].toUpperCase();

            if (!isNaN(parseInt(numeral))) {
                input = numeral;
            } else {
                input = title + " " + numeral;
            }

            console.log("Found numeral! ", input)
        }

        const sonnetsToDisplay = new Array<Sonnet>();

        for (var sonnet of props.sonnetCollection!) {
            const valCompared = (isNaN(parseInt(input))) ? sonnet.title : sonnet.id.toString();
            if (valCompared.startsWith(input)) {
                console.log("Found sonnet ", sonnet.title);
                sonnetsToDisplay.push(sonnet);
            }
        }

        if (sonnetsToDisplay.length > 0) { 
            return props.setSonnetsDisplayed(sonnetsToDisplay);
        }

        return;

    };

    return (
        <div className="sonnet-menu__searchbar row">
            <label htmlFor="searchBar">Search a sonnet by number or title</label>
            <input type="text" className="form-control" id="searchBar" onChange={(e) => handleChange(e) } />
        </div>
    )
}

export default SearchBar
