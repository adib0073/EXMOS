import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar/NavBar.jsx';

export const Configuration = ({ user, setUser }) => {
    
    return (
        <>
            <NavBar user={user} />
        </>);

};