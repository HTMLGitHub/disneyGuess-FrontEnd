import React, {useEffect, useState} from 'react';
import {Routes, Route, useNavigation, useLocation} from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Main from "../Main/Main";
import Footer from '../Footer/Footer';
import Profile from '../Profile/Profile';

/*
import * from '../../utils/api';
import * from '../../utils/auth.';
*/

import LoginModal from "../Modal/LoginModal/LoginModal"
import RegisterModal from '../Modal/RegisterModal/RegisterModal'
import CurrentUserContext from '../../Contexts/CurrentUserContext';
import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes';
import {set} from 'mongoose';