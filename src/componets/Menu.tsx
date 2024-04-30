import React from 'react';
import { useNavigate } from 'react-router-dom';
import {BsHouse} from 'react-icons/bs';
import {FaUserCircle} from 'react-icons/fa';
import {MdLogout} from 'react-icons/md';

export default function MenuList(){

    const navigate = useNavigate();

    return (
        <div className="footer">
            <div className="footer__grid">
                <button type="button" onClick={() => navigate("/")}><BsHouse /> Home</button>
                <button onClick={() => navigate("/profile")}><FaUserCircle /> Profile</button>
                <button onClick={() => navigate("/logout")}><MdLogout /> Logout</button>
            </div>
        </div>
    );
}