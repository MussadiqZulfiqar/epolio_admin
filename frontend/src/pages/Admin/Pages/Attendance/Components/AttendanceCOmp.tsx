import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { RxPlus } from "react-icons/rx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AttendanceCOmp: React.FC = () => {
  const [allattendance, setAlAttendavce] = useState(null);
  const fetchAttendance = async () => {
    await axios
      .get("/api/v2/attendance/get-all")
      .then((response) => {
        setAlAttendavce(response.data.created);
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };
  useEffect(() => {
    fetchAttendance();
  }, []);
  return (
    <div className="flex-1 overflow-hidden py-12 800px:px-8 600px:px-2">
      <div className="flex items-center justify-between">
        <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
          Attendance
        </h1>
        <Link
          to={"/add-attendance/"}
          className="py-2 px-4  rounded-full shadow-md bg-primary text-white font-medium select-none flex items-center justify-center gap-2 shrink-0"
        >
          <RxPlus className="text-white font-bold" />
          <span className="800px:block hidden"> Add</span>
        </Link>
      </div>
      <table className="min-w-full text-nowrap bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr className="text-left bg-gray-100 border-b border-gray-300">
            <th className="p-4 min-w-[100px] shrink-0">Date</th>
            <th className="p-4 min-w-[100px] shrink-0">Total</th>
            <th className="p-4 min-w-[100px] shrink-0">Present</th>
            <th className="p-4 min-w-[100px] shrink-0">Absent</th>
            <th className="p-4 min-w-[100px] shrink-0">Action</th>
          </tr>
        </thead>
        <tbody>
          {allattendance &&
            allattendance.map((m) => (
              <tr className="border-b border-gray-200">
                <td className="p-4 min-w-[100px] shrink-0">
                  {m?.createdAt && format(new Date(m?.date), "PP")}
                </td>
                <td className="p-4 min-w-[100px] shrink-0">
                  {m?.isPresent?.length + m?.isAbsent?.length}
                </td>
                <td className="p-4 min-w-[100px] shrink-0">
                  {m?.isPresent?.length}
                </td>
                <td className="p-4 min-w-[100px] shrink-0">
                  {m?.isAbsent?.length}
                </td>
                <td className="p-4 min-w-[100px] shrink-0 text-center">
                  <Link
                    to={"/add-attendance/check?id=" + m?._id}
                    // onClick={() => deleteArea(m?._id)}
                    color="primary"
                  >
                    <AiOutlineEye size={20} />
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceCOmp;
