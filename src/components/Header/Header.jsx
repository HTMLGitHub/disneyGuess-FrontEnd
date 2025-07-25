import React, { useContext} from "react"
import PropTypes from "prop-types"
import {Link} from "react-router-dom"
import "./Header.css"
import CurrentUserContext from "../../Contexts/CurrentUserContext"
import UserIdentity from "../UserIdentity/UserIdentity"

export default function Header({handleRegisterClick, handleLoginClick})
{
    const currentUser = useContext(CurrentUserContext);
    
    return (
        <header className="header">
            <Link to='/' className="header_link">
            <div className="header__logo_wrapper">
                    <div className="header__logo_icon"></div>
                </div>
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
                        <UserIdentity size={40} containerClass="header__user-identity"/>
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