import {Navigate, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ProtectedRoutes({
    isLoggedIn,
    children,
    anonymous = false
})
{
    // Invoke the useLocaiton hook to access the value of the 'from' property from its state object.
    // If the 'from' property is not present, the value of the 'from' property is set to '/'.
    const location = useLocation();
    const from = location.state?.from || '/';

    // If the user is logged in, we redirect them away from our anoymous routes.
    if (isLoggedIn && anonymous) {return <Navigate to={from}/>};

    // If the user is not logged in and tries to access a route that requires authorization, 
    // we redirect them to the /signin route.
    if(!isLoggedIn && !anonymous)
    {
        // While redirecting to /signin, we set the location objects state.from property to the current location value.
        // This allows us to redirect the user back to the route they were trying to access after they have logged in.
        return <Navigate to="/" replace state={{from: location, openRegisterModal: true}}/>;    
    }
    
    // Otherwise, display the children components.
    return children;
}

ProtectedRoutes.protoTypes = 
{
    isLoggedIn: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    anonymous: PropTypes.bool
};