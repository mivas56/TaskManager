import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import firebase from "firebase";
import { selectUser } from "../features/userSlice";
import { Link } from "react-router-dom";

function Feed() {
  const user = useSelector(selectUser);

  const [listInput, setListInput] = useState("");
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      db.collection("users")
        .doc(user.uid)
        .collection("taskList")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setTodoList(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const createList = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).collection("taskList").add({
      todoListName: listInput,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      titleBg: "",
    });
    setListInput("");
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <div className="navBtns">
        <form className="formContainer">
          <input
            className="taskInput"
            placeholder="Create list"
            value={listInput}
            onChange={(e) => setListInput(e.target.value)}
            type="text"
          />
          <button className="addBtn" onClick={createList}>
            +
          </button>
        </form>
      </div>

      <div>
        {todoList.map(({ id, data: { todoListName, titleBg } }) => (
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "30px",
              marginRight: "30px",
            }}
            key={id}
          >
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={{
                pathname: `/taskList${todoListName}`,
                state: { id: id, listName: todoListName, dbTitleBg: titleBg },
              }}
            >
              <h1
                style={{
                  fontFamily: "Ribeye",
                  textTransform: "capitalize",
                  width: "200px",
                }}
              >
                {todoListName}
              </h1>
            </Link>
            <button
              style={{
                fontFamily: "Architects Daughter",
                backgroundColor: "#ffa494",
                height: "30px",
                width: "30px",
                color: "rgb(53, 53, 53)",
                borderRadius: "50px",
                border: "0px",
                padding: "6px 10px 6px 10px",
                marginLeft: "15px",
              }}
              onClick={(e) => {
                e.preventDefault();
                db.collection("users")
                  .doc(user.uid)
                  .collection("taskList")
                  .doc(id)
                  .delete();
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
