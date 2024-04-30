import React from 'react';
import PostForm from './postForm';
import PostBox from './PostBox';

export interface PostProps {
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




    return (
        <div className="home">
            <div className="home__title">Home</div>
            <div className="home__tabs">
                <div className="home__tab home__tab--active">For You</div>
                <div className="home__tab">Following</div>
            </div>
            
            <PostForm />

            {/* tweet post */}
            <div className="post">
                {posts?.map(post => (
                    <PostBox post={post} key={post?.id}/>
                ))}
            </div>
        </div>
    )
}