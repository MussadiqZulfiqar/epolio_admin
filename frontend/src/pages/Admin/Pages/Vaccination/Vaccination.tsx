import React from "react";
import Sidebar from "../../components/Sidebar";
import AddVaccinationCenter from "./components/VacinationForm";

const Vaccination = () => {
  return (
    <div className="flex">
      <Sidebar active={7} />
      <AddVaccinationCenter />
    </div>
  );
};

export default Vaccination;
