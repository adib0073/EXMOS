import React, { Component } from 'react';
import {MenuItems} from "./MenuItems";
import './NavBar.css';

class NavBar extends Component {
    state = { clicked: false}
    handleClick = () => {
        this.setState({clicked: !this.state.clicked})
    }
    render() {
        return (
            <nav className='NavBarItems'>
                <h1 className='navbar-logo'>
                    <b>IMPERIUM XAI</b>              
                </h1>
                <img src="https://wms.cs.kuleuven.be/cs/onderzoek/augment/afbeeldingen/group-3.png/@@images/image/preview"  className="augment-logo"></img> 
                <div className='menu-icon' onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times': 'fas fa-bars'}></i>

                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        return (
                        <li key={index}> 
                            <a className={item.cName} href={item.url}>
                            {item.title}
                            </a> 
                        </li>
                        )
                    })}
                    
                </ul>
            </nav>

        )
    }
}

export default NavBar;