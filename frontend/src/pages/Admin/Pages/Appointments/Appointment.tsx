import React from "react";
import Sidebar from "../../components/Sidebar";
import AppointmentComp from "./components/AppointmentComp";

const Appointment: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar active={2} />
      <AppointmentComp />
    </div>
  );
};

export default Appointment;
