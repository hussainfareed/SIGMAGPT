import "./ChatWindow.css";
import Chat from "./Chat.jsx"; 
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import {RingLoader} from "react-spinners";

function ChatWindow({ setIsSidebarOpen, setIsLoggedIn }){
    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const token = localStorage.getItem("token");

    const getReply = async()=>{
        setLoading(true);
        setNewChat(false);
        const options = {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ message: prompt, threadId: currThreadId }),
};
        try{
            const response = await fetch("http://localhost:8080/api/chat", options)
            const res = await response.json();
            setReply(res.reply);
        }catch(err){
            console.log(err)
        }
        setLoading(false);
    };

    useEffect(() =>{
        if(prompt && reply){
            setPrevChats((prevChats) =>(
                [...prevChats, 
                    { role: "user", content: prompt }, 
                    { role: "assistant", content: reply }
                ]
            ));
        }
        setPrompt("")
    }, [reply])

    const handleDropdown = ()=>{
        setIsOpen(!isOpen)
    };

    const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
};

    return(
        <div className="chatWindow">
            <div className="navbar">
                {/* Hamburger button - sirf mobile pe dikhega */}
                <button className="hamburger-btn" onClick={() => setIsSidebarOpen(prev => !prev)}>
                    <i className="fa-solid fa-bars"></i>
                </button>

                <span>SigmaGpt<i className="fa-solid fa-chevron-down"></i></span>
                
                <div className="userIconDiv" onClick={handleDropdown}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {isOpen &&
                <div className="dropdown">
                    <div className="dropItem"><i className="fa-solid fa-cloud-arrow-up"></i> upgrade Plan</div>
                    <div className="dropItem"><i className="fa-solid fa-gear"></i> settings</div>
                    <div onClick={handleLogout} className="dropItem"><i className="fa-solid fa-right-from-bracket"></i> logout</div>
                </div>
            }

            <Chat/>

            <RingLoader color="#fff" loading={loading}/>

            <div className="chatInput">
                <div className="inputBox">
                    <input 
                        type="text" 
                        placeholder="Ask Anything"
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e)=> e.key === "Enter" ? getReply() : ""}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;