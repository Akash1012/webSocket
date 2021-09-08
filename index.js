import ReactDOM from "react-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { Component } from "react";
import { Card, Avatar, Input, Typography } from "antd";

import "antd/dist/antd.css";
import "./index.css";

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

//creating connect
const client = new W3CWebSocket("ws://127.0.0.1:8000");

const App = () => {
  const [userName, setuserName] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [message, setMessage] = React.useState([]);
  const [searchVal, setsearchVal] = React.useState("");

  React.useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("got reply! ", dataFromServer);
      if (dataFromServer.type === "message") {
        setMessage((messages) => [...messages, dataFromServer]);
      }
    };
  }, []);

  console.log("adada", message);

  const onButtonClicked = (value) => {
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: userName,
      })
    );
    setsearchVal("");
  };
  return (
    <div className="main">
      {isLoggedIn ? (
        <div>
          <div className="title">
            <Text
              id="main-heading"
              type="secondary"
              style={{ fontSize: "36px" }}
            >
              Websocket Chat: {userName}
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: 50,
            }}
            id="messages"
          >
            {message.map((message) => (
              <Card
                key={message.msg}
                style={{
                  width: 300,
                  margin: "16px 4px 0 4px",
                  alignSelf:
                    userName === message.user ? "flex-end" : "flex-start",
                }}
                loading={false}
              >
                <Meta
                  avatar={
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                    >
                      {message.user[0].toUpperCase()}
                    </Avatar>
                  }
                  title={message.user + ":"}
                  description={message.msg}
                />
              </Card>
            ))}
          </div>

          <div className="bottom">
            <Search
              placeholder="input message and send"
              enterButton="Send"
              value={searchVal}
              size="large"
              onChange={(e) => setsearchVal(e.target.value)}
              onSearch={(value) => onButtonClicked(value)}
            />
          </div>
        </div>
      ) : (
        <div style={{ padding: "200px 40px" }}>
          <Search
            placeholder="Enter Username"
            enterButton="Login"
            size="large"
            onSearch={(value) => {
              setIsLoggedIn(true);
              setuserName(value);
            }}
          />
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
