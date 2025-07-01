import React from 'react';
import PropTypes from 'prop-types';
import './CharacterClues.css';
import {Clues} from '../../../utils/clues.js'

export default function CharacterClues({characterId, visibleCount})
{
    const clues = Clues[characterId] || [];

    return (
        <div className="clues__container">
            {
                clues.map((clue, index) => 
                (
                    <p key={index} className={`clue ${index < visibleCount ? 'clue_visible' : 'clue_hidden'}`}>
                        {clue}
                    </p>
                ))
            }
        </div>
    );
}

CharacterClues.propTypes = {
    characterId: PropTypes.number.isRequired,
    visibleCount: PropTypes.number.isRequired,
}