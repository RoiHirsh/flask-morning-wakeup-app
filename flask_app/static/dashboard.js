// get required html elements
const dateField = document.getElementById('dts');
const daySelected = document.getElementById('day_of_week');
const scheduleTemplate = document.getElementById('set_schedule').content;

// get date and time
const days = {0:"ראשון",1:"שני",2:"שלישי",3:"רביעי",4:"חמישי",5:"שישי",6:"שבת"}
const daysEnglish = {"ראשון":"sunday","שני":"monday","שלישי":"tuesday","רביעי":"wednesday","חמישי":"thursday","שישי":"friday","שבת":"saturday"}

//Handle date changes
dateField.addEventListener('input', function () {
	let date = new Date(dateField.value);
    // Get year, month, and day part from the date
    let year = date.toLocaleString("default", { year: "numeric" });
    let month = date.toLocaleString("default", { month: "2-digit" });
    let day = date.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    let formattedDate = year + "-" + month + "-" + day;
    const relevantDay = days[date.getDay()]
    daySelected.value = relevantDay
    dayToFetch = daysEnglish[relevantDay]
    runAjax(dayToFetch,formattedDate);
});

function runAjax(dayToFetch,formattedDate) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            handleResponse(xhr);
        }//end if
    }//end function
    console.log(formattedDate)
    xhr.open('GET',"/dashboard?name=schedule&day=" + dayToFetch +""+"&date=" + formattedDate +"",true);
    xhr.send();
};//end function  

function handleResponse(xhr) {
    let scheduleTemplateCopy = document.importNode(scheduleTemplate, true);
    task_list = JSON.parse(xhr.responseText)
    for (var i = 0; i < task_list.length; i++) 
        {addFirstTasks(scheduleTemplateCopy,task_list[i])}
    let pushTasks = document.getElementById('tasks')
    pushTasks.replaceChildren(scheduleTemplateCopy)
};//end function

// adding/deleting tasks from daiy schedule

function deleteTask(taskId) {
    const removeTask = document.getElementById(taskId)
    removeTask.parentElement.remove();
};// end function

function addFirstTasks(htmlTemplate, taskInfo) {
    const addTaskLocation = htmlTemplate.getElementById('add_task_here');
    const newDiv = document.createElement('div')
    const random = Math.random()
    string = '<input type="text" name="hour" value="'+taskInfo[0]+'" required><input type="text" name="task_for_hour" value="'+taskInfo[1]+'" required><a href="#" id="' + random + '" onclick="deleteTask(this.id)">מחק</a><br>'
    newDiv.innerHTML = string; 
    addTaskLocation.appendChild(newDiv);
};// end function

function addTask() {
    const addTaskLocation = document.getElementById('add_task_here');
    const newDiv = document.createElement('div')
    const random = Math.random()
    string = '<input type="text" name="hour" value="" required><input type="text" name="task_for_hour" value="" required><a href="#" id="' + random + '" onclick="deleteTask(this.id)">מחק</a><br>'
    newDiv.innerHTML = string; 
    addTaskLocation.appendChild(newDiv);
};// end function
