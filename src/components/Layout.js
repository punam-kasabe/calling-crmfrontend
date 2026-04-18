import Sidebar from "./Sidebar";
import "../styles/layout.css";
import { useState } from "react";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className={`main-content ${isOpen ? "expanded" : "collapsed"}`}>
        {children}
      </div>
    </div>
  );
}