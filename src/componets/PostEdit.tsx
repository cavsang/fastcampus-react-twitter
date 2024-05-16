import React, { useState, useContext, useEffect, useCallback } from "react";
import {FiImage} from 'react-icons/fi';
import { toast } from "react-toastify";
import {getDoc, doc, updateDoc, deleteField} from 'firebase/firestore';
import { db, storage } from "util/Firebase";
import { useParams, useNavigate } from "react-router-dom";
import { deleteObject, ref, uploadString, getDownloadURL } from "firebase/storage";
import AuthContext from "util/AuthContext";
import {v4 as uuidv4} from "uuid";

export default function PostEdit(){

    const params = useParams();
    const [content, setContent] = useState<string>();
    const [hashTag, setHashTag] = useState<string[]>([]);
    const [hashTagInput, setHashTagInput] = useState<string>("");

    const [image, setImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const {user} = useContext(AuthContext);
    const [isSubmit, setIsSubmit]  = useState<boolean>(false);

    const navigate = useNavigate();

    const getDocs = useCallback(async (id:string) => {
        if(id){
            const docRef = doc(db, 'posts', id);
            const document = await getDoc(docRef);
            setContent((document?.data()?.content) as string);
            setHashTag(document?.data()?.hashTags);
            setImage(document?.data()?.imageUrl);
            setOriginalImage(document?.data()?.imageUrl);
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

    const handleFileUpload = (e:any) => {
        const {target:{files}} =e;
        const file = files?.[0];
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onloadend = (e:any) => {
            const {result} = e?.currentTarget;
            setImage(result);
        }
    };

    const removeImgForServer = (targetImage:string) => {
        const imageRef = ref(storage, targetImage);
        deleteObject(imageRef).catch(error => {console.log(error)});
    }

    const onSubmit= async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmit(true);
        try {
            const docRef = doc(db, 'posts', params?.id as string);
            let isChange = false;
            if(image && originalImage){
                isChange = !(image === originalImage);
            } 

            let updateData:any = {
                content     : content,
                updatedAt : new Date()?.toLocaleDateString("ko",{
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
                hashTags: hashTag,
            };

            console.log(isChange);

            if(image){
                if(isChange){
                    removeImgForServer(originalImage as string);
                }
                const key = `${user?.uid}/${uuidv4()}`;
                const storageRef = ref(storage, key);
                //1. image 업로드
                const data = await uploadString(storageRef, image, "data_url");
                //2. 업로드된 이미지의 download url 업데이트
                const downloadImgUrl = await getDownloadURL(data?.ref);
                updateData.imageUrl = downloadImgUrl;

            }else if( !image && originalImage){
                removeImgForServer(originalImage);
                updateData.imageUrl = deleteField();
            }
            //console.log(updateData);
            await updateDoc(docRef,updateData);
            toast.success("게시글을 수정 했습니다.");
            
        } catch (error:any) {
            toast.error(error?.code);
        }
        setIsSubmit(false);
        navigate(`/posts/${params?.id}`);
    }

    return (
        <form className="post-form" onSubmit={onSubmit}>
                <textarea name="content" id="content" required placeholder="what is happening?" 
                className="post-form__textarea" onChange={onChange} value={content}></textarea>
                
                <div className="post-form__hashtag">
                    <div className="post-form__hashtag-output">
                        {hashTag?.map((hash, index) => {
                        return <button key={index} onClick={() => (setHashTag(hashTag?.filter(p => p !== hash)))}>#{hash}</button>;
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
                    <div className="post-form__image-area">
                        <label htmlFor="file-input" className="post-form__file">
                            <FiImage className="post-form__file-icon"/>
                        </label>
                        {/* 위의 label의 file-input 과 똑같이 이름을 줘야한다. */}
                        <input type="file" name="file-input" id="file-input" accept="image/*" onChange={handleFileUpload} className="hidden"/>

                        {image && (
                            <div className="post-form__attachment">
                                <img src={image} alt="attachment" width="100" height="100" /> 
                                <button className="post-form__clear-btn" onClick={() => {setImage(null)}}>삭제</button>
                            </div>
                        )}
                        
                    </div>
                    <input type="submit" value="tweet" className="post-form__submit-btn"/>
                </div>
        </form>
    );
}