import { useState } from "react";
import "./Auth.css";

export default function Auth({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isLogin){
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if(data.token){
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
      }else{
        alert(data.message);
      }
    }else{
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if(data.message === "User registered successfully"){
        alert("Registered! Ab login karo");
        setIsLogin(true);
      }else{
        alert(data.message);
      }
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
          )}
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}