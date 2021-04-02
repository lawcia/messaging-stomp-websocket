let stompClient = null;

const setConnected = (connected) => {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

const connect = () => {
    const socket = new SockJS("/gs-guide-websocket");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        setConnected(true);
        console.log("Connected: " + frame);
        stompClient
            .subscribe("/topic/greetings", (greeting) => {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });
}

const disconnect = () => {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

const sendName = () => {
    stompClient
        .send("/app/hello", {}, JSON.stringify(
            {"name": $("#name").val()})
        );
}

const showGreeting = (message) => {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(() => {
    $("form").on("submit", (e) => {
        e.preventDefault();
    });
    $("#connect").click(() => {
        connect();
    });
    $("#disconnect").click(() => {
        disconnect();
    });
    $("#send").click(() => {
        sendName();
    })
});
