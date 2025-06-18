import React, {useEffect, useState} from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Main from "../Main/Main";
import Footer from '../Footer/Footer';
/*import Profile from '../Profile/Profile';

import LoginModal from "../Modal/LoginModal/LoginModal"
import RegisterModal from '../Modal/RegisterModal/RegisterModal'
*/

import CurrentUserContext from '../../Contexts/CurrentUserContext';
import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes';
import {set} from 'mongoose';

/*
import * from '../../utils/api';
import * from '../../utils/auth.';
*/
export default function App()
{
    const [activeModal, setActiveModal] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [currentUser, setCurrentUser] = useState({});
    const [token, setToken] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isAuthChecked, setIsAuthChecked] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => 
    {
        if(isAuthChecked && !isLoggedIn && location.state?.openRegisterModal)
        {
            setActiveModal("register");

            // Clear state so it does not reopen on every navigation
            window.history.replaceState({}, document.title);
        }
    }, [location, isAuthChecked, isLoggedIn]);
    
    const closeActiveModal = () => setActiveModal("");

    const handleSignOut = () => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setCurrentUser({});
        setToken("");
        closeActiveModal();

        navigate("/", {replace: true});
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className='app'>
                <div className='app__content'>
                    <Header
                        handleRegisterClick={()=>setActiveModal("register")}
                        handleLoginClick={()=>setActiveModal("login")}
                    />
                    <Routes>
                        <Route
                            path='/'
                            element=
                            {
                                <Main/>
                            }
                        />
                        {/*<Route
                            path="/profile"
                            element=
                            {
                                <ProtectedRoutes isLoggedIn={isLoggedIn}>
                                    <Profile></Profile>
                                </ProtectedRoutes>
                            }
                        />*/}
                    </Routes>

                    <Footer/>
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}