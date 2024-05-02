import React from 'react';
import MyRouter from './componets/MyRouter';
import { Layout } from 'componets/Layout';
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const isAunthenticated = false;

  return (
    <>
      <Layout>
        <ToastContainer />
        <MyRouter isAunthenticated={isAunthenticated} />
      </Layout>
    </>    
  );
}

export default App;
