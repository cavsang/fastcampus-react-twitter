import { ReactNode } from "react"
import React from "react"
import MenuList from "./Menu"

interface childrenProps{
    children: ReactNode
}
export const Layout =({children}:childrenProps) => {
    return <div className="layout">
                {children}
                <MenuList />
            </div>;
}