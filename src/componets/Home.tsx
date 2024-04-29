import React from 'react';
import {FiImage} from 'react-icons/fi';
import {FaUserCircle} from 'react-icons/fa';
import {AiFillHeart} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface PostProps {
    id: string;
    email: string;
    title: string
    content: string;
    createAt: string;
    uid: string,

    /* optional 표시할때는 ?로 해준다. */
    profileUrl?: string,
    likes? : string[],
    likeCount? : number;
    comments?: any
}

const posts: PostProps[] = [
    {
        id: "1",
        email: "test@test.com",
        content: "제모깁니다.",
        createAt: "2024-04-28",
        uid: "123123"
        , title: "제목111"

    }, {
        id: "2",
        email: "test@test.com",
        content: "제모깁니다2.",
        createAt: "2024-04-28",
        uid: "123123"
        , title: "제목111"
    }, {
        id: "3",
        email: "test@test.com",
        content: "제모깁니다3.",
        createAt: "2024-04-28",
        uid: "123123"
        , title: "제목111"
    }, {
        id: "4",
        email: "test@test.com",
        content: "제모깁니다4.",
        createAt: "2024-04-28",
        uid: "123123"
        , title: "제목111"
    }, {
        id: "5",
        email: "test@test.com",
        content: "제모깁니다5.",
        createAt: "2024-04-28",
        uid: "123123"
        , title: "제목111"
    }
]

export default function Home() {

const handleFileUpload = () => {

};


const handleDelete = () => {

};

    return (
        <div className="home">
            <div className="home__title">Home</div>
            <div className="home__tabs">
                <div className="home__tab home__tab--active">For You</div>
                <div className="home__tab">Following</div>
            </div>
            <form className="post-form">
                <textarea name="content" id="content" required placeholder="what is happening?" className="post-form__textarea"></textarea>
                <div className="post-form__submit-area">
                    <label htmlFor="file-input" className="post-form__file">
                        <FiImage className="post-form__file-icon"/>
                    </label>
                    {/* 위의 label의 file-input 과 똑같이 이름을 줘야한다. */}
                    <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden"/>
                    <input type="submit" value="tweet" className="post-form__submit-btn"/>
                </div>
            </form>

            {/* tweet post */}
            <div className="post">
                {posts?.map(post => (
                    <div className="post__box" key={post?.id}>
                        <Link to={`/posts/${post?.id}`}>
                            <div className="post__box-profile">
                                <div className="post__flex">
                                    {post?.profileUrl ? 
                                        (<img src={post?.profileUrl} alt="profile" className="post__box-profile-img"/>) 
                                        : 
                                        <FaUserCircle className="post__box-profile-icon"/>}
                                </div>
                                <div className="post__email">{post?.email}</div>
                                <div className="createAt">{post?.createAt}</div>
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
                ))}
            </div>
        </div>
    )
}