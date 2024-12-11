import React from "react";
import Sidebar from "../../components/Sidebar";
import AttendanceCOmp from "./Components/AttendanceCOmp";

const Attendace: React.FC = () => {
  return (
    <div className="flex ">
      <Sidebar active={10} />
      <AttendanceCOmp />
    </div>
  );
};

export default Attendace;
