import React, { useContext, useEffect, useState } from "react";
import {FaUserCircle} from 'react-icons/fa';
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from "util/AuthContext";
import { WrapPostProps } from "util/MyTypes";
import { deleteDoc, doc, updateDoc, increment, arrayUnion, getDoc, arrayRemove, setDoc, onSnapshot, collection, addDoc } from "firebase/firestore";
import { db, storage } from "util/Firebase";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";

export default function PostBox({post, isOrigin}:WrapPostProps){

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    //const imageRef = ref(storage, post?.imageUrl?.[0]);
    const [following, setFollwoing] = useState<boolean>(false);

    const removeImgForServer = (targetImage:string) => {
        const imageRef = ref(storage, targetImage);
        deleteObject(imageRef).catch(error => {console.log(error)});
    }


    const handleDelete = async (id:string) => {
        if(window.confirm("삭제 하시겠습니까?")){

            if(post?.imageUrl){
                for(let o of post?.imageUrl){
                    removeImgForServer(o);
                }
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

    const followingRef = doc(db, "following", user?.uid as string);

    const onFollow = async () => {

        try {
            await setDoc(followingRef,{
                users : arrayUnion(post?.uid)
            },{
                merge:true
            });

            const followRef = doc(db, "follow", post?.uid as string);
            await setDoc(followRef,{
                users : arrayUnion(user?.uid)
            },{
                merge:true
            });

            if(user?.uid !== post?.uid){

                await addDoc(collection(db, 'notifications'),{
                    content: `${user?.email} 이 팔로우 하였습니다.`,
                    createAt : new Date()?.toLocaleDateString("ko",{
                        hour: "2-digit",
                        minute : "2-digit",
                        second: "2-digit"
                    }),
                    isRead: false,
                    uid: post?.uid,
                    url: ''
                });
            }
            toast.success('팔로우 했습니다.');
        } catch (e:any) {
            toast.error(e?.code);
        }
    }

    const removeFollow = async () => {
        await setDoc(followingRef,{
            users : arrayRemove(post?.uid)
        },{
            merge:true
        });

        const followRef = doc(db, "follow", post?.uid as string);
        await setDoc(followRef,{
            users : arrayRemove(user?.uid)
        },{
            merge:true
        });
    }


    useEffect( () => {
        if(user){
            onSnapshot(followingRef, (doc) => {
                //setComments(doc?.data()?.comments);
                setFollwoing(doc?.data()?.users?.includes(post?.uid));
            });
        }
    },[user]);


    return (
        <div className="post__box">
        
            <div className="post__box-profile">
                <div className="post__flex">
                    {post?.profileUrl ? 
                        (<img src={post?.profileUrl} alt="profile" className="post__box-profile-icon"/>) 
                        : 
                        <FaUserCircle className="post__box-profile-icon"/>}
                </div>
                <div className="post__email">{post?.email}</div>
                <div className="post__createAt">{post?.createAt}</div>
                {(user?.uid !== post?.uid) ? 
                    (following ? 
                        <div className="post__following"><button onClick={removeFollow}>following</button></div> 
                        : 
                        <div className="post__follow"><button onClick={onFollow}>follow</button></div>
                    )
                    :
                    <div className="post__following"></div>}
                
            </div>
            <Link to={`/posts/${post?.id}`}>
                <div className="post__box-content">
                    {post?.content}
                </div>
                {post?.imageUrl && (
                    <div className="post__image-div">
                        {post?.imageUrl.map(img => {
                            if(isOrigin){
                                return <img src={img} key={img} alt="image-div" 
                                className="post__image-div__origin"/>
                            }else{
                                return <img src={img} key={img} alt="image-div" 
                                className="post__image-div__100" width="100" height= "100"/>
                            }
                        })}
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