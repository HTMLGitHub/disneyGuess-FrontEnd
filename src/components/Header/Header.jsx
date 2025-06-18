import React, { useContext} from "react"
import PropTypes from "prop-types"
import {Link} from "react-router-dom"
import "./Header.css"
import logo from "../../assets/react.svg"
import CurrentUserContext from "../../Contexts/CurrentUserContext"
import UserIdentity from "../UserIdentity/UserIdentity"

export default function Header({handleRegisterClick, handleLoginClick})
{
    const currentUser = useContext(CurrentUserContext);
    
    return (
        <header className="header">
            <Link to='/' className="header_link">
                <img src={logo} alt="Logo" className="header__logo"></img>
            </Link>

            <div className="header__left">
                <Link to ="/about">
                    <button className="header__about-button">About</button>
                </Link>
                

            </div>

            <div className="header__right">
                {currentUser && currentUser.name ? 
                (
                    <Link to="/profile" className="header__link">
                        <UserIdentity size={40} containerClass="user-identity__header"/>
                    </Link>
                ): 
                (
                    <div className="header__user-container">
                        <button 
                            onClick={handleRegisterClick}
                            type="button"
                            className="header__register-button">
                            Register
                        </button>
                        <button 
                            onClick={handleLoginClick}
                            type='button'
                            className="header__login-button">
                            Login
                        </button>                       
                    </div>
                )}  
            </div>
        </header>
    )
}

Header.propTypes = 
{
    handleLoginClick: PropTypes.func.isRequired,
    handleRegisterClick: PropTypes.func.isRequired,
}