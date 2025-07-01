import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CharacterClues from '../CharacterClues/CharacterClues';
import './CharacterImage.css';
import Preloader from "../../Preloader/Preloader.jsx";

export default function CharacterImage({
    imageUrl, 
    name, 
    characterId, 
    blurLevel, 
    visibleClueCount,
    revealAnswer
})
{
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div className='character__image__wrapper'>
            <div className="character__image__container">
                <div className='character__image__box'>
                    
                    {/* Show spinner IF loading or Error*/}
                    {!imageLoaded && !imageError && <Preloader text="Loading character..." />}
                    {imageError && (<Spinner text="Error loading image"/>)}
                    <img
                        src={imageUrl}
                        alt={`Image of ${name}`}
                        className="character__image"
                        style={{filter: `blur(${blurLevel}px)`, display: imageLoaded ? 'block' : 'none'}}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />   
                </div>

                <div className='character__image__name'>
                    {revealAnswer ? name : '\u00A0'}
                </div>
            </div>     

            <CharacterClues characterId={characterId} visibleCount={visibleClueCount}/>
        
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