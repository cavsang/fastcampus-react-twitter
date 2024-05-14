import React, { useState, useContext, useEffect, useCallback } from "react";
import {FiImage} from 'react-icons/fi';
import { toast } from "react-toastify";
import {getDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from "util/Firebase";
import { useParams, useNavigate } from "react-router-dom";

export default function PostEdit(){

    const params = useParams();
    const [content, setContent] = useState<string>();
    const [hashTag, setHashTag] = useState<string[]>([]);
    const [hashTagInput, setHashTagInput] = useState<string>("");

    const navigate = useNavigate();

    
    const handleFileUpload = () => {
    };

    const getDocs = useCallback(async (id:string) => {
        if(id){
            const docRef = doc(db, 'posts', id);
            const document = await getDoc(docRef);
            setContent((document?.data()?.content) as string);
            setHashTag(document?.data()?.hashTags);
        }
    },[params?.id]); 

    useEffect( () => {
        if(params?.id){
            getDocs(params?.id);
        }
    },[getDocs,params?.id]);

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
                if(tag){
                    if(tag?.includes(hashTagInput.trim())){
                        toast.error('해쉬태그 중복 !');
                        return tag;
                    }else{
                        return [...tag, hashTagInput.trim()];
                    }
                }else{
                    return [hashTagInput.trim()];
                }
                
            });
            setHashTagInput("");
        }
    };

    const onSubmit= async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const docRef = doc(db, 'posts', params?.id as string);
            await updateDoc(docRef,{
                content     : content,
                updatedAt : new Date()?.toLocaleDateString("ko",{
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
                hashTags: hashTag
            });
            toast.success("게시글을 수정 했습니다.");
            navigate(`/posts/${params?.id}`);
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
                        {hashTag?.map(hash => {
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