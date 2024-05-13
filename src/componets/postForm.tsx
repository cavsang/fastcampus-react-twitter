import React, { useState, useContext } from "react";
import {FiImage} from 'react-icons/fi';
import { toast } from "react-toastify";
import {addDoc, collection} from 'firebase/firestore';
import { db } from "util/Firebase";
import AuthContext from "util/AuthContext";

export default function PostForm(){

    const [content, setContent] = useState<string>();
    const {user} = useContext(AuthContext);

    
    const handleFileUpload = () => {
    };

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const {target: {name, value}} = e;
        setContent(value);
    }

    const onSubmit= async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await addDoc(collection(db,"posts"),{
                content: content,
                createAt : new Date()?.toLocaleDateString("ko",{
                    hour: "2-digit",
                    minute : "2-digit",
                    second: "2-digit"
                }),
                uid : user?.uid,
                email : user?.email
            });
            setContent("");
            toast.success("게시글을 생성했습니다.");
        } catch (error:any) {
            toast.error(error?.code);
        }
    }

    return (
        <form className="post-form" onSubmit={onSubmit}>
                <textarea name="content" id="content" required placeholder="what is happening?" 
                className="post-form__textarea" onChange={onChange} value={content}></textarea>
                <div className="post-form__submit-area">
                    <label htmlFor="file-input" className="post-form__file">
                        <FiImage className="post-form__file-icon"/>
                    </label>
                    {/* 위의 label의 file-input 과 똑같이 이름을 줘야한다. */}
                    <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden"/>
                    <input type="submit" value="tweet" className="post-form__submit-btn"/>
                </div>
        </form>
    );
}