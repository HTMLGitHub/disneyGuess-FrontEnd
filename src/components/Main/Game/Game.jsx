import CharacterImage from "../CharacterImage/CharacterImage";
import { baseURL } from "../../../utils/constants.js";
import React, {useState, useEffect, useRef} from 'react';
import {clueIds} from '../../../utils/clues/clues.js';
import Preloader from "../../Preloader/Preloader.jsx";
import './Game.css';

const ids = clueIds; // Use the exported clue IDs from clues.js


export default function Game()
{
    const [availableIds, setAvailableIds] = useState([...ids]);
    const [usedIds, setUsedIds] = useState([]);
    const [character, setCharacter] = useState(null);
    const [guess, setGuess] = useState('');
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [visibleClueCount, setVisibleClueCount] = useState(1);
    const [blurLevel, setBlurLevel] = useState(100);
    const [loading, setLoading] = useState(false);

    const clueTimerRef = useRef(null);
    const timersRef = useRef([]);

    useEffect(() =>
    {
        handleNewGame(); 
        setRevealAnswer(false);       
    },[]);

    const stopALLTimers = () =>
    {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
        console.log("All timers cleared");
    }

    const handleNewGame = () => 
    {
        console.log("New Game Clicked");

        setLoading(true); // start loading

        // Clear all previoius times
        stopALLTimers();

        // Reset character pool if needed
        if(availableIds.length == 0)
        {
            // All characters have been used -- reset
            setAvailableIds([...ids]);
            setUsedIds([]);
            console.log("All characters used - resetting character pool");
            setLoading(false); // end loading if reset
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
            setBlurLevel(80);
            setRevealAnswer(false);

            // Remove from available and add to used
            setAvailableIds(availableIds.filter(id => id !== randomId));
            setUsedIds([...usedIds, randomId]);

            setLoading(false); // done loading

            // Start timer to update clues & blur
            const blurSteps = [55, 35, 15, 0];
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
        .catch((err) => 
        {
            console.error(`Error fetching character: ${err}`)
            setLoading(false); // end loading on error
        });    
        
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
            stopALLTimers(); // stop all timers
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
        console.log("Render Check:",
        { 
            loading, 
            guess, 
            trimmedGuess: guess.trim(),
            notGuessTrim: !guess.trim(), 
            characterLoaded: !!character 
        }),

        <div className="game__container">
            <div className="game__image">
            {
                loading ? 
                (
                    <div className="game__loading-placeholder">
                        <Preloader text="Loading Character..."/>
                    </div> // end of game__loading-placeholder
                ) : 
                (
                    character && 
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
                )
            }
            </div> {/* end of game__image*/}
            <div className="game__controls">
                <input 
                    type="text"
                    placeholder="Enter your guess..."
                    value={guess}
                    onChange={(e)=> setGuess(e.target.value)}
                    className="game__input"
                    disabled={loading || revealAnswer} // Disable if loading or answer revealed
                    autoFocus={!loading} // Focus input only if not loading
                />                

                <div className="game__buttons">
                    <button 
                        onClick={handleGuessSubmit}
                        className="game__buttons_submit"
                        disabled={loading || !guess.trim() || !character || revealAnswer} // Disable if no guess or loading
                        title=
                        {
                            loading ?
                            "Loading character, please wait..." :
                            !guess.trim() ?
                            "Please enter a guess before submitting." :
                            !character ?
                            "Character not loaded yet. Please wait." :
                            "Submit your guess"
                        }                      
                    >
                        Submit Guess
                    </button>
                    <button 
                        onClick={handleNewGame}
                        className="game__buttons_newGame"
                    >
                        New Game
                    </button>
                </div> {/* end of game__buttons*/}
            </div> {/* end of game__controls*/}
        </div> /*end of game__container*/
    );
}