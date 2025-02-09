import { createRoot } from "react-dom/client";
import "./index.css";
import { Navigation } from "./Navigation";

function App() {
  return <Navigation />;
}

createRoot(document.getElementById("root")).render(<App />);
