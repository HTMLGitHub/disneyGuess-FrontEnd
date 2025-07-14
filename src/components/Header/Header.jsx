import React, { useContext} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import "./Header.css";
import CurrentUserContext from "../../Contexts/CurrentUserContext";
import UserIdentity from "../UserIdentity/UserIdentity";
import logo from "../../../src/assets/logo.svg";

export default function Header({handleRegisterClick, handleLoginClick})
{
    const currentUser = useContext(CurrentUserContext);
    
    return (
        <header className="header">
            <Link to='/' className="header__link">
                <div className="header__logo__wrapper">
                    <img src={logo} alt="Mickey Head Logo" className="header__logo__wrapper_image"/>
                </div>
            </Link>

            <div className="header__about">
                <Link to ="/about">
                    <button className="header__button header__about__button">About</button>
                </Link>
            </div>

            <div className="header__auth">
                {currentUser && currentUser.name ? 
                (
                    <Link to="/profile" className="header__link">
                        <UserIdentity size={40} containerClass="header__auth__user-identity"/>
                    </Link>
                ): 
                (
                    <div className="header__auth__container">
                        <button 
                            onClick={handleRegisterClick}
                            type="button"
                            className="header__auth__container__button header__auth__container__button_register">
                            Register
                        </button>
                        <button 
                            onClick={handleLoginClick}
                            type='button'
                            className="header__auth__container__button header__auth__container__button_login">
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