import { createRoot } from "react-dom/client";
import { startInstance } from "./start";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(<startInstance.Start />);
