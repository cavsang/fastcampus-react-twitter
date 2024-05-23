import React, { useState, useContext, useEffect, useCallback } from 'react';
import PostForm from './postForm';
import PostBox from './PostBox';
import AuthContext from 'util/AuthContext';
import { collection, query, orderBy, onSnapshot, doc, getDoc, where } from 'firebase/firestore';
import { db } from 'util/Firebase';
import Header from './Header';
import { PostProps } from 'util/MyTypes';
import UseTranslation from 'hooks/UseTranslation';

export default function Home() {

    const[posts, setPosts] = useState<PostProps[]>([]);
    const[followingPosts, setFollowingPosts] = useState<PostProps[]>([]);

    const [select, setSelect] = useState<string>("For You");
    const [fusers, setFusers] = useState<string[]>([]);
    const {user} = useContext(AuthContext);

    const trans = UseTranslation();

    const getFollwingDocs = useCallback( async () => {
        const docRef = doc(db, 'following',user?.uid as string);
        onSnapshot(docRef, (snapshot) => {
            setFusers(snapshot?.data()?.users);
        });
    },[user?.uid]);

    useEffect( () => {
        if(user){
            getFollwingDocs();
        }
    },[select]);

    useEffect(() => {
        if(user){
            setPosts([]);
            let postRef = collection(db, "posts");
            let postQuery = query(postRef, orderBy("createAt","desc"));

            onSnapshot(postQuery, (snapshot) => {
                let dataObj = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id
                }));
            setPosts(dataObj as PostProps[]);
            });

            if(fusers?.length > 0){
                let follwingQuery = query(postRef,where("uid","in",fusers), orderBy("createAt","desc"));
                onSnapshot(follwingQuery, (snapshot) => {
                    let dataObj = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc?.id
                    }));
                setFollowingPosts(dataObj as PostProps[]);
                });
            }else{
                setFollowingPosts([]);
            }
        }
    },[ fusers, user]);
    

    return (
        <div className="home">
            
            <Header title1={trans("MENU_HOME")} title2={trans("MENU_HOMETAB1")} title3={trans("MENU_HOMETAB2")} select={select} setSelect={setSelect}/>
            
            {select && select === "For You" && (<PostForm />)}

            {/* tweet post */}
            <div className="post">
                {select === "For You" && (posts?.length > 0 ? (posts?.map(post => (
                    <PostBox post={post} key={post?.id}/>
                ))):(<div className="post__no-post">
                        <div className="post__text">
                            게시글이 없습니다.
                        </div>
                    </div>)
                )}

                {select === "Follow" && (followingPosts?.length > 0 ? (followingPosts?.map(post => (
                    <PostBox post={post} key={post?.id}/>
                ))):(<div className="post__no-post">
                        <div className="post__text">
                            게시글이 없습니다.
                        </div>
                    </div>)
                )}


            </div>
        </div>
    )
}