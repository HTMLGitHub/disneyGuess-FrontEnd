import CharacterImage from "../CharacterImage/CharacterImage";
import { baseURL } from "../../../utils/constants.js";
import React, {useState, useEffect} from 'react';
import './Game.css';

const ids = [1820, 1870, 1944, 1947, 2755, 2891, 2969, 4703, 4704, 5371, 6225];


export default function Game()
{
    const [availableIds, setAvailableIds] = useState([...ids]);
    const [usedIds, setUsedIds] = useState([]);
    const [character, setCharacter] = useState(null);
    const [guess, setGuess] = useState('');

    useEffect(() =>
    {
        handleNewGame();        
    },[]);

    const handleNewGame = () => 
    {
        console.log("New Game Clicked");
        
        if(availableIds.length == 0)
        {
            // All characters have been used -- reset
            setAvailableIds([...ids]);
            setUsedIds([]);
            console.log("All characters used - resetting character pool");
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableIds.length);
        const randomId = availableIds[randomIndex];
        console.log(`Fetching new character from: ${baseURL}/${randomId}`);

        fetch(`${baseURL}/${randomId}`)
        .then((res) => res.json())
        .then((data) =>
        { 
            /*
            Might need this to ensure json data for possible future updates
            const BLOB = new Blob([JSON.stringify(data.data, null, 2)], {type: 'application/json'});
            const link = document.createElement('a');
            link.href=URL.createObjectURL(BLOB);
            link.download= 'characterData.data.json';
            link.click();
            */
            setCharacter(data.data);
            setGuess("");

            // Remove from available and add to used
            const newAvailable = availableIds.filter(id => id !== randomId);
            setAvailableIds(newAvailable);
            setUsedIds([...usedIds, randomId]);
        })
        .catch((err) => console.error(`Error fetching character: ${err}`));    
    };

    const handleGuessSubmit = () =>
    {
        console.log(`User guessed: ${guess}`);
    };

    return (
        <div className="game__container">
            {character && 
                (
                    <CharacterImage imageUrl={character.imageUrl} name={character.name}/>
                )
            }
            <div className="game__clues">
                <p>Clue 1: He wears red shorts.</p>
                <p>Clue 2: He has a pet dog.</p>
                <p>Clue 3: His dog is named Pluto.</p>
                <p>Clue 4: He is one of the most iconic cartoon characters.</p>
            </div>

            <input 
                type="text"
                placeholder="Enter your guess..."
                value={guess}
                onChange={(e)=> setGuess(e.target.value)}
                className="game__input"
            />

            <div className="game__buttons">
                <button 
                    onClick={handleGuessSubmit}
                    className="game__buttons_submit"
                >
                    Submit Guess
                </button>
                <button 
                    onClick={handleNewGame}
                    className="game__buttons_newGame"
                >
                    New Game
                </button>
            </div>
        </div>
    );
}