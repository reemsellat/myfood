
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Category from './Category';
import Product from './Product';
import Register from './Register';


import Payment from './Payment';

import Categories from './Categories';
import Notfound from './Notfound';
import NavigationBarLoggedIn from './NavigationBarLoggedIn';
import Login from './Login';
import { AuthProvider } from './AuthContext';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { updateCurrentUser } from 'firebase/auth';
import { auth } from './firebase';
import HomeLoggedIn from './HomeLoggedIn';
import About from './About';
import Reviews from './Reviews';
import NavigationBar from './NavigateBar';


function App() {
  const [user, setUser] = useState(getAuth().currentUser)
  useEffect(() => { 
    
    onAuthStateChanged(auth, user => {
      updateCurrentUser(auth, user)
      setUser(user)
     
    })
   
  },[])
 
  console.log(user)
  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/myfood/register' element={<Register></Register>} ></Route>
            <Route path='/myfood/login' element={<Login></Login>}></Route>
            <Route path='/myfood' element={user == null ? (<Home></Home>) : (<HomeLoggedIn></HomeLoggedIn>)}></Route>
            <Route element={user==null?(<NavigationBar></NavigationBar>):(<NavigationBarLoggedIn></NavigationBarLoggedIn>)}>
              <Route path='/myfood/about-us' element={<About></About>}></Route>
              <Route path='/myfood/reviews' element={<Reviews></Reviews>}></Route>
            </Route>

            <Route element={<NavigationBarLoggedIn></NavigationBarLoggedIn>}>
              <Route path='/myfood/categories'>
                <Route index element={user == null ? (<Navigate to='/login' replace></Navigate>) : (<Categories></Categories>)}></Route>
                <Route path=':category'>
                  <Route index element={user == null ? (<Navigate to='/login' replace></Navigate>) : <Category></Category>}></Route>
                  <Route path=':product' element={user == null ? (<Navigate to='/login' replace></Navigate>) : <Product></Product>}></Route>
                </Route>
              </Route>
              
              <Route path='/myfood/payment' element={user == null ? (<Navigate to='/login' replace></Navigate>) : <Payment></Payment>}></Route>

            </Route>
            
            <Route path='*' element={<Notfound></Notfound>}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>


  );
}

export default App;
