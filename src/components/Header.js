import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import { auth } from "../firebase";
import "./Header.css";
import logo from "./imgs/logo.png";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import { Link } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();

  const logoutOfApp = () => {
    dispatch(logout());
    auth.signOut();
  };

  return (
    <div className="headerContainer">
      <img style={{ width: "150px" }} src={logo} alt="" />
      <Link to="/" style={{ textDecoration: "none" }}>
        <button
          className="logBtn"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#c2c2c2",
            borderRadius: "30px",
            border: "none",
            marginRight: "15px",
            fontFamily: "Architects Daughter",
          }}
          onClick={logoutOfApp}
        >
          <span>Log out</span>
          <AccountCircleOutlinedIcon
            style={{
              color: "rgb(53, 53, 53)",
              fontSize: "40px",
            }}
          />
        </button>
      </Link>
    </div>
  );
}

export default Header;
