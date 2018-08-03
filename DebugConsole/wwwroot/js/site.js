﻿$(document).ready(() => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/hub")
        .build();

    connection.on("ReceiveMessage", (user, message) => {
        const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const encodedMsg = user + " says " + msg;
        const li = document.createElement("li");
        li.textContent = encodedMsg;
        document.getElementById("messagesList").appendChild(li);
    });

    connection.start().catch(err => console.error(err.toString()));

    document.getElementById("sendButton").addEventListener("click", event => {
        const user = document.getElementById("userInput").value;
        const message = document.getElementById("messageInput").value;
        connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
        event.preventDefault();
    });

    $('#start').click((event) => {
        connection.invoke("Start").catch(err => console.error(err.toString()));
        event.preventDefault();
    });

    $('#stop').click((event) => {
        connection.invoke("Stop").catch(err => console.error(err.toString()));
        event.preventDefault();
    });

    var v = {
        author: "hh",
        statuses: [
            {
                name: "1",
                blocks: [
                    {
                        height: 2,
                        hash: "00000944266FC1E0D9C294F1130645E0052209811470B08128D96195790C24C0",
                    },]
            },
            {
                name: "2",
                blocks: [
                    {
                        height: 2,
                        hash: "abcdefghijklmnopqrstuvabcdefghijklmnopqrstuv",
                    },
                    {
                        height: 3,
                        hash: "abcdefghijklmnopqrstuvabcdefghijklmnopqrstuv",
                    },
                ]
            },
        ]
    };
    //var html =$.templates("#statusTemplate").render(v);
    //$(html).appendTo("#template-container");

    var app = new Vue({
        el: '#app',
        data: v,
        methods: {
            start: function () {
                connection.invoke("Start").catch(err => console.error(err.toString()));
            },
            stop: function () {
                connection.invoke("Stop").catch(err => console.error(err.toString()));
            },
        },
    });

    setTimeout(() => { app.data = {} }, 1000);

    connection.on("Update", (data) => {
        //var html = $.templates("#statusTemplate").render(data);
        //$(html).appendTo("#template-container");
        console.log("received", data);
        Object.assign(app, data);
        //app.data = data;
    });
});

