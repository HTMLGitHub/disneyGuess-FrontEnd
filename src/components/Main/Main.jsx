import React, {useContext} from "react";
import Game from "./Game/Game";
import "./Main.css";

export default function Main()
{
    return (
        <main className="main__content">
            <section className="main__container">
                <Game/>
            </section>
        </main>
    );
}