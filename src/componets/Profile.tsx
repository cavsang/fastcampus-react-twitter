import React, { useState, useEffect, useContext } from 'react';
import { PostProps } from 'util/MyTypes';
import PostBox from './PostBox';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import AuthContext from 'util/AuthContext';
import { db } from 'util/Firebase';
import { useNavigate } from 'react-router-dom';

export default function Profile(){

    const PROFILE_DEFAULT_IMG  = "logo192.png"
    const [posts, setPosts] = useState<PostProps[]>([]);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            let postRef = collection(db, "posts");
            let postQuery = query(postRef, where("uid","==",user?.uid), orderBy("createAt","desc"));

            onSnapshot(postQuery, (snapshot) => {
                let dataObj = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id
                }));
                setPosts(dataObj as PostProps[]);
            });
        }
    },[user]);

    return (
         <div className="home">
            
            <div className="home__top">
                <div className="home__title">Profile</div>
                <div className="profile">
                    <img src={user?.photoURL || PROFILE_DEFAULT_IMG} alt="profile" className="profile__image"/>
                    <button className="profile__btn" onClick={() => {navigate('/profile/edit')}}>수정</button>
                </div>
                <div className="profile__text">
    <div className="profile__name">{user?.displayName || '사용자'}</div>
    <div className="profile__email">{user?.email}</div>
                </div>
                <div className="home__tabs">
                    <div className="home__tab home__tab--active">For You</div>
                    <div className="home__tab">Likes</div>
                </div>
            </div>

            {/* tweet post */}
            <div className="post">
                {posts?.length > 0 ? (posts?.map(post => (
                    <PostBox post={post} key={post?.id}/>
                ))):(<div className="post__no-post">
                        <div className="post__text">
                            게시글이 없습니다.
                        </div>
                    </div>)
                }
            </div>
        </div>

        
    )
}