import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container');


//creating loading  ...
let lodInterval;
function loader(element) {
  element.textContent ="";

  lodInterval = setInterval(() => {

    element.textContent +='.';

    if (element.textContent === "....") {
      element.textContent =''
    }
  }, 300)
}


//typing one by one by AI
function typetext(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);  //text.charAt(index) return character under specific index into text
      index++;
    }
    else {
      clearInterval(interval)
    }
  }, 20)
}


//to create unique id for every single message
function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `${timeStamp}-${hexadecimalString}`;
}


//setting the icon and background of message for the chat of user and AI
function chatStripe(isAi, value, uniqueID) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
     <div class="chat">
      <div class="profile">
       <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
      </div>
      <div class="message" id=${uniqueID}> ${value}</div>
     </div>
    <div>
    `
  )
}


const handleSubmit= async (e)=>{
  console.log("submit initiated")
  e.preventDefault();                  //to prevent auto submit
  const data=new FormData(form);       //getting form data

  //user's chat stripe
  chatContainer.innerHTML += chatStripe(false,data.get('prompt'))
  form.reset();
  console.log("submit processing")

  //Ai's chatstript
  const uniqueID= generateUniqueId();
  chatContainer.innerHTML+= chatStripe(true,"d",uniqueID)
  
  chatContainer.scrollTop = chatContainer.scrollHeight;     // to see user typing by scrolling down , to put new message in view
  
  const messageDiv= document.getElementById(uniqueID);    //fetching newly created div in line 54, to avoid new unique id for every message

  loader(messageDiv) ;   //turning on loader
  console.log("submit ended")

  //fetching data from server getting bot response
  const response=await fetch('http://learngpt.onrender.com/', {                            //using fetch() with post method  fetcht(url,optional array of properties)
                                                        method: 'post',
                                                        headers:{
                                                          'content-Type':'application/json'
                                                        } ,
                                                        body:JSON.stringify({
                                                          prompt:data.get('prompt')
                                                        })
  })
  clearInterval(lodInterval);             // to stop writhing ....
  messageDiv.innerHTML="";                //to make bot writhing box to clean not like . , .. ,...

  //here response is an JSON object, slight different thing
  if(response.ok){
    const data=await response.json()  //it converts resoponse into something you can use in js
    const parseData= data.bot.trim(); //getting the data

    typetext(messageDiv,parseData);
  }
  else{
    const err=await response.text();   //used to return the response body as a string
    messageDiv.innerHTML="something going wrong";
    alert(err)
  }
}



//calling handle submit 
form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup', (e)=>{               // function will trigger once we press the enter key 
  if(e.keyCode===13){                               //keycode- 13 =enter key
    handleSubmit(e)                                //2nd way of submit
  }
}) 

