import React from "react";
import Game from "./Game/Game";
import "./Main.css";

export default function Main(
    {
        character, error, loading, score, setScore, fetchCharacterById
    }
)
{
    return (
        <main className="main__container">
            <Game
                character={character}
                error={error}
                loading={loading}
                score={score}
                setScore={setScore}
                fetchCharacterById={fetchCharacterById}
            />
        </main>
    );
}