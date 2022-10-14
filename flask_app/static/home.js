
// get required html elements
const messagesBox = document.getElementById('messages_box');
const playGround = document.getElementById('playground');
const leftColumn = document.getElementById('left_column');
const awakeTemplate = document.getElementById('awake').content
let awakeTemplateCopy = document.importNode(awakeTemplate, true);
const dadMessageTemplate = document.getElementById('dadMessage').content
const momMessageTemplate = document.getElementById('momMessage').content
const morningSongTemplate = document.getElementById('morningSong').content 
const whatToDoTemplate = document.getElementById('whatToDo').content 
const readyTemplate = document.getElementById('ready').content;
let readyTemplateCopy = document.importNode(readyTemplate, true);
const startflowTemplate = document.getElementById('startflow').content;
let startflowTemplateCopy = document.importNode(startflowTemplate, true);
const showerTemplate = document.getElementById('shower').content;
let showerTemplateCopy = document.importNode(showerTemplate, true)
const get_dressedTemplate = document.getElementById('get_dressed').content;
let get_dressedTemplateCopy = document.importNode(get_dressedTemplate, true)
const organise_bagTemplate = document.getElementById('organise_bag').content;
let organise_bagTemplateCopy = document.importNode(organise_bagTemplate, true)
const hairTemplate = document.getElementById('hair').content;
let hairTemplateCopy = document.importNode(hairTemplate, true)
const doneTemplate = document.getElementById('done').content;
let doneTemplateCopy = document.importNode(doneTemplate, true)

// ajax request handler
let lastButtonClicked = 'none';
let template = 'none';
let targetDiv = 'none';
let currentStep = 0;

const morning_flow_steps = {1:'startflow', 2:'shower', 3:'get_dressed', 4:'organise_bag', 5:'hair', 6:'done'}

function runAjax(buttonId) {
    const tmp = buttonId.split('_');
    template = tmp[0];
    targetDiv = tmp[1];
    let relevantButton = lastButtonClicked;
    if (template === 'next') {
        currentStep += 1;
    }
    if ((['ready','startflow','next'].includes(template))) {
        handleResponse('',relevantButton, template, targetDiv, buttonId, currentStep)
    }
    else {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                handleResponse(xhr, relevantButton, template, targetDiv, buttonId, currentStep);
            }//end if
        lastButtonClicked = template;
        }//end function
        xhr.open('GET','/?name=' + template + '',true);
        xhr.send();
    }
};//end function 

function handleResponse(xhr, relevantButton, template, targetDiv, buttonId, currentStep) {
    if (targetDiv === 'messagesBox') {
        if (template === 'ready') {
            leftColumn.style.visibility = 'collapse'
            sound.play();
            messagesBox.replaceChildren(readyTemplateCopy)
            playGround.innerHTML = ''
        }
        if (template === 'awake') {
            awakeTemplateCopy.getElementById('insert_text').innerHTML = xhr.responseText;
            messagesBox.replaceChildren(awakeTemplateCopy);
        }
    }
    else {
        const currentBtn = document.getElementById(buttonId);
        if (currentBtn.classList[0] === 'option') {
            currentBtn.classList.add("button_pressed");
            if (relevantButton !== 'awake') {
                const previousBtn = document.getElementById(relevantButton + '_playground');
                previousBtn.classList.remove("button_pressed");
            }
        }
        
        if (leftColumn.style.visibility === 'collapse' || relevantButton !== template || template === 'next') {
            leftColumn.style.visibility = 'visible';

        } else {
            leftColumn.style.visibility = 'collapse';                
        }
        if (template === 'morningSong') {
            sound.pause();
        }

        if (template === 'startflow' || template === 'next') {
            document.getElementById('startflow_playground').style.display = 'none';
            if (currentStep > 0) {
                document.getElementById('task_'+(currentStep)).style.backgroundColor = '';
            }
            if (currentStep < 5) {
                document.getElementById('task_'+(currentStep+1)).style.backgroundColor = '#ffc8dd';
            }
        }
        if (template === 'dadMessage') {
            let dadMessageTemplateCopy = document.importNode(dadMessageTemplate, true)
            dadMessageTemplateCopy.getElementById('insert_text').innerHTML = xhr.responseText;
            playGround.replaceChildren(dadMessageTemplateCopy)
        }
        if (template === 'momMessage') {
            let momMessageTemplateCopy = document.importNode(momMessageTemplate, true)
            momMessageTemplateCopy.getElementById('insert_text').innerHTML = xhr.responseText;
            playGround.replaceChildren(momMessageTemplateCopy)
        }
        if (template === 'morningSong') {
            let morningSongTemplateCopy = document.importNode(morningSongTemplate, true)
            morningSongTemplateCopy.getElementById('insert_youtube').src = xhr.responseText;
            playGround.replaceChildren(morningSongTemplateCopy)
        }
        if (template === 'whatToDo') {
            let whatToDoTemplateCopy = document.importNode(whatToDoTemplate, true)
            const todoList = JSON.parse(xhr.responseText);
            for (let i = 0; i < todoList.length; i++) {
                whatToDoTemplateCopy.getElementById('insert_text').innerHTML += '<li>' + todoList[i][0] + ' - ' + todoList[i][1] + '</li>';
            }
            playGround.replaceChildren(whatToDoTemplateCopy)
        }
        if (template === 'startflow') {
            playGround.replaceChildren(startflowTemplateCopy)
        }
        if (template === 'next') {
            let relevantStep = morning_flow_steps[currentStep+1]
            if (relevantStep == 'shower') { 
                playGround.replaceChildren(showerTemplateCopy)
            }
            if (relevantStep == 'get_dressed') { 
                playGround.replaceChildren(get_dressedTemplateCopy)
            }
            if (relevantStep == 'organise_bag') { 
                playGround.replaceChildren(organise_bagTemplateCopy)
            }
            if (relevantStep == 'hair') { 
                playGround.replaceChildren(hairTemplateCopy)
            }
            if (relevantStep == 'done') { 
                playGround.replaceChildren(doneTemplateCopy)
            }
        }
    }//end else 
};//end function

