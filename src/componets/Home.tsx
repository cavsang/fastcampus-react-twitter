import React from 'react';
import {FiImage} from 'react-icons/fi';

interface PostProps {
    id: string;
    email: string;
    title: string
    content: string;
    createAt: string;
    uid: string
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
                    <label htmlFor="file upload" className="post-form__file">
                        <FiImage />
                    </label>
                </div>
            </form>
        </div>
    )
}