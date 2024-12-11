import React from "react";
import Sidebar from "../../components/Sidebar";
import AddWcomp from "./Components/AddWcomp";

const AddWorker: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar active={3} />
      <AddWcomp />
    </div>
  );
};

export default AddWorker;
