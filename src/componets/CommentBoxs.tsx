import { WrapPostProps, CommentProps, WrapCommentProps } from "util/MyTypes";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "util/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { onSnapshot, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "util/Firebase";
import { toast } from "react-toastify";
 
export default function CommentBoxs({post}:WrapPostProps){

    const [comments, setComments] = useState<CommentProps[]>([]);

    const docRef = doc(db, "posts", post?.id);
    useEffect(() => {
        
        onSnapshot(docRef, (doc) => {
            setComments(doc?.data()?.comments);
        });
    },[]);

    const onDelete = async (comment:string, email:string, uid:string, createAt:string) => {
        
        const data = comments.filter(cm => {
            return cm.comment === comment && cm.email === email && cm.uid === uid && cm.createAt === createAt
        });

        if(window.confirm("댓글을 삭제하시겠습니까?")){
            try {
                await updateDoc(docRef, {
                    comments: arrayRemove(data?.[0])
                });
                toast.success('댓글이삭제 되었습니다.');
            } catch (error:any) {
                toast.error(error?.code);
            }
        }
        
    }
    
    return (
        <div className="post">
            {comments?.length ? (comments?.map((comment, index) => (
                <CommentBox comment={comment} key={index} onDelete={onDelete}/>
            ))):(<div className="post__no-post">
                    <div className="post__text">
                        댓글이 없습니다.
                    </div>
                </div>)
            }
        </div>
    )
}

function CommentBox({comment, onDelete}:WrapCommentProps){
    const {user} = useContext(AuthContext);

    return (
        <div className="post__box">
            <div className="post__box-profile">
                 <div className="post__flex">
                        <FaUserCircle className="post__box-profile-icon"/>
                </div>
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
                    onDelete(comment?.comment,comment?.email, user?.uid, comment?.createAt);
                }}>Delete</button>
            </>
            )
            }
        </div>
        
    </div>
    )
}