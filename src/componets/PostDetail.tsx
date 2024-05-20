import React, { useState, useEffect } from 'react';
import { PostProps } from 'util/MyTypes';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from 'util/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Loader from './Loader';
import PostBox from './PostBox';
import { RiArrowGoBackFill } from "react-icons/ri";
import CommentForm from './CommentForm';
import CommentBoxs from './CommentBoxs';

export default function PostDetail(){

    const params = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostProps>();

    const getPost = async (ids: string) => {
        const docRef = doc(db,'posts',ids);
        const document = await getDoc(docRef);
        setPost({...document.data() as PostProps,id: document?.id});
    }

    useEffect(() => {
        getPost(params?.id as string);
    },[params?.id]);

    const onClick = () => {
        navigate(-1);
    };

    return (
        <div className="post">
            <div className="post__back" onClick={onClick}>
                <RiArrowGoBackFill className="post__back-icon" />
            </div>
            {post ? 
            <>
                <PostBox post={post} />
                <CommentForm post={post} />
                <CommentBoxs post={post}/>
            </> : <Loader />}
        </div>
    )
}