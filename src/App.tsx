import React, { useContext, useEffect, useState } from 'react';
import MyRouter from './componets/MyRouter';
import { Layout } from 'componets/Layout';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from 'util/AuthContext';
import Loader from 'componets/Loader';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from 'util/Firebase';

function App() {

  const {user} = useContext(AuthContext);
  const [isAunthenticated, setIsAunthenticated] = useState<boolean>(!!user);
  const [init, setInit] = useState<boolean>(false);

  const auth = getAuth(app);

  useEffect( () => {

    onAuthStateChanged(auth, user => {
      if(user){
        setIsAunthenticated(true);
      }else{
        setIsAunthenticated(false);
      }
      setInit(true);
    })
    
  }, [auth]);

  return (
    <>
      <Layout>
        <ToastContainer theme="dark" autoClose={1000} hideProgressBar newestOnTop/>
        {init ? <MyRouter isAunthenticated={isAunthenticated} /> : <Loader />}
      </Layout>
    </>    
  );
}

export default App;
