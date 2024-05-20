import { WrapPostProps, CommentProps, WrapCommentProps } from "util/MyTypes";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "util/AuthContext";
 
export default function CommentBoxs({post}:WrapPostProps){

    //const [comments, setComment] = useState<CommentProps[]>([]);
    

    return (
        <div className="post">
            {post?.comments?.length ? (post?.comments?.map(comment => (
                <CommentBox comment={comment} key={comment?.id}/>
            ))):(<div className="post__no-post">
                    <div className="post__text">
                        댓글이 없습니다.
                    </div>
                </div>)
            }
        </div>
    )
}

function CommentBox({comment}:WrapCommentProps){
    const {user} = useContext(AuthContext);
    const handleDelete = (id:string )=> {

    }

    return (
        <div className="post__box">
            <div className="post__box-profile">
                <div className="post__email">{comment?.email}</div>
                <div className="post__createAt">{comment?.createAt}</div>
            </div>
            <div className="post__box-content">
                {comment?.comment}
            </div>
        <div className="post__box-footer">
            {user?.uid === comment?.uid && (
            <>
                <button className="post__delete" onClick={() => {
                }}>Delete</button>
            </>
            )
            }
        </div>
        
    </div>
    )
}