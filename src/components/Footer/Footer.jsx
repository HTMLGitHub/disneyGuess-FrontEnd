import "./Footer.css"

export default function Footer()
{
    return (
        <footer className="footer__container">
            <h3 className="footer__author">Developed by Matthew Lee</h3>
            <h3 className="footer__year">&copy; {new Date().getFullYear()} Disney Guess. All rights reserved.</h3>
        </footer>
    );
}