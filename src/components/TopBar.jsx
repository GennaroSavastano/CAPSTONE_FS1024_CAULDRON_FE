import { Navbar, Container, NavDropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../redux/actions/authActions";
import topbar_logo from "../assets/svg/logo_cauldron.svg";

const TopBar = () => {
  const auth = useSelector((state) => state.auth) || {};
  const { isAuthenticated, user } = auth;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: LOGOUT });
    navigate("/");
  };

  return (
    <Navbar className="topbar" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">
          <img src={topbar_logo} alt="Cauldron Logo" className="topbar_logo" />
        </Navbar.Brand>

        {isAuthenticated && user && (
          <NavDropdown title={<span>&#9776;</span>} id="basic-nav-dropdown" align="end" className="hide-caret">
            <div className=" dropdown-message full-width-dropdown">
              <div className="text-wrapper">
                Sei loggato come <strong>{user.username}</strong>. Vuoi effettuare il logout?
              </div>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </div>
          </NavDropdown>
        )}
      </Container>
    </Navbar>
  );
};

export default TopBar;
