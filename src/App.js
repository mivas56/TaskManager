import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import Feed from "./components/Feed";
import { login, logout, selectUser } from "./features/userSlice";
import Header from "./components/Header";
import Login from "./components/Login";
import ShowTodoList from "./components/ShowTodoList";
import { useEffect } from "react";
import { auth } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        // user is logged in
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoUrl: userAuth.photoURL,
          })
        );
      } else {
        // user is logged out
        dispatch(logout());
      }
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            {!user ? (
              <Login />
            ) : (
              <div>
                <Header /> <Feed />
              </div>
            )}
          </Route>
          <Route path="/taskList:todoListName" component={ShowTodoList} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
