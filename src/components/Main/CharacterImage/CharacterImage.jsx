import React from 'react';
import PropTypes from 'prop-types';
import './CharacterImage.css';

export default function CharacterImage({imageUrl, name})
{
    return (
        <div className="character-image__container">
            <img
                src={imageUrl}
                alt={`Image of ${name}`}
                className='character-image__picture'
            />
        </div>
    );
}

CharacterImage.PropTypes=
{
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};