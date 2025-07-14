import React, {useState, useEffect, useRef} from 'react';
import CharacterImage from "../CharacterImage/CharacterImage";
import {Clues} from '../../../utils/clues/clues.js';
import Preloader from "../../Preloader/Preloader.jsx";
import './Game.css';

const ids = Object.keys(Clues).map(Number);

export default function Game({character, error, loading, score, setScore, fetchCharacterById})
{
    const [availableIds, setAvailableIds] = useState([...ids]);
    const [usedIds, setUsedIds] = useState([]);
    const [guess, setGuess] = useState('');
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [visibleClueCount, setVisibleClueCount] = useState(1);
    const [blurLevel, setBlurLevel] = useState(100);
    
    const timersRef = useRef([]);

    useEffect(() => {
        handleNewGame(); 
          
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    },[]);

    const stopALLTimers = () =>
    {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    }

    const handleNewGame = () => 
    {
        stopALLTimers();        // Clear all previoius times
        setRevealAnswer(false); // Make sure not to reveal the answer already

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
    
        fetchCharacterById(randomId)
        .then(() =>
        { 
            setGuess("");
            setVisibleClueCount(1);
            setBlurLevel(75);
            setRevealAnswer(false);

            // Remove from available and add to used
            setAvailableIds(availableIds.filter(id => id !== randomId));
            setUsedIds([...usedIds, randomId]);

            const clueTiming =
            [
                {delay: 6000, clueCount: 2, blurred: 55},
                {delay: 12000, clueCount: 3, blurred: 35},
                {delay: 18000, clueCount: 4, blurred: 15},
                {delay: 24000, clueCount: 4, blurred: 0},
                {delay: 30000, clueCount: 4, blurred: 0, reveal: true},
            ];

            clueTiming.forEach(({delay, clueCount, blurred, reveal}) =>
            {
                const timer = setTimeout(() =>
                {
                    setVisibleClueCount(clueCount);
                    setBlurLevel(blurred);

                    if(reveal) setRevealAnswer(true);
                }, delay);

                timersRef.current.push(timer);
            });
        })
        .catch((err) => 
        {
            console.warn("Local game error (already handled in App:", err);
        });        
    };

    const handleGuessSubmit = () =>
    {
       if(!character) return;

        const normalizedGuess = normalizeName(guess);
        const normalizedAnswer = normalizeName(character.name);
        const normalizedGuessWords = normalizedGuess
                                .split(/[ ,]+/)
                                .filter(Boolean);
        const isExactMatch = normalizedGuess === normalizedAnswer;
        const isAliasMatch = character.aliases && character.aliases.some(alias => normalizeName(alias) === normalizedGuess);
        const isStrictAliasMatch = character.strictAliases && character.strictAliases.some(requiredNames => 
            {
                const normalizedRequired = requiredNames.map(name => normalizeName(name));
                const allIncluded = normalizedRequired.every(req => normalizedGuessWords.includes(req));

                return allIncluded && normalizedGuessWords.length === normalizedRequired.length;
            }            
        );

        if (isExactMatch || isAliasMatch || isStrictAliasMatch) 
        {
            stopALLTimers(); // stop all timers
            setRevealAnswer(true);
            setBlurLevel(0); // remove the blur
            setVisibleClueCount(4); // optionally reveal all clues too

            // Calculate points based on clue revealed
            let pointsAwarded = Math.max(1, 6 - visibleClueCount)// clue 1 = 5, clue 2 = 4, etc

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
        <div className="game__container">
            <div className="game__score">
                <strong>Score: </strong> {score}
            </div>

            {error && (
                <div className='game__error'>
                    ✨ Oops! {error} ✨
                </div>
            )}

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