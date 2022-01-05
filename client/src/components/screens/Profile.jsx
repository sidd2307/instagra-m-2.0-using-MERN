import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../App";

// designs
import M from "materialize-css";

export default function Profile() {
  const [posts, setPosts] = useState([]);

  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.myposts);
        setPosts(result.myposts);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-by-sid");
      data.append("cloud_name", "instagrambysid");
      fetch("http://api.cloudinary.com/v1_1/instagrambysid/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUrl(data.url);
          // localStorage.setItem(
          //   "user",
          //   JSON.stringify({ ...state, pic: data.url })
          // );
          // dispatch({ type: "UPDATEPIC", payload: data.url });
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              M.toast({
                html: "Profile Picture updated successfully!",
                classes: "#00c853 green accent-4",
              });
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              // window.location.reload();
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div className="" style={{ maxWidth: "880px", margin: "0px auto" }}>
      <div
        className=""
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          className=""
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div className="">
            <img
              src={state ? state.pic : "loading"}
              alt=""
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            />
          </div>
          <div className="">
            <h4>{state ? state.name : "loading"}</h4>
            <h5>{state ? state.email : "loading"}</h5>
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{posts.length} Posts</h6>
              <h6>{state ? state.followers.length : 0} Followers</h6>
              <h6>{state ? state.following.length : 0} Following</h6>
            </div>
          </div>
        </div>
        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn waves-effect waves-light #64b5f6 blue darken">
            <span>Update Image</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {posts.map((post) => {
          return <img key={post._id} className="item" src={post.pic} />;
        })}
      </div>
    </div>
  );
}
