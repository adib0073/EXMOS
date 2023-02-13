import React, { useState } from 'react';
import { Route, Routes, Link } from "react-router-dom"
import { MenuItems } from "./MenuItems";
import './NavBar.css';

export const NavBar = ({ user }) => {
    const [stateClick, setStateClick] = useState(false);
    var cohort = user.cohort;

    handleClick = () => {
        setStateClick(!stateClick)
    }

    return (
        <nav className='NavBarItems'>
            <h1 className='navbar-logo'>
                <b>EXMOS Dashboard</b>
            </h1>
            <img src="https://wms.cs.kuleuven.be/cs/onderzoek/augment/afbeeldingen/group-3.png/@@images/image/preview" className="augment-logo"></img>
            <div className='menu-icon' onClick={handleClick}>
                <i className={stateClick ? 'fas fa-times' : 'fas fa-bars'}></i>

            </div>
            <ul className={stateClick ? 'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item, index) => {

                    if (index == 0) {
                        return (
                            <li key={index}>
                                <Link to={item.url + cohort} className={item.cName}>
                                    {item.title}
                                </Link>
                            </li>
                        )
                    }

                    return (
                        <li key={index}>
                            <Link to={item.url} className={item.cName}>
                                {item.title}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )

};