//audio file
let sound = new Audio("/static/bgMusic.mp3");
function playMusic() {
    sound.play();
    sound.loop = true;
    const btn = document.getElementById('play_music')
    btn.style.display = 'none'
};//end function

// weather API
const apiKey = "af756c92d3a4a91c93fb0ed3274f833b";
const inputVal = "tel-aviv";
 
const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    // do stuff with the data
    const currentTemp = Math.round(data['main']['temp']);
    const temperature = document.getElementById('temperature').innerHTML
    document.getElementById('temperature').innerHTML = document.getElementById('temperature').innerHTML.replace(temperature, currentTemp)
  })
  .catch(() => {
    msg.textContent = "Please search for a valid city 😩";
  });

// get date and time
const days = {0:"ראשון",1:"שני",2:"שלישי",3:"רביעי",4:"חמישי",5:"שישי",6:"שבת"}
const months = {1:"ינואר",2:"פברואר",3:"מרץ",4:"אפריל",5:"מאי",6:"יוני",7:"יולי",8:"אוגוסט",9:"ספטמבר",10:"אוקטובר",11:"נובמבר",12:"דצמבר"}

const todayDate = new Date();
const day = days[todayDate.getDay()]
const dayDisplayed = document.getElementById('day').innerHTML
document.getElementById('day').innerHTML = document.getElementById('day').innerHTML.replace(dayDisplayed, day)
const dateInsert = todayDate.getDate() + " " + months[(todayDate.getMonth()+1)] + " "  + todayDate.getFullYear()
const dateDisplayed = document.getElementById('date').innerHTML
document.getElementById('date').innerHTML = document.getElementById('date').innerHTML.replace(dateDisplayed, dateInsert)

function getTime() {
    const todayTime = new Date();
    const time = todayTime.getHours() + ":" + (todayTime.getMinutes()<10?'0':'') + todayTime.getMinutes();
    const timeDisplayed = document.getElementById('time').innerHTML
    document.getElementById('time').innerHTML = document.getElementById('time').innerHTML.replace(timeDisplayed, time)
    setTimeout(getTime, 1000*60)
}

getTime();

// display a timer on each user task
function startTimer() {
    const btn = document.getElementById('start_countdown')
    btn.onclick = null;
    btn.innerHTML = 'סיימתי'
    btn.classList.add('option');
    btn.addEventListener('click',stopTimer)
    let sec = document.getElementById('minutes').innerText;
    sec = sec*60;
    const timerInterval = setInterval(theTimer, 1000);
    
    function theTimer() {
        if (sec === 1) {
            stopTimer();
        }
        document.getElementById("seconds").innerHTML=pad(--sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }//end function

    function pad(val) {
        return val > 9 ? val : "0" + val;
    };   

    function stopTimer() {
        clearInterval(timerInterval);
        const nextButton = document.getElementById('next_button');
        nextButton.innerText = 'לשלב הבא > ';
        nextButton.style.display = 'inline';
        btn.style.display = 'none'
    }//end function    
}//end function

// closing the application
function closeApplication() {
    const pageContent = document.getElementById('main_container');
    pageContent.innerHTML = '';
    sound.pause();
}//end function
