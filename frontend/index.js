const loginForm = document.querySelector("#login_form");
const main = document.querySelector("#main");

let newEventForm;
let eventList;

// listener for login_form submit
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

// HTML to render user list view 
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
                <textarea id="description"></textarea><br />
                
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
    getUserEventsForUser(user);
}

function getUserEventsForUser(user) {
    fetch("http://localhost:3000/api/v1/user_events")
        .then(resp => resp.json())
        .then(function(allUserEvents) {
            let userEvents = allUserEvents.filter(function(userEvent) {
                return userEvent.user_id === user.id
            })
            let events = userEvents.map(function(el){
                return el.event_id
            })
            displayUserEvents(events);
        })
}

function displayUserEvents(events) {
    events.forEach(function(el){
        fetch(`http://localhost:3000/api/v1/events/${el}`)
            .then(resp => resp.json())
            .then(function(event){
                let liHTML = `<li>${event.title}</li>`;
                eventList.innerHTML += liHTML;
            })
    })
}

// can't add a listener on something that doesn't exist yet 
function newEventFormListener(user) {
    newEventForm.addEventListener("submit", function(e){
        e.preventDefault();
        let title = document.querySelector("#title").value;
        let description = document.querySelector("#description").value;
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
                "description": `${description}`,
                "start": `${start}`,
                "end": `${end}`,
            })
        })
        //second, POST fetch() to /user_events to create a new UserEvent with event_id and user_id
    })
}