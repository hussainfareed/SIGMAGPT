import "./Chat.css";
import { MyContext } from "./MyContext";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply} = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);



  useEffect(()=>{

    if(reply == null){
      setLatestReply(null);
      return;
    };

    if(!prevChats?.length) return;

    const content = reply.split(" "); //individual words

    let idx = 0;
    const interval = setInterval(() =>{
      setLatestReply(content.slice(0, idx+1).join(" "));

      idx++;
      if(idx >= content.length) clearInterval(interval);

      return () => clearInterval(interval);
    }, 40)
  }, [prevChats, reply]);
  
  return (
    <>
      {newChat && <h1>Start a new chat!</h1>}
      <div className="chats">
        {prevChats?.map((chat, idx) => (
          <div
            key={idx}
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {
          prevChats.length > 0 && latestReply !== null && 
          <div className="gptDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {latestReply}
              </ReactMarkdown>
          </div>
        }
        {
           prevChats.length > 0 && latestReply === null && 
          <div className="gptDiv" key={"non-typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {prevChats[prevChats.length -1].content}
              </ReactMarkdown>
          </div>
        }
      </div>
    </>
  );
}

export default Chat;