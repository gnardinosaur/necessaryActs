const loginForm = document.querySelector("#login_form");
const main = document.querySelector("#main");
const eventList = document.getElementById("events");

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
            <form>
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
                    ${getEvents(user)}
                </ul>
        </div>`

    main.innerHTML = listViewHTML;
}

function getEvents(user) {
    fetch("http://localhost:3000/api/v1/user_events")
        .then(resp => resp.json())
        .then(function(arrUserEvents){
            arrUserEvents.forEach(function(userEvent){
                if (userEvent.user_id === user.id) {
                    let liHTML = `<li>${user.events[0].content}</li>`;
                    eventList.innerHTML += liHTML;
                }
            })
        })
}
