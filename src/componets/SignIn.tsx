import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignUpTypes } from 'util/MyTypes';
import {toast} from 'react-toastify';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { app } from 'util/Firebase';

export default function SignIn(){

    //const [error, setError] = useState<string>();
    const [vals, setVals] = useState<SignUpTypes>(
        {
            email : '',
            password: '',
            repassword: ''
        }
    );

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {target : {name , value}} = e;
        setVals({...vals,[name]:value});
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, vals?.email, vals?.password);
            toast.success('로그인 하였습니다.');
        } catch (error:any) {
            toast.error(error?.code);
        }
    }

    return (
        <>
            <div className="home">
                <div className="home__title">SignIn</div>
            </div>

            <div className="signup">
                <form className="signup__form" onSubmit={onSubmit}>
                    <div className="signup__email">
                        <label htmlFor="email">EMAIL</label>
                        <input type="text" name="email" id="email" onChange={onChange} value={vals?.email} required placeholder="EMAIL"/>
                    </div>
                    <div className="signup__password">
                        <label htmlFor="password">PASSWORD</label>
                        <input type="password" name="password" id="password" onChange={onChange} value={vals?.password} required placeholder="PASSWORD"/>
                    </div>
                    <button name="submit" id="submit" className="signup__submit">Sign In</button>
                    <div className="sign__inup">
                        계정이 없으신가요? <Link to="/signup" >Sign Up</Link>
                    </div>
                </form>
            </div>
        </>
    )
}