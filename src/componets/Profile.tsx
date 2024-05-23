import React, { useState, useEffect, useContext } from 'react';
import { PostProps } from 'util/MyTypes';
import PostBox from './PostBox';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import AuthContext from 'util/AuthContext';
import { db } from 'util/Firebase';
import { useNavigate } from 'react-router-dom';
import { languageState } from 'atom';
import { useRecoilState } from 'recoil';
import UseTranslation from 'hooks/UseTranslation';

export default function Profile(){

    const PROFILE_DEFAULT_IMG  = "logo192.png"
    const [posts, setPosts] = useState<PostProps[]>([]);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    type tabType = "My" | "Likes";
    const [toggle, setToggle] = useState<tabType>("My");
    const trans = UseTranslation();

    const [language, setLanguage] = useRecoilState(languageState);



    useEffect(() => {
        if(user){
            let postRef = collection(db, "posts");

            let postQuery;
            if(toggle === "My"){
                postQuery = query(postRef, where("uid","==",user?.uid), orderBy("createAt","desc"));
            }else{
                postQuery = query(postRef, where("likes","array-contains",user?.uid), orderBy("createAt","desc"));
            }
            

            onSnapshot(postQuery, (snapshot) => {
                let dataObj = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id
                }));
                setPosts(dataObj as PostProps[]);
            });
        }
    },[user, toggle]);


    const onChangeLanguage = () => {
        //중요한점을 하나 알았는데... 여기서 setLanguage한다고 해도 바로 반영되는게아니다.
        //즉 여기서는 onChangeLanguage 가 끝나야 setLanguage()한 값이 recoil에 반영된다.

        setLanguage(language === "ko" ? "en" : "ko");
        localStorage.setItem('language' ,language === "ko" ? "en" : "ko");
    }


    return (
         <div className="home">
            
            <div className="home__top">
                <div className="home__title">{trans("MENU_PROFILE")}</div>
                <div className="profile__text">
                    <div className="profile__name">{user?.displayName || '사용자'}</div>
                    <div className="profile__email">({user?.email})</div>
                </div>
                <div className="profile">
                    <img src={user?.photoURL || PROFILE_DEFAULT_IMG} alt="profile" className="profile__image"/>
                    <div className="profile__flex">
                        <button className="profile__btn" onClick={() => {navigate('/profile/edit')}}>프로필 수정</button>
                        <button className="profile__btn" onClick={onChangeLanguage}>
                            {language === "ko" ? "한국어" : "English"} {language}
                            </button>
                    </div>
                </div>
                <div className="home__tabs">
                    <div className={toggle ==="My" ? "home__tab home__tab--active": "home__tab"} onClick={() => {setToggle("My")}}>{trans("MENU_PROFILE_TAB1")}</div>
                    <div className={toggle ==="Likes" ? "home__tab home__tab--active": "home__tab"} onClick= {() => {setToggle("Likes")}} >{trans("MENU_PROFILE_TAB2")}</div>
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