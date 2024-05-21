import React from 'react';

type headerType = {
    title1: string,
    title2: string,
    title3: string,
    select? : string,
    setSelect? : any
}

export default function Header({title1, title2, title3, select, setSelect }:headerType){

    return (
        <div className="home__top">
            <div className="home__title">{title1}</div>
            <div className="home__tabs">
    <div className={`home__tab ${select === "For You" ? "home__tab--active" : ""}`} onClick={() => {setSelect("For You")}}>{title2}</div>
    <div className={`home__tab ${select === "Follow" ? "home__tab--active" : ""}`} onClick={() => {setSelect("Follow")}}>{title3}</div>
            </div>
        </div>
    )
}