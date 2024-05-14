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

export interface PostProps {
    id: string;
    email: string;
    title: string
    content: string;
    createAt: string;
    uid: string,

    /* optional 표시할때는 ?로 해준다. */
    profileUrl?: string,
    likes? : string[],
    likeCount? : number;
    comments?: any,
    hashTags: string[],
}