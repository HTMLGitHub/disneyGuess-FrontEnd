import {useContext} from 'react';
import './UserIdentity.css';
import PropTypes from 'prop-types';
import CurrentUserContext from '../../Contexts/CurrentUserContext';

export default function UserIdentity({size = 40, containerClass = ""}) 
{
    const currentUser = useContext(CurrentUserContext);
    const userInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "?";

    if (!currentUser || !currentUser.name) return null;

    return (
        <div className={`user-identity ${containerClass}`}>
            <p className="user-identity__name">{currentUser.name}</p>

            <div className='user-identity__initial' style={{width: size, height: size}}>
                {userInitial}
            </div>
        </div>
    );
}

UserIdentity.propTypes = {
    size: PropTypes.number,
    containerClass: PropTypes.string,
};