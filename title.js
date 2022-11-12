const text = document.querySelector(".title");
const strText = text.textContent;
const splitText = strText.split("");
text.textContent = "";

let i = 0;
while(i < splitText.length){
    text.innerHTML += "<span>" + splitText[i] + "</span>";
    i++;
}

let char = 0;
let timer = setInterval(onTick, 50);

function onTick(){
    const span = text.querySelectorAll('span')[char];
    span.classList.add('fade');
    char++
    if(char === splitText.length){
        clearInterval(timer);
        timer = null;
        return;
    }
}
