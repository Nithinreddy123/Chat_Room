import React from "react";
import "./css/HomeContainer.css";
import send_message from "./images/send_message.svg";
import { v4 as uuid } from "uuid";
import avatar from "./images/avatar.jfif";

class Success extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      current_message: "",
      latest: "",
    };
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    this.soc_conn = new WebSocket(
      `ws://3.7.22.217/api/${this.props.room_name}/${this.props.user}`
    );
    this.soc_conn.onopen = () => {
      console.log("connection initiated");
    };
    this.soc_conn.onmessage = (message) => {
      const data = JSON.parse(message.data);
      this.isLatest = false;

      if (data.type === "history") {
        data.msgs.map((item) => {
          if (item.type === "notice") {
            this.setState({ latest: "" });
            this.renderNotice(item);
          } else this.temp(item);
        });
        this.setState({ latest: "" });
      } else if (data.type === "notice") {
        this.setState({ latest: "" });
        this.renderNotice(data);
      } else {
        this.temp(data);
      }
    };
  }

  temp = (data) => {
    if (data.name === this.state.latest) this.isLatest = true;
    else this.isLatest = false;
    if (data.name === this.props.user) this.updateUserMessage(data, true);
    else this.renderOthersMessages(data, this.isLatest);
    this.setState({ latest: data.name });
  };

  renderNotice = (msg) => {
    let notice_to_render = (
      <div key={uuid()} style={{ width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: "10px", color: "green" }}>
          {msg.user == this.props.user
            ? "you " + msg.context + " conversation"
            : msg.user + " " + msg.context + " conversation"}
        </p>
      </div>
    );
    this.setState({ messages: [...this.state.messages, notice_to_render] });
  };

  renderOthersMessages = (message, isLatest) => {
    let msg_to_render = (
      <div key={uuid()} className="chat-message bot-mode">
        <div className="chat-bot-message-box">
          {isLatest ? (
            <span style={{ marginRight: "20px" }}></span>
          ) : (
            <img
              src={avatar}
              style={{ width: "20px", height: "20px", display: "inline-block" }}
              alt=""
            />
          )}

          <div className="chat-bot-message">
            <div align="left">
              <p
                style={{
                  fontSize: "11px",
                  margin: "0",
                  color: "green",
                  marginBottom: "3px",
                }}
              >
                {isLatest ? "" : message.name}
              </p>
            </div>
            <div style={{ overflowWrap: "break-word" }}>{message.msg}</div>
            <div align="right">
              <span className="chat-bot-message-time">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );

    this.setState({ messages: [...this.state.messages, msg_to_render] });
  };

  updateUserMessage = (data, isHistory = false) => {
    let user_render_msg = (
      <div key={uuid()} className="chat-message">
        <div className="chat-user-message">
          <div style={{ overflowWrap: "break-word" }}>
            {isHistory ? data.msg : this.state.current_message}
          </div>
          <div align="right">
            <span className="chat-bot-message-time">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    );
    this.setState({ messages: [...this.state.messages, user_render_msg] });
  };

  sendMsg = () => {
    if (this.state.current_message !== "") {
      this.updateUserMessage();
      this.payload = { name: this.props.user, msg: this.state.current_message };
      this.soc_conn.send(JSON.stringify(this.payload));
      this.setState({ current_message: "", latest: "" });
    }
  };
  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.sendMsg();
    }
  };
  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }
  render() {
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <div className="chat-window">
          <div className="chat-box">
            <div className="chat-header">
              <div style={{ display: "flex", width: "100%" }}>
                <div
                  style={{ paddingTop: 17, paddingLeft: 7, margin: "0 auto" }}
                >
                  <small style={{ fontSize: 14 }}>
                    Room : {this.props.room_name}
                  </small>
                </div>
                <small
                  style={{ fontSize: 14, float: "right", margin: "auto 0" }}
                >
                  User : {this.props.user}
                </small>
              </div>
            </div>
            <div className="chat-body" id="chat-body">
              {this.state.messages}
              <div
                ref={(el) => {
                  this.el = el;
                }}
              />
            </div>
            <div className="chat-footer">
              <div className="footer-contents">
                <input
                  style={{ padding: 3 }}
                  autoComplete="off"
                  className="chat-input"
                  placeholder="Enter your message"
                  value={this.state.current_message}
                  name="current_message"
                  onKeyDown={(e) => this._handleKeyDown(e)}
                  onChange={(e) =>
                    this.setState({ current_message: e.target.value })
                  }
                />
              </div>

              <div
                className="footer-send-message"
                onClick={(e) => this.sendMsg()}
              >
                <img src={send_message} alt="send" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Success;
