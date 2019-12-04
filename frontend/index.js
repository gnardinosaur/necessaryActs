const loginForm = document.querySelector("#login_form");
const main = document.querySelector("#main");

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
            <h4>Create A New Event</h4>
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
            <h3>${user.name}'s Necessary Acts</h3>
                <ul id="events">
                </ul>
        </div>`

    main.innerHTML = listViewHTML;
    getEvents(user);
}

function getEvents(user) {
    fetch(`http://localhost:3000/api/v1/users/${user.id}/events`)
        .then(resp => resp.json())
        .then(function(events) {
            events.forEach(function(el){
                let liHTML = `<li>${el.title}</li>`;    
                eventList.innerHTML += liHTML;
            })
        })
}

//using and calling a function b/c we can't add a listener on something that doesn't exist yet 
function newEventFormListener(user) {
    newEventForm.addEventListener("submit", function(e){
        e.preventDefault();
        let title = document.querySelector("#title").value;
        let content = document.querySelector("#content").value;
        let start = document.querySelector("#start").value;
        let end = document.querySelector("#end").value;
        //first, create new Event 
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
            })
        })
            .then(resp => resp.json())
            .then(function(newEvent){
                let liHTML = `<li>${newEvent.title}</li>`;    
                eventList.innerHTML += liHTML;
            })
        //second, POST fetch() to /user_events to create a new UserEvent with event_id and user_id
    })
}