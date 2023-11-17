import React from 'react'
import logo from '../asset/logo.png'
import { Link } from 'react-router-dom'
import '../style/Navbar.css'

function NavBar() {
    return (
        <div className='header'>
            <div className='logo'>
                <img src={logo} alt="Logo" width="150" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Join</Link>
                    </li>
                    <li>
                        <Link to="/host">Create</Link>
                    </li>
                    <li>
                        <Link to="/login">Logout</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar