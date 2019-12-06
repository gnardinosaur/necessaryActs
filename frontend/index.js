const loginForm = document.querySelector("#login_form");
const main = document.querySelector("#main");


let modal;
let newEventForm;
let eventList;
let modalContent;
let toggleButton;
let userObject;
//let newEventObjects = {}; was using for adding multiple events to calendar w/o refersh -- not needed if you're just adding 1 event w/o refersh 
let viewToggle = true;
let bg = document.body;

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
            bg.style.backgroundImage = "none"
            userObject = user;
            showUserListView(user);
            eventList = document.getElementById("events");
            newEventForm = document.querySelector("#new_event");
            newEventFormListener(user);
            eventListModalListener();
            toggleButtonListener();
        })
})

//HTML to render user list view 
function showUserListView(user) {
    let listViewHTML = 
        `<div class="sidenav">
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
                    <input type="button" id="toggle_button" value="Calendar View">
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
                
                eventList.innerHTML += liHTML;
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
            .then(function(newEvent) {
                
                if (viewToggle) {
                    let now = Date.now();
                    let d = new Date(start);
                    let distance = d - now;

                    let liHTML =
                        `<li id=${newEvent.id}>
                            <h5> You have <span id="countdown">${convertMS(distance)}</span> until your event</h5>
                            <h4>${newEvent.title}<h4>
                            <input class="edit_button" type="button" value="Edit Event">
                            <input class="delete_button" type="button" value="Delete Event">
                        </li>`;
                    //right now newEvent is added to end of event list - figure out how to inject and render as sorted list 
                    eventList.innerHTML += liHTML;

                    newEventForm.reset();
                } else {
                    //add event to calendar
                    let newestEvent = {
                        title: newEvent.title,
                        start: newEvent.start_time,
                        end: newEvent.end_time
                    };
                    calendarView(userObject, newestEvent);
                    newEventForm.reset();
                }
            })
    })
}

function eventListModalListener() {
    eventList.addEventListener("click", function(e){
        if (e.target.className === "edit_button") {
            editEventModal(e.target.closest("li"));
        } else if (e.target.className === "delete_button") {
            deleteEventModal(e.target.closest("li"));
        }
    })
}

function editEventModal(listItem) {
    document.getElementById("my_modal").style.display = "block";
    
    fetch(`http://localhost:3000/api/v1/events/${listItem.id}`)
        .then(resp => resp.json())
        .then(function(event){
            let start = event.start_time.substring(0, 16);
            let end = event.end_time.substring(0, 16)
            let formToEdit =    
                `<form id="edit_event">
                    <span class="close">&times;</span>
                    <label>Event Title</label><br />
                    <input type="text" id="edit_title" value="${event.title}"><br />

                    <label>Event Description</label><br />
                    <textarea id="edit_content">${event.content}</textarea><br />

                    <label>Start Time</label><br />
                    <input type="datetime-local" id="edit_start" value="${start}"><br />
                    
                    <label>End Time</label><br />
                    <input type="datetime-local" id="edit_end" value="${end}"><br />

                    <input type="submit" class="edit_button" value="Edit Event">
                </form>`
            modalContent = document.querySelector(".modal_content");
            modalContent.innerHTML = formToEdit;    
            editEventModalListeners(parseInt(listItem.id));
        })       
}

function editEventModalListeners(itemId) {
    let closeButton = document.querySelector(".close");
    let editForm = document.querySelector("#edit_event")

    closeButton.addEventListener("click", function(e) {
        document.getElementById("my_modal").style.display = "none";
    })
    
    editForm.addEventListener("submit", function(e) {
        e.preventDefault();
        let title = document.querySelector("#edit_title").value;
        let content = document.querySelector("#edit_content").value;
        let start = document.querySelector("#edit_start").value;
        let end = document.querySelector("#edit_end").value;
        
        fetch(`http://localhost:3000/api/v1/events/${itemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ 
                "title": `${title}`,
                "content": `${content}`,
                "start": `${start}`,
                "end": `${end}`,
            })
        })
            .then(resp => resp.json())
            .then(function(event){
                document.getElementById("my_modal").style.display = "none";
                let updatedEventTitle = document.getElementById(`${event.id}`).querySelector("h4");
                let newHeader = `<h4>${event.title}</h4>`;
                updatedEventTitle.innerHTML = newHeader;
            })
    })    
}

function deleteEventModal(listItem) {
    document.getElementById("my_modal").style.display = "block";
    let eventTitle = document.getElementById(`${listItem.id}`).querySelector("h4").innerText;
    modalContent = document.querySelector(".modal_content");
    modalContent.innerHTML = 
        `<div id="delete_content"> Are you sure you want to delete <span>${eventTitle}</span>?!</div> 
        <input class="delete_button" type="button" value="Yes Delete!">
        <input class="no_button" type="button" value="NOOOO!">`;
    deleteEventModalListeners(parseInt(listItem.id));
}

function deleteEventModalListeners(eventId) {
    modalContent.addEventListener("click", function(e) {
        if (e.target.className === "delete_button") {
            deleteEvent(eventId);
        } else if (e.target.className === "no_button") {
            document.getElementById("my_modal").style.display = "none";
        }
    })
}
  
function deleteEvent(eventId) {
    fetch(`http://localhost:3000/api/v1/events/${eventId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ "id": `${eventId}`})
    })
    document.getElementById("my_modal").style.display = "none";
    document.getElementById(`${eventId}`).remove();
}

function toggleButtonListener() {
    document.addEventListener("click", function(e) {
        if (e.target.id === "toggle_button") {
            viewToggle = !viewToggle;
            let cal;
            if (viewToggle === true) {
                cal = document.querySelector("#calendar_div");
                cal.style.display = "none";
                showUserListView(userObject);
                eventList = document.getElementById("events");
                eventListModalListener();
            } else {
                calendarView(userObject);
            }
        }
    })
}

function calendarView(userObject, newestEvent = {}) {
    let existingEvents = userObject.events.map(function(event){
        return {
            title: event.title,
            start: event.start_time,
            end: event.end_time
        }
    });
    existingEvents.push(newestEvent)
    eventList.innerHTML = 
    `<div id="calendar_div">
        <input type="button" id="toggle_button" value="List View">
    </div>`;
    
    let calendarEl = document.getElementById("calendar_div");
    let calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'dayGrid' ],
        defaultView: 'dayGridMonth',
        timeZone: 'UTC',
        events: existingEvents
    });
    calendar.render();
}


            


