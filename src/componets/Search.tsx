import React, { useState, useEffect, useContext } from 'react';
import { PostProps } from 'util/MyTypes';
import PostBox from './PostBox';
import AuthContext from 'util/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'util/Firebase';

export default function Search(){

    const [posts, setPosts] = useState<PostProps[]>([]);
    const [hashTag, setHashTag] = useState<string>("");
    const {user} = useContext(AuthContext);

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setHashTag(e.target.value);
    };

    useEffect( () => {
        if(user){
            let postRef = collection(db,'posts'); 
            let q = query(postRef,
                where("hashTags","array-contains-any",[hashTag]),
                orderBy("createAt","desc")
            );
            
            onSnapshot(q,(snapshot) => {
                let dataObj = snapshot?.docs?.map((doc) => ({
                    ...doc?.data(),
                    id: doc?.id
                }));
                console.log(dataObj);
                setPosts(dataObj as PostProps[]);
            });
        }
    },[user, hashTag])
    
    return (
        <div className="search">
            <div className="search__title">Search</div>
            <div className="search__input">
                <input type="text" name="search" id="search" placeholder="해시태그 검색" 
                    onChange={onChange} value={hashTag}/>
            </div>
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
    );
}