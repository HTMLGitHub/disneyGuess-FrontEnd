import React from "react";
import {Link} from "react-router-dom";
import './About.css';

export default function About()
{
    return(
        <div className="about">
            <h1 className="about__header">✨ Welcome to the Disney Character Guessing Game! ✨</h1>

            <p className="about__intro">
                Think you know your Disney icons? Test your memory and intuition as the image slowly
        unblurs and clues are revealed. From timeless classics to modern favorites, see how many
        characters you can recognize before the answer is revealed!
            </p>

            <section className="about__play">
                <h2 className="about__title">How to Play</h2>
                <ol className="about__play-steps">
                    <li className="about__play-step">A character starts off completely blurred.</li>
                    <li className="about__play-step">Every few seconds, the image becomes clearer and a new clue appears.</li>
                    <li className="about__play-step">Type your guess before the image is fully revealed to win!</li>
                </ol>
            </section>

            <section className="about__creator">
                <h2 className="about__title">Who Made This?</h2>
                <p className="about__creator-text">
                    This game was created by <strong>Matthew Lee</strong>, a passionate developer and lifelong Disney fan.
          Built with React and a love for nostalgic fun, this project is both a coding experiment and
          a celebration of the Disney universe.
                </p>
            </section>

            <section className="about__tech">
                <h2 className="about__title">Tech Stack & Credits</h2>
                <ul className="about__tech-list">
                    <li className="about__tech-item">Built with React</li>
                    <li className="about__tech-item">Data provided by
                        <a 
                            className="about__tech-link" 
                            href="https://disneyapi.dev" 
                            target="_blank" 
                            rel="noreferrer"> DisneyAPI.dev
                        </a>
                    </li>
                    <li className="about__tech-item">CSS animations for blur tranitions</li>
                    <li className="about__tech-item">Custom clue login and timing</li>
                </ul>
            </section>

            <section className="about__disclaimer">
                <h2 className="about__title">Disclaimer</h2>
                <p className="about__disclaimer-text">
                    This is a fan-made project and is not affiliated with or endorsed by The Walt Disney Company.
          All characters, images, and trademarks belong to their respective owners.
          </p>
            </section>

            <div className="about__start">
                <Link to="/" className="about__start-link">Ready to Play? Return to Game</Link>
            </div>
        </div>
    );
}