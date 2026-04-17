import { useContext, useEffect, useState } from "react";
import "./SideBar.css";
import logoImg from "./assets/blacklogo.png";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";

function SideBar({ isOpen, setIsOpen }){
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async()=>{
        try{
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            const filteredData = res.map((thread) => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        }catch(err){
            console.log(err);
        }
    };

    useEffect(()=>{
        getAllThreads();
    }, [currThreadId])

    const createNewChat = ()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsOpen(false);
    };

    const changeThread = async(newThreadId)=>{
        setCurrThreadId(newThreadId);
        try{
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            setIsOpen(false);
        }catch(err){
            console.log(err);
        }
    };

    const deleteThread = async(threadId)=>{
        try{
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId == currThreadId){
                createNewChat();
            };
        }catch(err){
            console.log(err)
        }
    };

    return(
        <>
            {isOpen && (
                <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
            )}
            <section className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                <button onClick={createNewChat} className="top-btn">
                    <img src={logoImg} alt="gpt logo" className="logo"/>
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>
                <ul className="history">
                    {
                        allThreads?.map((thread, idx) =>(
                            <li onClick={()=>changeThread(thread.threadId)} key={idx}>
                                {thread.title}
                                <i className="fa-solid fa-trash" onClick={(e) =>{
                                    e.stopPropagation()
                                    deleteThread(thread.threadId)
                                }}></i>
                            </li>
                        ))
                    }
                </ul>
                <div className="sign">
                    <p>By Fareed Hussain ❤️</p>
                </div>
            </section>
        </>
    )
}

export default SideBar;