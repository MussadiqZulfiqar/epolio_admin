import React from "react";
import Sidebar from "../../components/Sidebar";
import DaycareForm from "./components/DaycareComp";

const Daycare: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar active={5} />
      <DaycareForm />
    </div>
  );
};

export default Daycare;
