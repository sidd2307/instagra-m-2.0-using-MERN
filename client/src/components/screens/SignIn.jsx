import React, { useState, useContext } from "react";

// context imports
import { UserContext } from "../../App";

// packages
import { Link, useNavigate } from "react-router-dom";

// designs
import M from "materialize-css";

export default function SignIn() {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const postData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email!", classes: "#ff5252 red accent-2" });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#ff5252 red accent-2" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: data.message, classes: "#00c853 green accent-4" });
          navigate("/");
        }
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2 className="brand-logo">Instagram</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken"
          onClick={() => postData()}
        >
          Sign In
        </button>
        <h5>
          <Link to="/signup">Don't have an account?</Link>
        </h5>
      </div>
    </div>
  );
}
