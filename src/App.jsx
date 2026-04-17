import './App.css'
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';
import { MyContext } from './MyContext';
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";
import Auth from './Auth';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };  

  return (
    <div className='main'>
      {!isLoggedIn ? <Auth setIsLoggedIn={setIsLoggedIn}/> : (
        <MyContext.Provider value={providerValues}>
          <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
          <ChatWindow setIsSidebarOpen={setIsSidebarOpen} setIsLoggedIn={setIsLoggedIn}/>
        </MyContext.Provider>
      )}
    </div>
  )
}

export default App;