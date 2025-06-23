import { type ReactNode, useState, useEffect, useContext } from "react";
import { AuthContext, LogContext } from "./context";
import { type User } from "../types";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import LoaderAuth from "../components/utils/LoaderAuth";

interface Props {
  children: ReactNode;
}

function initDB() {
  // settings the users
  if (localStorage.getItem("users")) {
    return;
  }

  localStorage.setItem(
    "users",
    JSON.stringify([
      {
        id: "1",
        mail: "mouadh@gmail.com",
        password: "Mouadh7741",
        name: "mouadh",
        type: "admin",
      },
      {
        id: "2",
        mail: "benbahi@gmail.com",
        password: "Benbahi7741",
        name: "benbahi",
        type: "customer",
      },
      {
        id: "3",
        mail: "azz@gmail.com",
        password: "Azzed7741",
        name: "azz",
        type: "delivery",
      },
      {
        id: "4",
        mail: "houad@gmail.com",
        password: "Houad7741",
        name: "houad",
        type: "supplier",
      },
    ])
  );
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const { addLog } = useContext(LogContext);

  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = String(cookies.authToken);
        if (token) {
          const users = JSON.parse(localStorage.getItem("users")!) as User[];

          const matchedUser = users.find((user) => user.id === token);

          if (!matchedUser) {
            removeCookie("authToken");
            localStorage.removeItem("authToken");
            setUser(null);
            setLoading(false);
            return;
          }

          const { id, mail, name, password, type } = matchedUser;
          setUser({
            id,
            mail,
            name,
            password,
            type,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        removeCookie("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [cookies.authToken, removeCookie]);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/log-in", "/sign-up"];
    const isPublicPath = publicPaths.includes(location.pathname);

    if (!user && !isPublicPath) {
      navigate("/log-in");
    } else if (
      user &&
      (location.pathname === "/log-in" || location.pathname === "/sign-up")
    ) {
      navigate("/");
    }
  }, [user, loading, location, navigate]);

  const login = async (userData: User, token: string) => {
    addLog({ message: "tried to log in", type: "info", userId: token });
    setUser(userData);
    setCookie("authToken", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: false,
      sameSite: "lax" as const,
    });
  };

  const logout = async () => {
    setUser(null);
    removeCookie("authToken", { path: "/" });
    navigate("/log-in");
  };

  if (loading) {
    return <LoaderAuth />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
