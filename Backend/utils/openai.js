import "dotenv/config";

const getOpenAIAPIResponse = async(message)=>{
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: message
          }]
        })
      }
    
      try{
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options)
        const data = await response.json();
        return data.choices[0].message.content;
      }catch(err){
        console.log(err)
      }
};

const generateTitle = async(message)=>{
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{
            role: "user",
            content: `Generate a short 4-5 word title for this message: "${message}". Only return the title, nothing else.`
          }]
        })
      }
    
      try{
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options)
        const data = await response.json();
        return data.choices[0].message.content;
      }catch(err){
        console.log(err)
      }
};

export { generateTitle };
export default getOpenAIAPIResponse;