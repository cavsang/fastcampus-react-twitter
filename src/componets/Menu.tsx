import React from 'react';
import { useNavigate } from 'react-router-dom';
import {BsHouse} from 'react-icons/bs';
import {FaUserCircle} from 'react-icons/fa';
import {MdLogout} from 'react-icons/md';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'util/Firebase';
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";

export default function MenuList(){

    const navigate = useNavigate();

    const logOut = async () => {
        try {
            const auth = getAuth(app);
            await signOut(auth);
            toast.success('로그아웃 되었습니다.');
            navigate("/signup");
        } catch (error: any) {
            toast.error(error?.code);
        }
    }

    return (
        <div className="footer">
            <div className="footer__grid">
                <button type="button" onClick={() => navigate("/")}><BsHouse /> Home</button>
                <button onClick={() => navigate("/profile")}><FaUserCircle /> Profile</button>
                <button onClick={() => navigate("/search")}><FaSearch /> Search</button>
                <button onClick={logOut}><MdLogout /> Logout</button>
            </div>
        </div>
    );
}