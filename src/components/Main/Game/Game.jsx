import CharacterImage from "../CharacterImage/CharacterImage";
import { baseURL } from "../../../utils/constants.js";
import React, {useState, useEffect, useRef} from 'react';
import {Clues} from '../../../utils/clues/clues.js';
import Preloader from "../../Preloader/Preloader.jsx";
import './Game.css';

const ids = Object.keys(Clues).map(Number);


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
    const [score, setScore] = useState(0);

    const timersRef = useRef([]);

    useEffect(() =>
    {
        handleNewGame(); 
        setRevealAnswer(false);   
        // eslint-disable-next-line react-hooks/exhaustive-deps    
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

            const apiCharacter = data.data;
            const clueData = Clues[apiCharacter._id] || {};

            const mergedCharacter =
            {
                ...apiCharacter, 
                aliases: clueData.aliases || [],
                strictAliases: clueData.strictAliases || [],
                clues: clueData.clues || [],
            };

            setCharacter(mergedCharacter);
            setGuess("");
            setVisibleClueCount(1);
            setBlurLevel(80);
            setRevealAnswer(false);

            // Remove from available and add to used
            setAvailableIds(availableIds.filter(id => id !== apiCharacter._id));
            setUsedIds([...usedIds, apiCharacter._id]);

            setLoading(false); // done loading

            const clueInterval = 7500; // 7.5 seconds

            // Start timer to update clues & blur
            const blurSteps = [55, 35, 15, 0];
            const totalClues = 4;

            // Schedule each clue reveal (first clue is already shown)
            for (let i = 1; i<totalClues; i++)
            {
                const timer = setTimeout(()=>
                {
                    setVisibleClueCount(i+1);
                    setBlurLevel(blurSteps[i] !== undefined ? blurSteps[i] : 0); 
                }, i * clueInterval);
                timersRef.current.push(timer);
            }

            // Schedule image unblur at last clue time
            const unblurTimer = setTimeout(() => 
            {
                setBlurLevel(0);    
            }, (totalClues - 1) * clueInterval);
            timersRef.current.push(unblurTimer);

            // Schedule final reveal after last clue (7.5 seconds)
            const finalRevealTimer = setTimeout(() => 
            {
                setRevealAnswer(true);  
            }, totalClues * clueInterval);
            timersRef.current.push(finalRevealTimer);
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

        console.log(`Character Object:`, character);

        const normalizedGuess = normalizeName(guess);
        console.log("Normalized Guess:", normalizedGuess);

        const normalizedAnswer = normalizeName(character.name);
        console.log("Normalized Answer:", normalizedAnswer);

        const normalizedGuessWords = normalizedGuess
                                .split(/[ ,]+/)
                                .filter(Boolean);
        console.log("Normalized Guess Words:", normalizedGuessWords);

        const isExactMatch = normalizedGuess === normalizedAnswer;

        console.log("Character aliases (raw):", character.aliases);
        if(character.aliases) 
        {
            console.log("Character aliases (normalized):", character.aliases.map(a => normalizeName(a)));
        }

        const isAliasMatch = character.aliases && character.aliases.some(alias => normalizeName(alias) === normalizedGuess);

        console.log("isAliasMatch result:", isAliasMatch);

        console.log("StrictAliasMatch:", character.strictAliases);
        if(character.strictAliases)
        {
            console.log("Character strict aliases (normalized):", character.strictAliases.map(a => normalizeName(a)));
        }

        const isStrictAliasMatch = character.strictAliases && character.strictAliases.some(requiredNames => 
            {
                const normalizedRequired = requiredNames.map(name => normalizeName(name));
                const allIncluded = normalizedRequired.every(req => normalizedGuessWords.includes(req));

                return allIncluded && normalizedGuessWords.length === normalizedRequired.length;
            }            
        );

        console.log("isStrictAliasMatch:", isStrictAliasMatch);

        let pointsAwarded = 0;

        console.log("Matching Results:",
            {
                isExactMatch,
                isAliasMatch,
                isStrictAliasMatch
            }
        );

        if (isExactMatch || isAliasMatch || isStrictAliasMatch) 
        {
            console.log("Correct");
            stopALLTimers(); // stop all timers
            setRevealAnswer(true);
            setBlurLevel(0); // remove the blur
            setVisibleClueCount(4); // optionally reveal all clues too

            // Calculate points based on clue revealed
            pointsAwarded = 5 - (visibleClueCount - 1); // clue 1 = 5, clue 2 = 4, etc

            if(pointsAwarded < 1) pointsAwarded = 1; // If image is unblurred, award minimum 1 point

            if(revealAnswer) pointsAwarded = 0; // No points if name is revealed

            // Bonus points for trio partion guesses
            if(character.strictAliases && !isStrictAliasMatch)
            {
                const guessCount = normalizedGuessWords.length;

                pointsAwarded += Math.max(0, guessCount - 1);
            }

            // Bonus points for full name entry
            if (isExactMatch)
            {
                pointsAwarded += 2; 
            }
            else if (normalizedGuess.includes(normalizedAnswer.split(" ")[0]))
            {
                pointsAwarded += 1;
            }

            setScore(prev=>prev + pointsAwarded); 
            console.log(`Points awarded: ${pointsAwarded}`);
        }
        else
        {
            console.log("Incorrect Guess")
        }
    };

    function normalizeName(name)
    {
        return name
                .toLowerCase()
                .replace(/[^\w\s]/gi, '') // removes all punctuation
                .replace(/\s+/g, ' ') // replace multiple spaces with single space
                .trim();
    }

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
            <div className="game__score">
                <strong>Score: </strong> {score}
            </div>
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
                    onKeyDown={(e)=>
                        {
                            if(e.key === 'Enter' && !loading && !revealAnswer && guess.trim())
                            {
                                handleGuessSubmit();
                            }
                        }}
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