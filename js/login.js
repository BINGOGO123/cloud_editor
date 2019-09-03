let cookie=document.cookie;
if(!(cookie.indexOf("email")==-1 || cookie.indexOf("password")==-1))
    window.location.replace("editor.html");

let logDiv = new Vue({
    el:"#log",
    data:{
        loginUrl:"php/login.php",
        registerUrl:"php/register.php"
    }
});