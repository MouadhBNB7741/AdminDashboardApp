import { useContext } from "react";
import { AuthContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import Admin from "./MainRoutes/Admin";
import Supplier from "./MainRoutes/Supplier";
import Delivery from "./MainRoutes/Delivery";
import Customer from "./MainRoutes/Customer";

function Main() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/log-in");
  }

  switch (user?.type) {
    case "admin":
      return <Admin />;

    case "supplier":
      return <Supplier />;

    case "delivery":
      return <Delivery />;

    default:
      return <Customer />;
  }
}

export default Main;
