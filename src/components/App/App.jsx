import React, {useEffect, useState} from 'react';
import {Routes, Route, /*useNavigate,*/ useLocation} from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Main from "../Main/Main";
import Footer from '../Footer/Footer';
import About from "../About/About";
/*import Profile from '../Profile/Profile';*/

import LoginModal from "../Modal/LoginModal/LoginModal"
import RegisterModal from '../Modal/RegisterModal/RegisterModal'
import CurrentUserContext from '../../Contexts/CurrentUserContext';
import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes';
import * as auth from '../../utils/auth.js'; // Import auth functions
import getCharacter from '../../utils/api.js';
import { Clues } from '../../utils/clues/clues.js';

export default function App()
{
    const [activeModal, setActiveModal] = useState("");
    //const [isSaving, setIsSaving] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [currentUser, setCurrentUser] = useState({});
    //const [token, setToken] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isAuthChecked, setIsAuthChecked] = useState(true);
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);

    const location = useLocation();
    // const navigate = useNavigate();

    useEffect(() => 
    {
        if(isAuthChecked && !isLoggedIn && location.state?.openRegisterModal)
        {
            setActiveModal("register");

            // Clear state so it does not reopen on every navigation
            window.history.replaceState({}, document.title);
        }
    }, [location, isAuthChecked, isLoggedIn]);

    const fetchCharacterById = async (id) => {
        setLoading(true);
        setError(null);

        getCharacter(id)
        .then((data) =>
        {
            const apiCharacter = data.data;
            const clueData = Clues[apiCharacter._id] || {};

            const mergedCharacter =
            {
                ...apiCharacter, 
                aliases: clueData.aliases || [],
                strictAliases: clueData.strictAliases || [],
                clues: clueData.clues || [],
            };

            setCharacter(mergedCharacter); 
        })
        .catch((err) =>
        {
            console.error(`Error fetching character: ${err}`);
            setError(err.message);
        })
        .finally(() => 
        {
            setLoading(false);
        })
    }

    /*function handleSubmit(request) {
        setIsSaving(true);
        request()
            .then(() => { closeActiveModal(); })
            .catch(async (err) => 
                {
                    if (typeof err === "string") { console.error("Error:", err); }
                    else if (err instanceof Response)
                    {
                        const errorText = await err.text();
                        console.error("Server responeded with:", errorText);
                    }
                    else { console.error("Unexpected error:", err); }})
            .finally(() => setIsSaving(false));
    }
            */

    const handleRegister = ({name, email, password}) => 
    {
        auth.register({name, email, password})
        .then(() =>
        {
            setActiveModal("login");
            setRegisterError("");
        })
        .catch(async (err) =>
        {
            console.error("Registration error:", err);
            let errorMessage = "An error occurred during registration";
            if (err instanceof Response) 
            {
                try
                {
                    const errorData = await err.json();

                    if(errorData?.message) { errorMessage = errorData.message; }
                }
                catch(jsonError) { console.warn("Error parsing JSON", jsonError); }
            }
            else if(err?.message) { errorMessage = err.message; }

            if
            (
                errorMessage.includes("Email already exists") || 
                errorMessage.includes("11000") || 
                errorMessage.includes("409")
            ) { setRegisterError("Email is already registered"); }
            else { setRegisterError(errorMessage); }
        });
    };

    const handleLogin = ({email, password}) =>
    {
        return auth.login({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        // setToken(res.token);
        setIsLoggedIn(true);
        setLoginError("");
        return auth.checkToken(res.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        closeActiveModal();
      })
      .catch((err) => {
        console.error("Login error", err);
        setLoginError("Invalid email or password");
      });
    };

    useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) { // Save token to state
      // setToken(storedToken);
      auth.checkToken(storedToken)
        .then((userData) => {
          setCurrentUser(userData);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Token check failed", err);
          setIsLoggedIn(false);
        }).finally(() => {
          setIsAuthChecked(true);
        });
    }
    else {
      setIsAuthChecked(true);
    }
  }, []);
    
    const closeActiveModal = () => setActiveModal("");

    /*const handleSignOut = () => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setCurrentUser({});
        setToken("");
        closeActiveModal();

        navigate("/", {replace: true});
    }
    */

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
                                <Main
                                    character={character}
                                    error={error}
                                    loading={loading}
                                    score={score}
                                    setScore={setScore}
                                    fetchCharacterById={fetchCharacterById}
                                />
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
                        <Route
                            path='/about'
                            element=
                            {
                                <About/>
                            }
                        />
                    </Routes>

                    <Footer/>
                </div> {/*end of class = app__content*/}

                <LoginModal
                    closeActiveModal={closeActiveModal}
                    activeModal={activeModal}
                    onLogin={handleLogin}
                    //isSaving={isSaving}
                    setActiveModal={setActiveModal}
                    loginError={loginError}
                />

                <RegisterModal
                    closeActiveModal={closeActiveModal}
                    activeModal={activeModal}
                    onRegister={handleRegister}
                    //isSaving={isSaving}
                    setActiveModal={setActiveModal}
                    registerError={registerError}
                />
            </div> {/*end of class = app*/}
        </CurrentUserContext.Provider>
    );
}