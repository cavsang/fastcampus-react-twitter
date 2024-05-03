import React, { useState } from 'react';
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup} from 'firebase/auth';
import {toast} from 'react-toastify';
import { app } from 'util/Firebase';
import { Link } from 'react-router-dom';
import {SignUpTypes} from 'util/MyTypes';


export default function SignUpPage(){

    const [error, setError] = useState<string>();
    const [vals, setVals] = useState<SignUpTypes>(
        {
            email : '',
            password: '',
            repassword : ''
        }
    );

    
    const onChange= (e:React.ChangeEvent<HTMLInputElement>) => {
        const {target : {name , value}} = e;

        if(name === "email"){
             const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
             if(!value?.match(validRegex)){
                setError("Email 형식이 잘못되었습니다.");
             }else{
                 setError("");
             }
        }else if(name === "password"){
            if(value.length < 8){
                setError("비밀번호는 8자리 이상으로 입력 해주세요.");
            }else{
                setError("");
            }
            
        }else if(name === "repassword"){
            if(vals?.password !== value){
                setError("비밀번호 확인이 정확하지 않습니다.");
            }else{
                setError("");
            }
        }


        setVals({
            ...vals,
            [name]: value
        });
    };

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const auth = getAuth(app);
            await createUserWithEmailAndPassword(auth, vals?.email, vals?.password);
            toast.success('회원가입 완료 하였습니다.');
        } catch (e:any) {
            toast.error(e?.code);
        }
    }

    const socialLogin = async (e:any) => {
        const {target : {name}} = e;
        let provider;

        const auth = getAuth(app);

        if(name === "google"){
            provider = new GoogleAuthProvider();
        }else if(name ==="github"){
            provider = new GithubAuthProvider();
        }

        await signInWithPopup(auth, provider as GithubAuthProvider | GoogleAuthProvider)
        .then(result => {
            //console.log(result);
            toast.success('회원가입에 성공하였습니다.');
        })
        .catch(err => {
            toast.error(err?.message);
        });
    }

    return (
        <>
            <div className="home">
                <div className="home__title">SignUp</div>
            </div>

            <div className="signup">
                <form className="signup__form" onSubmit={onSubmit}>
                    <div className="signup__email">
                        <label htmlFor="email">EMAIL</label>
                        <input type="text" name="email" id="email" onChange={onChange} 
                        value={vals.email} required placeholder="EMAIL"/>
                    </div>
                    <div className="signup__password">
                        <label htmlFor="password">PASSWORD</label>
                        <input type="password" name="password" id="password" onChange={onChange} 
                        value={vals.password} required placeholder="PASSWORD"/>
                    </div>
                    <div className="signup__password">
                        <label htmlFor="repassword">PASSWORD CONFIRM</label>
                        <input type="password" name="repassword" id="repassword" onChange={onChange} 
                        value={vals.repassword} required placeholder="PASSWORD CONFIRM"/>
                    </div>
    {error && error?.length > 0  && (<div className="error__message">{error}</div>)}
                    <button name="submit" id="submit" className="signup__submit btn__email">Sign Up</button>

                    <button name="google" id="google" onClick={socialLogin} className="signup__submit btn__google">Google 회원가입</button>

                    <button name="github" id="github" onClick={socialLogin} className="signup__submit btn__github">Github 회원가입</button>

                    <div className="sign__inup">
                        계정이 이미 있으신가요? <Link to="/signin" >Sign In</Link>
                    </div>
                </form>
            </div>
        </>
    );
}