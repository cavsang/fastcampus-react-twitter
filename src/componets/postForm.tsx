import React, { useState, useContext, useEffect } from "react";
import {FiImage} from 'react-icons/fi';
import { toast } from "react-toastify";
import {addDoc, collection} from 'firebase/firestore';
import { db } from "util/Firebase";
import AuthContext from "util/AuthContext";

export default function PostForm(){

    const [content, setContent] = useState<string>();
    const [hashTag, setHashTag] = useState<string[]>([]);
    const [hashTagInput, setHashTagInput] = useState<string>("");
    const {user} = useContext(AuthContext);

    
    const handleFileUpload = () => {
    };

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {target: {name, value}} = e;

        if(name === 'content'){
            setContent(value);
        }else if(name === 'hashtag_input'){
            setHashTagInput(value.trim());
        }
    }

    const onKeyUp = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.keyCode == 32){ //space
            //setHashtag()
            setHashTag((tag) => {
                if(tag?.includes(hashTagInput.trim())){
                    toast.error('해쉬태그 중복 !');
                    return tag;
                }else{
                    return [...tag, hashTagInput.trim()];
                }
            });
            setHashTagInput("");
        }
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
                email : user?.email,
                hashTags: hashTag
            });
            setContent("");
            toast.success("게시글을 생성했습니다.");
            setHashTag([]);
            setHashTagInput("");
        } catch (error:any) {
            toast.error(error?.code);
        }
    }

    return (
        <form className="post-form" onSubmit={onSubmit}>
                <textarea name="content" id="content" required placeholder="what is happening?" 
                className="post-form__textarea" onChange={onChange} value={content}></textarea>
                <div className="post-form__hashtag">
                    <div className="post-form__hashtag-output">
                        {hashTag.map(hash => {
                        return <button onClick={() => (setHashTag(hashTag?.filter(p => p !== hash)))}>#{hash}</button>;
                        })}
                    </div>
                    <div className="post-form__hashtag-input">
                        <input type="text" name="hashtag_input" id="hashtag_input" 
                        placeholder="#해시태그 + 스페이스바 입력" 
                        onKeyUp={onKeyUp}
                        onChange={onChange} 
                        value={hashTagInput}/>
                    </div>                    
                </div>
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