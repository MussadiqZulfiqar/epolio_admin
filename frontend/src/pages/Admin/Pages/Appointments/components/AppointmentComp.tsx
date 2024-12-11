import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../../../components/Spinner";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";

const AppointmentComp: React.FC = () => {
  const [parents, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [again, setagain] = useState(false);
  const [showMore, setShowmore] = useState(false);
  //fetch parents
  const fetchAppointments = async () => {
    await axios
      .get("/api/v2/appointment/get-all-appointments")
      .then((response) => {
        setShowmore(
          response.data.allAppointments.length >= 20 &&
            response.data.allAppointments.length !== 0
        );
        setLoading(false);
        setAppointments(response.data.allAppointments);
      })
      .catch((error) => {
        setLoading(false);
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };
  useEffect(() => {
    fetchAppointments();
  }, []);
  const handleshowMore = async () => {
    const startIndex = parents.length;
    setagain(true);
    await axios
      .get(`/api/v2/appointment/get-all-appointments?startIndex=${startIndex}`)
      .then((response) => {
        setShowmore(
          response.data.allAppointments.length >= 20 &&
            response.data.allAppointments.length !== 0
        );
        setagain(false);
        setAppointments((prev) => [...prev, ...response.data.allAppointments]);
      })
      .catch((error) => {
        toast.dismiss();
        setagain(false);
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="flex-1 overflow-hidden py-12 800px:px-8 600px:px-2">
      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Appointments
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-nowrap bg-white border border-gray-300 rounded-lg shadow">
            <thead>
              <tr className="text-left bg-gray-100 border-b border-gray-300">
                <th className="p-4 min-w-[100px] shrink-0">ID</th>
                <th className="p-4 min-w-[100px] shrink-0">Name</th>
                <th className="p-4 min-w-[100px] shrink-0">Contact</th>
                <th className="p-4 min-w-[100px] shrink-0">Email</th>
                <th className="p-4 min-w-[100px] shrink-0">Childrens</th>
                <th className="p-4 min-w-[100px] shrink-0">status</th>
                <th className="p-4 min-w-[100px] shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parents &&
                parents.map((m) => (
                  <tr key={m?._id} className="border-b border-gray-200">
                    <td className="p-4 min-w-[100px] shrink-0">{m?._id}</td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.requested_by?.name}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.requested_by?.contact}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.requested_by?.email}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.requested_by?.children?.length || 0}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.status}</td>
                    <td className="p-4 min-w-[100px] shrink-0 text-center">
                      <Link to={"/appointments/data?id=" + m?._id}>
                        <button color="primary">
                          <AiOutlineEye size={20} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {again ? (
        <Spinner />
      ) : showMore ? (
        <button
          onClick={handleshowMore}
          className="my-8 bg-primary text-white font-bold rounded-full px-6 py-3 shadow-md "
        >
          Show More
        </button>
      ) : null}
    </div>
  );
};

export default AppointmentComp;
