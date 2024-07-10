import { createRoot } from "react-dom/client";
import { CarbonConnect } from "./index.tsx";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<CarbonConnect />);
