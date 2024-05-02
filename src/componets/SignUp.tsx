import React, { useState } from 'react';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {toast} from 'react-toastify';
import { app } from 'util/Firebase';

type signUpTypes = {
    email: string,
    password: string,
    repassword: string
}

export default function SignUpPage(){

    const [vals, setVals] = useState<signUpTypes>(
        {
            email : '',
            password: '',
            repassword : ''
        }
    );

    
    const onChange= (e:React.ChangeEvent<HTMLInputElement>) => {
        const {target : {name , value}} = e;
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
            ''
        } catch (e) {
            toast.error(e?.code);
        }
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
                        <input type="text" name="password" id="password" onChange={onChange} 
                        value={vals.password} required placeholder="PASSWORD"/>
                    </div>
                    <div className="signup__password">
                        <label htmlFor="repassword">PASSWORD CONFIRM</label>
                        <input type="text" name="repassword" id="repassword" onChange={onChange} 
                        value={vals.repassword} required placeholder="PASSWORD CONFIRM"/>
                    </div>
                    <button name="submit" id="submit" className="signup__submit">Sign up</button>
                </form>
            </div>
        </>
    );
}