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

export interface WrapPostProps{
    post: PostProps
}

export interface WrapCommentProps{
    comment: CommentProps
    onDelete: any
}

export interface NoticationProps{ 
    id: string,
    content : string,
    createAt: string,
    isRead : boolean,
    uid: string,
    url?:string
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
    comments?: CommentProps[],
    hashTags: string[],
    imageUrl : string[],
}

export interface CommentProps{
    comment: string,
    createAt : string,
    email?: string,
    uid: string,
    id?: string 
}