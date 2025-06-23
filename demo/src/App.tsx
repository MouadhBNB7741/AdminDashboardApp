import { Routes, Route } from "react-router-dom";
import { Main, Login, Signup } from "./routes/exporter";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/log-in" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
    </Routes>
  );
}

export default App;
