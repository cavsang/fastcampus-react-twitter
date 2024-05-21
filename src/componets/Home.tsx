import React, { useState, useContext, useEffect } from 'react';
import PostForm from './postForm';
import PostBox from './PostBox';
import AuthContext from 'util/AuthContext';
import { collection, query, orderBy, onSnapshot, doc, getDoc, where } from 'firebase/firestore';
import { db } from 'util/Firebase';
import Header from './Header';
import { PostProps } from 'util/MyTypes';

export default function Home() {

    const[posts, setPosts] = useState<PostProps[]>([]);
    const [select, setSelect] = useState<string>("For You");
    //const [fusers, setFusers] = useState<string[]>([]);
    const {user} = useContext(AuthContext);

    const getFollwingDocs = async () => {
        const docRef = doc(db, 'following',user?.uid as string);
        const docs = await getDoc(docRef);
        return docs?.data();
    }

    useEffect(() => {
        if(user){
            if(select === "For You"){
                let postRef = collection(db, "posts");
                let postQuery = query(postRef, orderBy("createAt","desc"));

                onSnapshot(postQuery, (snapshot) => {
                    let dataObj = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc?.id
                    }));
                setPosts(dataObj as PostProps[]);
                });

            }else{
                getFollwingDocs().then(doc => {
                    let postRef = collection(db, "posts");
                    let postQuery = query(postRef,where("uid","in",doc?.users), orderBy("createAt","desc"));

                    onSnapshot(postQuery, (snapshot) => {
                        let dataObj = snapshot.docs.map((doc) => ({
                            ...doc.data(),
                            id: doc?.id
                        }));
                    setPosts(dataObj as PostProps[]);
                    });
                });
            }
        }
    },[user, select]);
    

    return (
        <div className="home">
            
            <Header title1="Home" title2="For You" title3="Follow" select={select} setSelect={setSelect}/>
            
            {select && select === "For You" && (<PostForm />)}

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