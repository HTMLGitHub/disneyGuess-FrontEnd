import React from 'react';
import PropTypes from 'prop-types';
import CharacterClues from '../CharacterClues/CharacterClues';
import './CharacterImage.css';

export default function CharacterImage({
    imageUrl, 
    name, 
    characterId, 
    blurLevel, 
    visibleClueCount,
    revealAnswer
}){
    return (
        <div className="character__image__container">
            <img
                src={imageUrl}
                alt={`Image of ${name}`}
                className="character__image"
                style={{filter: `blur(${blurLevel}px)`}}
            />

            <div className='character__image__name'>
                {revealAnswer ? name : '\u00A0'}
            </div>
                
            <CharacterClues characterId={4703 /*Mickey Mouse Default*/} visibleCount={visibleClueCount}/>
            
        </div>
    );
}

CharacterImage.propTypes=
{
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    characterId: PropTypes.number.isRequired,
    blurLevel: PropTypes.number.isRequired,
    visibleClueCount:PropTypes.number.isRequired,
    revealAnswer:PropTypes.bool.isRequired,
};