import React from "react";
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import "./SingleTask.css";
import pink from "./imgs/pink.png";
import green from "./imgs/green.png";
import salmon from "./imgs/salmon.png";
import yellow from "./imgs/yellow.png";
import trashicon from "./imgs/trashcan.png";
import penIcon from "./imgs/penIcon.png";
import unactivePen from "./imgs/unactivePen.png";
import markerIcon from "./imgs/markerIcon.png";

function SingleTask({ id, taskName, finished, ListId, index, dbcolor }) {
  const node = useRef();

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setShowButtons(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  let i = index;
  const user = useSelector(selectUser);
  const taskCollectionRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("taskList")
    .doc(ListId)
    .collection("tasks");

  const [editInput, setEditInput] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [color, setColor] = useState();
  const [check, setCheck] = useState();
  const [penIc, setPenIc] = useState(true);
  useEffect(() => {
    let isMounted = true;
    // First Load / refresh page setting default view
    if (finished === true) {
      setCheck(true);
    }
    if (finished === false) {
      setCheck(false);
    }
    if (dbcolor === "") {
      setColor("");
    }
    if (dbcolor === "green") {
      setColor(green);
    }
    if (dbcolor === "pink") {
      setColor(pink);
    }
    if (dbcolor === "salmon") {
      setColor(salmon);
    }
    if (dbcolor === "yellow") {
      setColor(yellow);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const showEditFunc = (e) => {
    e.preventDefault();
    setPenIc(false);
    setShowEdit(!showEdit);
  };

  const submitFunc = (e) => {
    e.preventDefault();
    if (!editInput) {
      alert("Please change text in the edit input or cancel edit");
    } else {
      taskCollectionRef.doc(id).update({
        taskName: editInput,
        finished: false,
      });
      setShowEdit(false);
      setCheck(false);
      setPenIc(true);
    }
  };

  const checkFunc = (e) => {
    taskCollectionRef.doc(id).update({
      finished: !finished,
    });
    setCheck(true);
  };

  const deleteFunc = (e) => {
    e.preventDefault();
    taskCollectionRef.doc(id).delete();
  };

  const showMarkers = (e) => {
    e.preventDefault();
    setShowMarker(!showMarker);
  };

  useEffect(() => {
    taskCollectionRef.doc(id).update({
      index: i,
    });
  }, []);

  const renderMarkers = () => {
    return (
      <div className="colorContainer">
        <button
          className="colorBtnPink"
          onClick={() => {
            setColor(pink);
            taskCollectionRef.doc(id).update({
              color: "pink",
            });
          }}
        ></button>
        <button
          className="colorBtnGreen"
          onClick={() => {
            setColor(green);
            taskCollectionRef.doc(id).update({
              color: "green",
            });
          }}
        ></button>
        <button
          className="colorBtnYellow"
          onClick={() => {
            setColor(yellow);
            taskCollectionRef.doc(id).update({
              color: "yellow",
            });
          }}
        ></button>
        <button
          className="colorBtnSalmon"
          onClick={() => {
            setColor(salmon);
            taskCollectionRef.doc(id).update({
              color: "salmon",
            });
          }}
        ></button>
        <button
          className="colorBtnWhite"
          onClick={() => {
            setColor("");
            taskCollectionRef.doc(id).update({
              color: "",
            });
          }}
        ></button>
        <button className="colorBtnX" onClick={showMarkers}>
          X
        </button>
      </div>
    );
  };

  const renderEditView = () => {
    return (
      <form className="taskNameEditContainer">
        <input
          className="taskNameEditInput"
          style={{ width: taskName.length * 13 + "px" }}
          defaultValue={taskName}
          onChange={(e) => setEditInput(e.target.value)}
          type="text"
          autoFocus={true}
          onKeyPress={(e) => {
            e.target.style.width = (e.target.value.length + 1) * 12 + "px";
          }}
        />
        <button
          className="taskNameEditBtnOk"
          type="submit"
          onClick={submitFunc}
        >
          &#10004;
        </button>
        <button
          type="button"
          className="taskNameEditBtnX"
          onClick={() => {
            setShowEdit(false);
            setPenIc(true);
          }}
        >
          X
        </button>
      </form>
    );
  };

  return (
    <div className="singleTask" key={id} ref={node}>
      <input
        type="checkbox"
        id={id}
        onClick={checkFunc}
        defaultChecked={check}
      />
      <label htmlFor={id}></label>
      <div
        className="marker"
        style={{
          marginLeft: "5px",
          paddingLeft: "6px",
          paddingRight: "6px",
          backgroundImage: `url(${color})`,
        }}
      >
        <div
          onClick={(e) => setShowButtons(!showButtons)}
          className="taskName"
          style={finished ? { textDecoration: "line-through" } : {}}
        >
          {showEdit ? renderEditView() : taskName}
        </div>
      </div>
      {showButtons ? (
        <div className="btnContainer">
          {penIc ? (
            <img
              className="button"
              src={penIcon}
              alt=""
              onClick={showEditFunc}
            />
          ) : (
            <img className="button" src={unactivePen} alt="" />
          )}

          {showMarker ? (
            renderMarkers()
          ) : (
            <img
              className="button"
              src={markerIcon}
              alt=""
              onClick={showMarkers}
            />
          )}

          <img className="button" src={trashicon} alt="" onClick={deleteFunc} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default SingleTask;
