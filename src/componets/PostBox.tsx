import React from "react";
import {FaUserCircle} from 'react-icons/fa';
import {AiFillHeart} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {PostProps} from 'componets/Home';

interface PostProp{
    post: PostProps;
}


export default function PostBox({post}:PostProp){

    const handleDelete = () => {
    };

    return (
        <div className="post__box">
        <Link to={`/posts/${post?.id}`}>
            <div className="post__box-profile">
                <div className="post__flex">
                    {post?.profileUrl ? 
                        (<img src={post?.profileUrl} alt="profile" className="post__box-profile-img"/>) 
                        : 
                        <FaUserCircle className="post__box-profile-icon"/>}
                </div>
                <div className="post__email">{post?.email}</div>
                <div className="post__createAt">{post?.createAt}</div>
            </div>
            <div className="post__box-content">
                {post?.content}
            </div>
        </Link>
        <div className="post__box-footer">
            <button className="post__delete" onClick={handleDelete}>Delete</button>
            <button className="post__edit">
                <Link to={`/posts/edit/${post?.id}`} >
                        Edit
                </Link>
            </button>
                    <button className="post__likes"><AiFillHeart /> {post?.likeCount || 0}</button>
            <button className="post__comments">
                <FaRegComment /> {post?.comments || 0}
            </button>
        </div>
        
    </div>
    );
}