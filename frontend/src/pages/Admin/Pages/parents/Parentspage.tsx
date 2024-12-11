import React from "react";
import Sidebar from "../../components/Sidebar";
import ParentsComp from "./components/ParentsComp";

const Parentspage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar active={4} />
      <ParentsComp />
    </div>
  );
};

export default Parentspage;
