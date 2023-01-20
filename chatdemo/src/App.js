import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; //firebase SDK
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth'; //Hooks
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCe0NIJoU-H5DtaGwrdm4UKXCj991NHRuU",
  authDomain: "chatdemo-81eb4.firebaseapp.com",
  projectId: "chatdemo-81eb4",
  storageBucket: "chatdemo-81eb4.appspot.com",
  messagingSenderId: "381114326837",
  appId: "1:381114326837:web:12baaebee9bb8b3b03367c",
  measurementId: "G-1FMK5LEBSK"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth); //hook, returns object if logged in,return null if not
  return (
    <div className="App">
      <header>
      <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

//declaring components
function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <div>
      <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK5q0FP74VV9wbfwP378_7kj7iDomHuKrxkXsxDdUT28V9dlVMNUe-EMzaLwaFhneeuZI&usqp=CAU'/>
      <button className='sign-in' onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
    
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}> Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef() //hook

  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'}); //data hook, listening to query
  
  const [formValue, setFormValue] = useState(''); //stateful value

  const sendMessage = async(e) => { //event handler
    e.preventDefault();
    const { uid, photoURL} = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({behaivor: 'smooth'});
  } 

  return( //the dummy serves as reference for auto scroll
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg}/>)}
        <span ref={dummy}></span> 
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="write your message here..."/>
        <button type='submit'>SEND</button>
      </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received'; //if operator used to check if the current message should be displayed as sent or received
  return ( // we use those quotes so we can use the $
    <div className={`message ${messageClass}`}> 
      <img src ={photoURL}/>
      <p>{text}</p>
      </div>
  )
}


export default App;
