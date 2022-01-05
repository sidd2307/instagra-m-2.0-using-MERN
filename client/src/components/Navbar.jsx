import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// context
import { UserContext } from "../App";

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  // conditional links
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/create">Create Post</Link>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/myfollowingposts">My following Posts</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #f44336 red"
            style={{ marginRight: "8px" }}
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/signin");
            }}
          >
            Sign Out
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Sign In</Link>
        </li>,
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white customNavbar">
        <Link
          to={state ? "/" : "/signin"}
          className="brand-logo"
          style={{ marginLeft: "10px", fontSize: "40px" }}
        >
          Instagram
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
}
