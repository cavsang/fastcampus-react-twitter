import React, { useState, useContext, useEffect } from "react";
import {FiImage} from 'react-icons/fi';
import { toast } from "react-toastify";
import {addDoc, collection, updateDoc, doc} from 'firebase/firestore';
import { db,storage } from "util/Firebase";
import AuthContext from "util/AuthContext";
import {v4 as uuidv4} from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export default function PostForm(){

    const [content, setContent] = useState<string>();
    const [hashTag, setHashTag] = useState<string[]>([]);
    const [hashTagInput, setHashTagInput] = useState<string>("");
    const {user} = useContext(AuthContext);

    const [image, setImage] = useState<string[]>([]);
    //업로드할때 두번눌림 방지.
    const [isSubmit, setIsSubmit]  = useState<boolean>(false);

    
    const handleFileUpload = (e:any) => {
        const {target:{files}} =e;

        for(let i = 0; i < files.length ;i++){
            let file = files?.item(i);

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = (e:any) => {
                const {result} = e?.currentTarget;
                setImage((prev) => [...prev, result]);
            }
        }
     };

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {target: {name, value}} = e;

        if(name === 'content'){
            setContent(value);
        }else if(name === 'hashtag_input'){
            setHashTagInput(value.trim());
        }
    }

    const onKeyUp = (e:any) => {
        const {nativeEvent : {data}} = e;
        
        if(data == " "){ //space
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
        setIsSubmit(true);

        try {

            const docResult = await addDoc(collection(db,"posts"),{
                content: content,
                createAt : new Date()?.toLocaleDateString("ko",{
                    hour: "2-digit",
                    minute : "2-digit",
                    second: "2-digit"
                }),
                uid : user?.uid,
                email : user?.email,
                hashTags: hashTag,
                profileUrl: user?.photoURL
            });


             if(image?.length > 0){
                const uploadUrls = Promise.all(image?.map(async (img) => {

                    //난수생성
                    const key = `${user?.uid}/${uuidv4()}`;

                    const storageRef = ref(storage, key);

                    //1. image 업로드
                    const data = await uploadString(storageRef, img, "data_url");

                    //2. 업로드된 이미지의 download url 업데이트
                    let imgUrl = await getDownloadURL(data?.ref);
                    return imgUrl;
                }));

                const result = await uploadUrls;
                await updateDoc(doc(db, 'posts', docResult?.id),{
                    imageUrl : result
                });
                
                //imageUrls = uploadUrls;
            } 
                
            toast.success("게시글을 생성했습니다.");
            setContent("");
            setImage([]);
            setHashTag([]);
            setHashTagInput("");
        } catch (error:any) {
            toast.error(error?.code);
        }
        setIsSubmit(false);
    }

    return (
        <form className="post-form" onSubmit={onSubmit}>
                <textarea name="content" id="content" required placeholder="what is happening?" 
                className="post-form__textarea" onChange={onChange} value={content}></textarea>
                <div className="post-form__hashtag">
                    <div className="post-form__hashtag-output">
                        {hashTag.map((hash, index) => {
                        return <button  key={index} onClick={() => (setHashTag(hashTag?.filter(p => p !== hash)))}>#{hash}</button>;
                        })}
                    </div>
                    <div className="post-form__hashtag-input">
                        <input type="text" name="hashtag_input" id="hashtag_input" 
                        placeholder="#해시태그 + 스페이스바 입력" 
                        onInputCapture={onKeyUp}
                        onChange={onChange} 
                        value={hashTagInput}/>
                    </div>                    
                </div>
                
                <div className="post-form__submit-area">
                    <div className="post-form__image-area">
                        <label htmlFor="file-input" className="post-form__file">
                            <FiImage className="post-form__file-icon"/>
                        </label>
                        {/* 위의 label의 file-input 과 똑같이 이름을 줘야한다. */}
                        <input type="file" name="file-input" id="file-input" 
                            accept="image/*" onChange={handleFileUpload} className="hidden" multiple/>

                        {image.length > 0 && (
                            <div className="post-form__attachment">
                                {image?.map(img => {
                                    return <img src={img} key={img} alt="attachment" width="100" height="100" />
                                })}
                                <button className="post-form__clear-btn" onClick={() => {setImage([])}}>삭제</button>
                            </div>
                        )}
                    </div>
                    <input type="submit" value="tweet" className="post-form__submit-btn" disabled={isSubmit}/>
                </div>
        </form>
    );
}