const loginForm = document.querySelector("#login_form");
const main = document.querySelector("#main");

let modal;
let newEventForm;
let eventList;

//listener for login_form submit
loginForm.addEventListener("submit", function(e) {
    let username = document.querySelector("#username").value;

    e.preventDefault()
    fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ "name": `${username}` })
    })
        .then(resp => resp.json())
        .then(function(user){
            showUserListView(user);
            eventList = document.getElementById("events");
            newEventForm = document.querySelector("#new_event");
            newEventFormListener(user);
            eventListListener();
        })
})

//HTML to render user list view 
function showUserListView(user) {
    let listViewHTML = 
        `<div class="switch">
            <label class="toggle">
                <input type="checkbox" checked>
                <span class="slider round"></span>
            </label>
        </div>

        <div class="sidenav">
            <h3>Create A New Event</h3>
            <form id="new_event">
                <label>Event Title</label><br />
                <input type="text" id="title"><br />
                
                <label>Event Description</label><br />
                <textarea id="content"></textarea><br />
                
                <label>Start Time</label><br />
                <input type="datetime-local" id="start"><br />
                
                <label>End Time</label><br />
                <input type="datetime-local" id="end"><br />
                
                <input type="submit" value="Create New Event">
            </form>
        </div>
        <div class="list_body">
            <h2>${user.name}'s Necessary Acts</h2>
                <ul id="events">
                </ul>
        </div>
        
        <div id="my_modal" class="modal">
            <div class="modal_content">
            </div>
        </div>`

    main.innerHTML = listViewHTML;
    getEvents(user);
}

function getEvents(user) {
    fetch(`http://localhost:3000/api/v1/users/${user.id}/events`)
        .then(resp => resp.json())
        .then(function(events) {
            events.forEach(function(el){
                
                let now = Date.now()
                let d = new Date(el.start_time)
                let distance = d - now;   
                
                let liHTML = 
                `<li id=${el.id}>
                <h5 > You have <span id="countdown">${convertMS(distance)}</span> until your event</h5>
                <h4>${el.title}</h4>
                <input class="edit_button" type="button" value="Edit Event">
                <input class="delete_button" type="button" value="Delete Event"></input>    
                </li>`
                
                // startCountDown(d)
                eventList.innerHTML += liHTML;
                // startTimer = setInterval(function () { convertMS(distance); }, 1000);
            })
            
        })
}


function convertMS(milliseconds) {
    let day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;

    let htmlMATH = `${day} days and ${hour} hours `
    return htmlMATH
}

//using and calling a function b/c we can't add a listener on something that doesn't exist yet 
function newEventFormListener(user) {
    newEventForm.addEventListener("submit", function(e){
        e.preventDefault();
        let title = document.querySelector("#title").value;
        let content = document.querySelector("#content").value;
        let start = document.querySelector("#start").value;
        let end = document.querySelector("#end").value;
        
        fetch("http://localhost:3000/api/v1/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ 
                "title": `${title}`,
                "content": `${content}`,
                "start": `${start}`,
                "end": `${end}`,
                "user": `${user.id}`
            })
        })
            .then(resp => resp.json())
            .then(function(newEvent){

                let now = Date.now()
                let d = new Date(start)
                let distance = d - now;

                let liHTML =
                    `<li id=${newEvent.id}>
                        <h5> You have ${convertMS(distance)} until your event</h5>
                        <h4>${newEvent.title}<h4>
                        <input class="edit_button" type="button" value="Edit Event">
                        <input class="delete_button" type="button" value="Delete Event">
                    </li>`;
                eventList.innerHTML += liHTML;

                newEventForm.reset();
            })
    })
}

function eventListListener() {
    eventList.addEventListener("click", function(e){
        if (e.target.classList.contains("edit_button")) {
            editEvent(e.target.closest("li"));
        } else if (e.target.classList.contains("delete_button")) {
            deleteEvent(e.target.closest("li"));
        }
    })
}

function editEvent(listItem) {
    modal = document.getElementById("my_modal");
    modal.style.display = "block";
    
    fetch(`http://localhost:3000/api/v1/events/${listItem.id}`)
        .then(resp => resp.json())
        .then(function(event){
            // debugger
            let start = event.start_time.substring(0, 16);
            let end = event.end_time.substring(0, 16)
            let formToEdit =    
                `<form id="new_event">
                    <label>Event Title</label><br />
                    <input type="text" id="title" value="${event.title}"><br />

                    <label>Event Description</label><br />
                    <textarea id="content">${event.content}</textarea><br />

                    <label>Start Time</label><br />
                    <input type="datetime-local" id="start" value="${start}"><br />
                    
                    <label>End Time</label><br />
                    <input type="datetime-local" id="end" value="${end}"><br />

                    <input type="submit" value="Edit Event">
                </form>
                <span class="close">&times;</span>`
            let modalContent = document.querySelector(".modal_content");
            modalContent.innerHTML = formToEdit;    
        })
}



function deleteEvent(listItem) {
    modal = document.getElementById("my_modal");
    modal.style.display = "block";
}
  




