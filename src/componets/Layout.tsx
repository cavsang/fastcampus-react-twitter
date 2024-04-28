import { ReactNode } from "react"
import React from "react"

interface childrenProps{
    children: ReactNode
}
export const Layout =({children}:childrenProps) => {
    return <div className="layout">{children}</div>;
}