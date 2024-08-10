/*  Daniel Namir
    This is the algorithm code for adding a user and adding an item to the database    
*/

//this function adds a new user to the database
function addUser() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
        } else { alert('Response failure: ' + Response.status); }
        }
    }

    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    newObject = newObject = { 'username': username, 'password': password }
    dataString = JSON.stringify(newObject);

    let url = '/add/user/';
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-type', 'application/json');
    httpRequest.send(dataString);
}

//this function adds a new item to the database
function addItem() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
        } else { alert('Response failure: ' + Response.status); }
        }
    }

    title = document.getElementById('title').value;
    description = document.getElementById('description').value;
    image = document.getElementById('image').value;
    price = document.getElementById('price').value;
    stat = document.getElementById('status').value;
    user = document.getElementById('seller').value;

    newObject = {
        'title': title,
        'description': description,
        'image': image,
        'price': price,
        'stat': stat,
    }
    dataString = JSON.stringify(newObject);

    let url = `add/item/${user}`;

    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-type', 'application/json');
    httpRequest.send(dataString);
}

//this function clears the database
function clearDB() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let body = document.getElementsByTagName('body');
            body.innerHTML = httpRequest.responseText;
            body.scrollTop = body.scrollHeight;
        } else { alert('Response failure: ' + Response.status); }
        }
    }

    let url = '/clear';
    httpRequest.open('GET', url);
    httpRequest.send();
}