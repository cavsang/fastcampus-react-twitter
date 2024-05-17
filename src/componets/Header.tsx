import React from 'react';

type headerType = {
    title1: string,
    title2: string,
    title3: string
}

export default function Header({title1, title2, title3}:headerType){
    return (
        <div className="home__top">
            <div className="home__title">{title1}</div>
            <div className="home__tabs">
    <div className="home__tab home__tab--active">{title2}</div>
    <div className="home__tab">{title3}</div>
            </div>
        </div>
    )
}