var socketPage = {};

socketPage.fn = {};

socketPage.services = {

    socketUrl: {
        URL: location.protocol + "//" + location.hostname + ":1111/chat"
    }

};

socketPage.vars = {};
socketPage.vars.typingTimer = null;
socketPage.vars.username = '';
socketPage.vars.defSentence = [
    "Hi, Welcome to our company, we are here to assist you. Please contact us on: test@test.com",
    "Hi, we are here to assist you Please contact us on: test@test.com",
    "Hi, are you having a problem? Please contact us on: test@test.com"
]

var socket = io.connect(socketPage.services.socketUrl.URL);

$("#messageText").focus();

socketPage.fn.startPage = function () {

    socketPage.vars.username = socketPage.fn.getUser();
    // Set name for user
    $("#username").text(socketPage.vars.username);

    // Tooltip config
    $('.tooltipped').tooltip();

    // User send message
    $("#messageText").keyup(function(e) {
        socket.emit("userTyping", {
            "sessionId": socket.id,
            "username": socketPage.vars.username
        });
        clearTimeout(socketPage.vars.typingTimer);
        socketPage.fn.typingTimer = setTimeout(function() {
            socket.emit("userStopTyping", {
                "sessionId": socket.id,
                "username": socketPage.vars.username
            });
        }, 1000);

        if(e.keyCode == 13 && $("#messageText").val().trim() != "") {
            socket.emit("userStopTyping", {
                "sessionId": socket.id,
                "username": socketPage.vars.username
            });
            socketPage.fn.displayMyMessage($("#messageText").val());
            socket.emit("sendMessage", {
                "message": $("#messageText").val(),
                "user": {
                    "sessionId": socket.id,
                    "username": socketPage.vars.username
                }
            });
            $("#messageText").val("");

        }
    });
}

socketPage.fn.displayMyMessage = function (message) {
    let div = "<div class='me col s12'>";
    div +=    "   <div class='avatar tooltipped' data-position='right' data-tooltip='" + socketPage.vars.username + "'>" + socketPage.vars.username.charAt(0).toLocaleUpperCase() + "</div>";
    div +=    "   <div class='message'>" + message + "</div>";
    div +=    "</div>";

    $("#messageArea").append(div);
    $("#messageArea").scrollTop($("#messageArea").prop("scrollHeight"));
    $('.tooltipped').tooltip();

    socketPage.fn.displayMessage("Halil", socketPage.vars.defSentence[Math.floor(Math.random() * 2)]);

}

socketPage.fn.displayMessage = function (from, message) {
    let div = "<div class='incoming col s12'>";
    div +=    "   <div class='avatar tooltipped' data-position='left' data-tooltip='" + from + "'>" + from.charAt(0).toLocaleUpperCase() + "</div>";
    div +=    "   <div class='message'>" + message + "</div>";
    div +=    "</div>";

    $("#messageArea").append(div);
    $("#messageArea").scrollTop($("#messageArea").prop("scrollHeight"));
    $('.tooltipped').tooltip();
}

socketPage.fn.displayUserJoinedChat = function (name) {
    let div = "<div class='joined col s12'>" + name + " joined!</div>"
    $("#messageArea").append(div);
    $("#messageArea").scrollTop($("#messageArea").prop("scrollHeight"));
}

socketPage.fn.setCookie = function (cname,cvalue,exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

socketPage.fn.getCookie = function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

socketPage.fn.getUser = function() {
    let user = socketPage.fn.getCookie("username");
    if (user == "") {
        user = prompt("What is your name?", "");
        if (user != "" && user != null) {
            socketPage.fn.setCookie("username", user, 1);
        }
    }
    return user;
}

$(document).ready(function() {
    socketPage.fn.startPage();
});