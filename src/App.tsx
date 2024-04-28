import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home page</h1>}></Route>
      <Route path="/posts" element={<h1>Posts page</h1>}></Route>
      <Route path="/posts/:id" element={<h1>Post deatil page</h1>}></Route>
      <Route path="/posts/new" element={<h1>Post new page</h1>}></Route>
      <Route path="/posts/edit/:id" element={<h1>Post edit page</h1>}></Route>
      <Route path="/profile" element={<h1>Profile page</h1>}></Route>
      <Route path="/profile/edit" element={<h1>Profile Edit page</h1>}></Route>
      <Route path="/notification" element={<h1>Notification page</h1>}></Route>
      <Route path="/search" element={<h1>search page</h1>}></Route>
      <Route path="/login" element={<h1>Login page</h1>}></Route>
      <Route path="/signup" element={<h1>signup page</h1>}></Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
