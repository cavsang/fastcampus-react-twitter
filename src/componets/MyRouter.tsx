import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import PostsPage from 'pages/PostsPage';
import PostNewPage from 'pages/PostNewPage';
import PostDetailPage from "pages/PostDetailPage"
import ProfilePage from 'pages/ProfilePage';
import ProfileEditPage from 'pages/ProfileEditPage';
import NotificationPage from 'pages/NotificationPage';
import SearchPage from 'pages/SearchPage';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';
import PostEditPage from 'pages/PostEditPage';

interface MyRouterProps{
    isAunthenticated? : boolean
}

export default function MyRouter({isAunthenticated}:MyRouterProps){


    return (
        <Routes>
            {isAunthenticated ? 
            <>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/posts" element={<PostsPage />}></Route>
                <Route path="/posts/:id" element={<PostDetailPage />}></Route>
                <Route path="/posts/new" element={<PostNewPage />}></Route>
                <Route path="/posts/edit/:id" element={<PostEditPage />}></Route>
                <Route path="/profile" element={<ProfilePage />}></Route>
                <Route path="/profile/edit" element={<ProfileEditPage />}></Route>
                <Route path="/notification" element={<NotificationPage />}></Route>
                <Route path="/search" element={<SearchPage />}></Route>
                <Route path="/signin" element={<SignInPage />}></Route>
                <Route path="/signup" element={<SignUpPage />}></Route>
                <Route path="*" element={<Navigate replace to="/" />} />
            </>
            :
            <>
                <Route path="/signin" element={<SignInPage />}></Route>
                <Route path="/signup" element={<SignUpPage />}></Route>
                <Route path="*" element={<SignInPage />} />
            </>
            }
        </Routes>
    )
}