import React from "react";
import {FiImage} from 'react-icons/fi';

export default function PostForm(){

    
    const handleFileUpload = () => {
    };

    return (
        <form className="post-form">
                <textarea name="content" id="content" required placeholder="what is happening?" className="post-form__textarea"></textarea>
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