import React, { useState, useContext } from 'react';
import { WrapPostProps, CommentProps } from 'util/MyTypes';
import { db } from 'util/Firebase';
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import AuthContext from 'util/AuthContext';
import { toast } from 'react-toastify';


export default function CommentForm({post}:WrapPostProps){
    const [comment, setComment] = useState<string>("");
    const {user} = useContext(AuthContext);
    
    const onChange= (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const {target: {value}} = e;
        setComment(value);
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const postRef = doc(db, "posts", post?.id);
        //const document = await getDoc(postRef);

        const cm:CommentProps = {
            comment: comment,
            createAt : new Date()?.toLocaleDateString("ko",{
                hour: "2-digit",
                minute : "2-digit",
                second: "2-digit"
            }),
            email: user?.email as string,
            uid: user?.email as string
        };

        try {
            await updateDoc(postRef, {
                comments: arrayUnion(cm)
            });
            toast.success('댓글이 입력되었습니다.');
        } catch (e:any) {
            toast.error(e?.code);
        }
    }

    return (
        <form className="post-form" onSubmit={onSubmit}>
            <textarea name="comment" id="comment" required placeholder="댓글 입력" 
            className="post-form__textarea" onChange={onChange} value={comment}></textarea>

            <div className="post-form__submit-area">
                <div></div>
                <input type="submit" value="comment" className="post-form__submit-btn"/>
            </div>
        </form>
    );
}