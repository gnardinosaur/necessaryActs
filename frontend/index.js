const loginForm = document.querySelector("#login_form")
loginForm.addEventListener("submit", function(e){
    e.preventDefault();
    fetch("http://localhost:3000/api/v1/users")
        .then(resp => resp.json())
        .then(data => console.log(data))
})