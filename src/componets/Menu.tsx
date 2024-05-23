import React from 'react';
import { useNavigate } from 'react-router-dom';
import {BsHouse} from 'react-icons/bs';
import {FaUserCircle} from 'react-icons/fa';
import {MdLogout} from 'react-icons/md';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'util/Firebase';
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";
import {IoMdNotifications} from 'react-icons/io';
import UseTranslation from 'hooks/UseTranslation';

export default function MenuList(){

    const navigate = useNavigate();

    const trans = UseTranslation();

    const logOut = async () => {
        try {
            const auth = getAuth(app);
            await signOut(auth);
            toast.success('로그아웃 되었습니다.');
            navigate("/signin");
        } catch (error: any) {
            toast.error(error?.code);
        }
    }

    return (
        <div className="footer">
            <div className="footer__grid">
                <button type="button" onClick={() => navigate("/")}><BsHouse /> 
                    <span className="footer__grid--text">{trans('MENU_HOME')}</span>
                </button>
                <button onClick={() => navigate("/profile")}><FaUserCircle /> 
                    <span className="footer__grid--text">{trans('MENU_PROFILE')}</span>
                </button>
                <button onClick={() => navigate("/search")}><FaSearch /> 
                    <span className="footer__grid--text">{trans('MENU_SEARCH')}</span>
                </button>
                <button onClick={() => navigate("/notification")}><IoMdNotifications /> 
                    <span className="footer__grid--text">{trans('MENU_NOTIFICATION')}</span>
                </button>
                <button onClick={logOut}><MdLogout />
                    <span className="footer__grid--text">{trans('MENU_LOGOUT')}</span>
                 </button>
            </div>
        </div>
    );
}