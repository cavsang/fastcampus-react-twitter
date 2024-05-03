/* Signup.tsx */
export type SignUpTypes = {
    email: string,
    password: string,
    repassword?: string
}

/* AuthContext.tsx  */
export interface ChildrenProps{
    children : React.ReactNode;
}