import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { UserContext } from "../../App";

export default function UserProfile() {
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  console.log(userid);

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setUserProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        console.log(data);
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        console.log(data);
        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="" style={{ maxWidth: "880px", margin: "0px auto" }}>
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div className="">
              <img
                src={userProfile.user.pic}
                alt=""
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div className="">
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>{userProfile.user.followers.length} Followers</h6>
                <h6>{userProfile.user.following.length} Following</h6>
              </div>
              {showFollow ? (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #64b5f6 blue darken"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #64b5f6 blue darken"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((post) => {
              return <img key={post._id} className="item" src={post.pic} />;
            })}
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>Loading</h1>
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        </div>
      )}
    </>
  );
}
