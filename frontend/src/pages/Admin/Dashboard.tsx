import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Content from "./Pages/Content";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [appointmentStatus, setappointmentStatus] = useState([]);
  const [latestfive, setlatestfive] = useState([]);
  const [appointmentDates, setappointmentDates] = useState([]);
  const [workerNumber, setworkerNumber] = useState<number>(0);
  const [ParentNumber, setParentNumber] = useState<number>(0);
  const [CenterNumber, setCenterNumber] = useState<number>(0);
  const [AppointmentNumber, setAppointmentNumber] = useState<number>(0);
  console.log(appointmentStatus);
  console.log(workerNumber);
  console.log(ParentNumber);
  console.log(CenterNumber);
  console.log(AppointmentNumber);
  const fetchData = async () => {
    await axios
      .get("/api/v2/appointment/get-for-dashboard")
      .then((response) => {
        setappointmentStatus(response.data.appointmentStatus);
        setlatestfive(response.data.LatestfiveAppointments);
        setworkerNumber(response.data.workerNumber);
        setParentNumber(response.data.ParentNumber);
        setappointmentDates(response.data.appointmentDates);
        setCenterNumber(response.data.CenterNumber);
        setAppointmentNumber(response.data.AppointmentNumber);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex">
      <Sidebar active={1} />
      <Content
        workerNumber={workerNumber}
        AppointmentNumber={AppointmentNumber}
        CenterNumber={CenterNumber}
        ParentNumber={ParentNumber}
        appointmentStatus={appointmentStatus}
        appointmentDates={appointmentDates}
        latestfive={latestfive}
      />
    </div>
  );
};

export default Dashboard;
