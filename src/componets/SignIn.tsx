import React from 'react';

export default function SignIn(){
    return (
        <>
            <div className="home">
                <div className="home__title">SignUp</div>
            </div>

            <div className="signup">
                <form className="signup__form" >
                    <div className="signup__email">
                        <label htmlFor="email">EMAIL</label>
                        <input type="text" name="email" id="email" required placeholder="EMAIL"/>
                    </div>
                    <div className="signup__password">
                        <label htmlFor="password">PASSWORD</label>
                        <input type="text" name="password" id="password" required placeholder="PASSWORD"/>
                    </div>
                    <button name="submit" id="submit" className="signup__submit">Sign up</button>
                </form>
            </div>
        </>
    )
}