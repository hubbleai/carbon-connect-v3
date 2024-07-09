import { createRoot } from "react-dom/client";
import { CarbonConnect } from "./App.tsx";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<CarbonConnect />);
