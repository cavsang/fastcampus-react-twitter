import React, { useContext } from "react";
import {FaUserCircle} from 'react-icons/fa';
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from "util/AuthContext";
import { WrapPostProps } from "util/MyTypes";
import { deleteDoc, doc, updateDoc, increment, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";
import { db, storage } from "util/Firebase";
import { ref, deleteObject } from "firebase/storage";



export default function PostBox({post}:WrapPostProps){

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const imageRef = ref(storage, post?.imageUrl);

    const handleDelete = async (id:string) => {
        if(window.confirm("삭제 하시겠습니까?")){

            if(post?.imageUrl){
                deleteObject(imageRef).catch(error => {console.log(error)});
            }

            await deleteDoc(doc(db,'posts', id));
            navigate("/");
        }
    };

    

    const onLikes = async () => {
        const postRef = doc(db, "posts", post?.id);
        const document = await getDoc(postRef);

        if(user?.uid && document?.data()?.likes?.includes(user?.uid)){
            await updateDoc(postRef,{
                likeCount: increment(-1),
                likes: arrayRemove(user?.uid)
            });
        }else{
            await updateDoc(postRef,{
                likeCount: increment(1),
                likes: arrayUnion(user?.uid)
            });
        }
    }

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
            {post?.imageUrl && (
                <div className="post__image-div">
                    <img src={post?.imageUrl} alt="image-div" className="post__image" width="100" height= "100"/>
                </div> 
            )}
        </Link>
        <div className="post-form">
            <div className="post-form__hashtag">
                    <div className="post-form__hashtag-output">
                        {post?.hashTags?.map((hash, index) => {
                        return <button key={index}>#{hash}</button>;
                        })}
                    </div>
                </div>
        </div>
        <div className="post__box-footer">
            {user?.uid === post?.uid && (
            <>
                <button className="post__delete" onClick={() => {
                    handleDelete(post?.id);
                }}>Delete</button>
                <button className="post__edit">
                    <Link to={`/posts/edit/${post?.id}`} >
                            Edit
                    </Link>
                </button>
            </>
            )
            }
            <button className="post__likes">
                {user && post?.likes?.includes(user?.uid) ? <AiFillHeart onClick={onLikes}/> : <AiOutlineHeart onClick={onLikes}/>} 
                {post?.likeCount || 0}
            </button>
            
            <button className="post__comments">
                <FaRegComment /> {post?.comments?.length ? post?.comments?.length : 0}
            </button>
        </div>
        
    </div>
    );
}