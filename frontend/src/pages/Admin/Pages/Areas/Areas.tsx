import React from "react";
import Sidebar from "../../components/Sidebar";
import AreacComp from "./components/AreacComp";

const Areas: React.FC = () => {
  return (
    <div className="flex ">
      <Sidebar active={6} />
      <AreacComp />
    </div>
  );
};

export default Areas;
