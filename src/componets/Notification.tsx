import React, { useState, useEffect, useContext } from 'react';
import {NoticationProps} from 'util/MyTypes'
import AuthContext from 'util/AuthContext';
import { collection, query, orderBy, onSnapshot, where, updateDoc, doc } from 'firebase/firestore';
import { db } from 'util/Firebase';
import { Link } from 'react-router-dom';


export default function Notification(){

    const {user} = useContext(AuthContext);
    const [notification, setNotification] = useState<NoticationProps[]>([]);
    

    const getNotifications= async () => {
        const notifiReq = collection(db,'notifications');
        const notifiQuery = query(notifiReq, where("uid","==", user?.uid), orderBy("createAt","desc"));
        setNotification([]);

        onSnapshot(notifiQuery, (snapshot) => {
            let dataObj = snapshot?.docs?.map(doc => ({
                ...doc?.data(),
                id: doc?.id
            }));
            setNotification(dataObj as NoticationProps[]);
        });
    };

    useEffect(() => {
        if(user){
            getNotifications();
        }
    },[user]);

    const onRead = async (notifiDoc: NoticationProps) => {
        await updateDoc(doc(db, 'notifications', notifiDoc?.id),{
            isRead: true
        });
    };

    return(
            <div className="post">
                <div className="search__title">Notification</div>
                {notification?.map((data, index) => {
                    return (
                        <div className="notifaction-box" key={data?.id}>
                            <div className="notifaction-box__title">
                                <div className="notifaction-box__createAt">
                                    <div className="createAt">{data?.createAt}</div>
                                </div>
                                {!data?.isRead && data?.url && <div className="notifaction-box__read"></div>}
                            </div>
                                <div className="notifaction-box__content">
                                    <Link to={`${data?.url}`} onClick={() => {onRead(data)}}>
                                        {data?.content}
                                    </Link>
                                </div>
                        </div>
                    );
                })}
            </div>
        )
}
