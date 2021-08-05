import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import { auth, db } from "../firebase";
import logo from "./imgs/logo.png";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const loginToApp = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((userAuth) => {
        dispatch(
          login({
            email: userAuth,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
          })
        );
      })
      .catch((error) => alert(error));
  };

  const register = () => {
    if (!name) {
      return alert("Please enter a full name!");
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userAuth) => {
        userAuth.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            dispatch(
              login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                displayName: name,
              })
            );
          })
          .then(() => {
            db.collection("users").doc(userAuth.user.uid).set({
              name: name,
            });
          });
      })
      .catch((error) => alert(error));
  };

  return (
    <div>
      <img
        style={{
          marginTop: "5vh",
          marginBottom: "5vh",
          width: "274px",
          height: "100px",
        }}
        src={logo}
        alt=""
      />
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          alignItems: "center",
        }}
      >
        <input
          className="loginInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your name"
          type="text"
        />
        <input
          className="loginInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          type="email"
        />

        <input
          className="loginInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password"
          type="password"
        />
        <button className="loginBtn" type="submit" onClick={loginToApp}>
          Sign In
        </button>
      </form>
      <p
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Not a member?
        <button className="registerBtn" onClick={register}>
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;
