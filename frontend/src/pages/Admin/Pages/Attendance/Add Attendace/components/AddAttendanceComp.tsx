import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddAttendanceComp: React.FC = ({ worker }) => {
  const [presentWorkers, setPresentWorkers] = useState<string[]>([]);
  const [absentWorkers, setAbsentWorkers] = useState<string[]>([]);
  const [date, setDate] = useState<string>(""); // State to store the selected date
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const fetchAttendance = async () => {
    await axios
      .get("/api/v2/attendance/get/" + id)
      .then((response) => {
        setPresentWorkers(response.data.isPresent);
        setAbsentWorkers(response.data.isAbsent);
        setDate(format(new Date(response.data.date), "yyyy-MM-dd"));
        console.log(response.data.date);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
    if (worker && !id) {
      worker.map((m) => setAbsentWorkers((prev) => [...prev, m?._id]));
    }
  }, [worker, id]);

  // Handle radio button selection
  const handleAttendanceChange = (
    workerId: string,
    status: "present" | "absent"
  ) => {
    if (status === "present") {
      setPresentWorkers((prev) => [
        ...prev.filter((id) => id !== workerId),
        workerId,
      ]);
      setAbsentWorkers((prev) => prev.filter((id) => id !== workerId));
    } else {
      setAbsentWorkers((prev) => [
        ...prev.filter((id) => id !== workerId),
        workerId,
      ]);
      setPresentWorkers((prev) => prev.filter((id) => id !== workerId));
    }
  };
  // Submit attendance to backend
  const handleSubmit = async () => {
    try {
      if (!date) {
        toast.error("Please select a date for attendance.");
        return;
      }

      const payload = {
        isPresent: presentWorkers,
        isAbsent: absentWorkers,
        date,
      };

      if (id) {
        await axios.put("/api/v2/attendance/update/" + id, payload);
        toast.success("Attendance updated successfully!");
        window.history.back();
      } else {
        await axios.post("/api/v2/attendance/mark", payload);
        toast.success("Attendance marked successfully!");
        window.history.back();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-11/12 mx-auto my-12">
      <h1 className="mx-auto text-center text-xl 800px:text-3xl">
        Add Attendance
      </h1>
      <div className="mt-8">
        {/* Date input field */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="date">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="flex items-center">
          <h1 className="p-2 flex-1 font-semibold select-none text-lg uppercase">
            Name
          </h1>
          <h1 className="p-2 flex-1 font-semibold select-none text-lg uppercase">
            Present
          </h1>
          <h1 className="p-2 flex-1 font-semibold select-none text-lg uppercase">
            Absent
          </h1>
        </div>
        {worker &&
          worker.map((m) => (
            <div key={m?._id} className="flex items-center w-full p-3">
              <h1 className="flex-1 capitalize">{m?.name}</h1>
              <div className="flex-1">
                <input
                  type="radio"
                  required
                  name={`${m?._id}`}
                  onChange={() => handleAttendanceChange(m?._id, "present")}
                  checked={presentWorkers.includes(m?._id)}
                />
              </div>
              <div className="flex-1">
                <input
                  type="radio"
                  required
                  name={`${m?._id}`}
                  onChange={() => handleAttendanceChange(m?._id, "absent")}
                  checked={absentWorkers.includes(m?._id)}
                />
              </div>
            </div>
          ))}
        <button
          className="mt-6 p-2 bg-blue-500 text-white rounded"
          onClick={handleSubmit}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default AddAttendanceComp;
