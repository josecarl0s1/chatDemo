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
    <button onClick={signInWithGoogle}>Sign In signInWithGoogle</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}> Sign Out</button>
  )
}

function ChatRoom(){
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  return(
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg}/>)}
      </div>
    </>
  )
}

function ChatMessage(props){
  const {text, uid} = props.message;
  return <p>{text}</p>
}

export default App;
