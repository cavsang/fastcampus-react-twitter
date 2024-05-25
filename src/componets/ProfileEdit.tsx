import React, { useState, useContext, useEffect } from 'react';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { FiImage } from 'react-icons/fi';
import AuthContext from 'util/AuthContext';
import {v4 as uuidv4} from "uuid";
import { ref, deleteObject, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from 'util/Firebase';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import Resizer from "react-image-file-resizer";

export default function ProfileEdit(){

    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState<string>();
    const [image, setImage] = useState<string | null>(null);
    const {user} = useContext(AuthContext);
    const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com";

    const onClick = () => {
        navigate(-1);
    };

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {target : {value}} = e;
        setDisplayName(value);
    };

    useEffect(() => {
        if(user){
            setImage(user?.photoURL);
            setDisplayName(user?.displayName as string);
        }
    },[user]);

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let key = `${user?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key);
        let newImageUrl = null;
        
        try {
            //기존 이미지 삭제
            if(user?.photoURL && user?.photoURL.includes(STORAGE_DOWNLOAD_URL_STR)){
                const imageRef = ref(storage, user?.photoURL);
                await deleteObject(imageRef).catch(error => console.log(error));
            }

            //이미지 업로드
            if(image){
                const data = await uploadString(storageRef, image, "data_url");
                newImageUrl = await getDownloadURL(data?.ref);
            }

            //upload profile
            if(user){
                await updateProfile(user, {
                    displayName: displayName || "",
                    photoURL : newImageUrl || null
                }).then(() => {
                    toast.success("프로필이 수정 되었습니다.");
                    navigate("/profile");
                });
            }
        } catch (e:any) {
            toast.error(e?.code);
        }

    };

    const resizeFile = (file: Blob) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(file, 100, 100, "JPEG", 100, 0, (uri) => {
                resolve(uri);
            },"file");
        }
    );

    const handleFileUpload = (e:any) => {
        const {target: {files}} = e;
        const file = files?.[0];
        resizeFile(file).then((uri:any) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(uri);
                fileReader.onloadend = (e:any) => {
                    const {result} = e?.currentTarget;
                    setImage(result);
                } 
            }
        );
    }
    
    return (
        <div className="post__back">
            <RiArrowGoBackFill className="post__back-icon" onClick={onClick}/>
            <form action="" className="post-form" onSubmit={onSubmit}>
                <div className="post-form__profile">
                    <input type="text" name="displayName" placeholder="이름" className="post-form__input"
                     onChange={onChange} value={displayName}/>
                </div>

                {image && (
                    <div className="post-form__attachment">
                        <img src={image} alt="attachment" width="100" height="100" /> 
                        <button className="post-form__clear-btn" onClick={() => {setImage(null)}}>삭제</button>
                    </div>
                )}

                <div className="post-form__submit-area">
                    <div className="post-form__image-area">
                        <label htmlFor="file-input" className="post-form__file">
                            <FiImage className="post-form__file-icon" />
                        </label>
                    </div>
                    <input type="file" name="file-input" id="file-input" className="hidden" accept="image/*" onChange={handleFileUpload}/>
                    <input type="submit" value="수정" className="post-form__submit-btn"/>
                </div>
            </form>
        </div>
    );
}