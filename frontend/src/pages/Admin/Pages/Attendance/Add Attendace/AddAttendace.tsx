import axios from "axios";
import React, { useEffect, useState } from "react";
import AddAttendanceComp from "./components/AddAttendanceComp";

const AddAttendace: React.FC = () => {
  const [worker, setWorkers] = useState([]); // Stores workers from backend

  // Fetch workers from backend
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get("/api/v2/user/get-attendance-names");
        setWorkers(response.data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  return <AddAttendanceComp worker={worker} />;
};

export default AddAttendace;
