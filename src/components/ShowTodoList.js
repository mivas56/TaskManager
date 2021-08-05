import React from "react";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import "./ShowTodoList.css";
import { Link } from "react-router-dom";

import title1 from "./imgs/title1.png";
import title2 from "./imgs/title2.png";
import title3 from "./imgs/title3.png";
import title4 from "./imgs/title4.png";
import title5 from "./imgs/title5.png";

import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";

import SingleTask from "./SingleTask";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function ShowTodoList(props) {
  const user = useSelector(selectUser);
  const ListId = props.location.state.id;
  const dbTitleBg = props.location.state.dbTitleBg;
  const ListName = props.location.state.listName;
  const taskCollectionRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("taskList")
    .doc(ListId)
    .collection("tasks");

  const listRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("taskList")
    .doc(ListId);

  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  const [showMarker, setShowMarker] = useState(false);
  const [titleBg, setTitleBg] = useState();

  useEffect(() => {
    if (dbTitleBg === "bg1") {
      setTitleBg(title1);
    }
    if (dbTitleBg === "bg2") {
      setTitleBg(title2);
    }
    if (dbTitleBg === "bg3") {
      setTitleBg(title3);
    }
    if (dbTitleBg === "bg4") {
      setTitleBg(title4);
    }
    if (dbTitleBg === "bg5") {
      setTitleBg(title5);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    taskCollectionRef.orderBy("index", "asc").onSnapshot((snapshot) =>
      setList(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      isMounted = false;
    };
  }, [user]);

  const addTask = (e) => {
    e.preventDefault();
    taskCollectionRef.add({
      taskName: input,
      finished: false,
      index: "",
      color: "",
    });
    setInput("");
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
  }

  const setAllIndexes = () => {
    list.forEach(({ id }, index) =>
      taskCollectionRef.doc(id).update({
        index: index,
      })
    );
  };

  const showMarkers = (e) => {
    e.preventDefault();
    setShowMarker(!showMarker);
  };

  const renderMarkers = () => {
    return (
      <div className="titleImgContainer">
        <img
          src={title1}
          alt=""
          onClick={() => {
            setTitleBg(title1);
            listRef.update({
              titleBg: "bg1",
            });
            props.location.state.dbTitleBg = "bg1";
          }}
        />
        <img
          src={title2}
          alt=""
          onClick={() => {
            setTitleBg(title2);
            listRef.update({
              titleBg: "bg2",
            });
            props.location.state.dbTitleBg = "bg2";
          }}
        />
        <img
          src={title3}
          alt=""
          onClick={() => {
            setTitleBg(title3);
            listRef.update({
              titleBg: "bg3",
            });
            props.location.state.dbTitleBg = "bg3";
          }}
        />
        <img
          src={title4}
          alt=""
          onClick={() => {
            setTitleBg(title4);
            listRef.update({
              titleBg: "bg4",
            });
            props.location.state.dbTitleBg = "bg4";
          }}
        />
        <img
          src={title5}
          alt=""
          onClick={() => {
            setTitleBg(title5);
            listRef.update({
              titleBg: "bg5",
            });
            props.location.state.dbTitleBg = "bg5";
          }}
        />
      </div>
    );
  };

  return (
    <div className="listContainer">
      <div
        className="titleContainer"
        style={{
          backgroundSize: "140px",
          backgroundImage: `url(${titleBg})`,
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
        }}
      >
        <h1 className="listTitle" onClick={showMarkers}>
          {ListName}
        </h1>
        {showMarker ? renderMarkers() : <div></div>}
      </div>

      <div className="navBtns">
        <button
          style={{
            backgroundColor: "#c2c2c2",
            borderRadius: "30px",
            border: "none",
            marginRight: "5px",
          }}
        >
          <Link to="/">
            <ArrowBackIosIcon
              style={{
                color: "rgb(53, 53, 53)",
                fontSize: "25px",
                paddingLeft: "10px",
              }}
            />
          </Link>
        </button>
        <form className="formContainer">
          <input
            className="taskInput"
            placeholder="ADD TASK"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
          />
          <button className="addBtn" onClick={addTask} type="submit">
            +
          </button>
        </form>
        <button
          style={{
            marginLeft: "5px",
            backgroundColor: "#c2c2c2",
            borderRadius: "30px",
            border: "none",
            padding: "0 8px 0 8px",
          }}
          onClick={setAllIndexes}
        >
          <SaveRoundedIcon
            style={{
              color: "rgb(53, 53, 53)",
              fontSize: "30px",
            }}
          />
        </button>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <div
              className="taskList"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {list.map(
                ({ id, data: { taskName, finished, color } }, index) => (
                  <Draggable
                    style={{ border: "solid 1px black" }}
                    key={id}
                    draggableId={id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <SingleTask
                          dbcolor={color}
                          index={index}
                          id={id}
                          taskName={taskName}
                          finished={finished}
                          ListId={ListId}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default ShowTodoList;
