import React from 'react';
import PostEdit from 'componets/PostEdit'
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';


export default function PostEditPage(){

    const navigate = useNavigate();
    const onClick = () => {
        navigate(-1);
    };

    return (
    <div className="post__back">
        <RiArrowGoBackFill className="post__back-icon" onClick={onClick}/>
        <PostEdit />
    </div> 
    )
}