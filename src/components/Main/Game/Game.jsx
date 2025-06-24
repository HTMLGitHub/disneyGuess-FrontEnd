import CharacterImage from "../CharacterImage/CharacterImage";
import { baseURL } from "../../../utils/constants.js";
import React, {useState, useEffect, useRef} from 'react';
import './Game.css';

const ids = [1820, 1870, 1944, 1947, 2755, 2891, 2969, 4703, 4704, 5371, 6225];


export default function Game()
{
    const [availableIds, setAvailableIds] = useState([...ids]);
    const [usedIds, setUsedIds] = useState([]);
    const [character, setCharacter] = useState(null);
    const [guess, setGuess] = useState('');
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [visibleClueCount, setVisibleClueCount] = useState(1);
    const [blurLevel, setBlurLevel] = useState(100);

    const clueTimerRef = useRef(null);
    const timersRef = useRef([]);

    useEffect(() =>
    {
        handleNewGame(); 
        setRevealAnswer(false);       
    },[]);

    const handleNewGame = () => 
    {
        console.log("New Game Clicked");

        // Clear all previoius times
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];

        // Reset character pool if needed
        if(availableIds.length == 0)
        {
            // All characters have been used -- reset
            setAvailableIds([...ids]);
            setUsedIds([]);
            console.log("All characters used - resetting character pool");
            return;
        }

        // Pick random character
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
            setVisibleClueCount(1);
            setBlurLevel(100);
            setRevealAnswer(false);

            // Remove from available and add to used
            setAvailableIds(availableIds.filter(id => id !== randomId));
            setUsedIds([...usedIds, randomId]);

            // Start timer to update clues & blur
            const blurSteps = [75, 50, 25, 0];
            const delay = 4000;

            const revealStep = (step) =>
            {
                if(step < blurSteps.length) 
                {
                    const timer = setTimeout(() => 
                    {
                        setVisibleClueCount(step + 2); // Clue 1 was shown initially
                        setBlurLevel(blurSteps[step]);

                        // Auto reveal at the final step
                        if (blurSteps[step] == 0)
                        {
                            setRevealAnswer(true);
                            return;
                        }

                        revealStep(step + 1); // Call the next step
                    }, delay);

                    timersRef.current.push(timer);
                }
            };

            revealStep(0); // start the sequence
        })
        .catch((err) => console.error(`Error fetching character: ${err}`));    
    };

    const handleGuessSubmit = () =>
    {
        console.log(`User guessed: ${guess}`);
        if(!character) return;

        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedAnswer = character.name.trim().toLowerCase();

        if(normalizedGuess === normalizedAnswer) 
        {
            console.log("Correct");
            clearTimeout(clueTimerRef.current);
            setRevealAnswer(true);
            setBlurLevel(0); // remove the blur
            setVisibleClueCount(4); // optionally reveal all clues too
        }
        else
        {
            console.log("Incorrect Guess")
        }
    };

    return (
        <div className="game__container">
            {character && 
                (
                    <CharacterImage 
                    imageUrl={character.imageUrl} 
                    name={character.name}
                    characterId={character._id}
                    blurLevel={blurLevel}
                    visibleClueCount={visibleClueCount}
                    revealAnswer={revealAnswer}
                    />
                )
            }          

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