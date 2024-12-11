import axios from "axios";
import { format } from "date-fns";
import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../../../components/Spinner";

const AppointmentDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [GotData, setGotData] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [upload, setUpload] = useState(false);
  const id = searchParams.get("id");
  const [data, setData] = useState<any>(null);
  const [Providers, setProviders] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [Compaign, setCompaign] = useState("");
  const { user } = useSelector((State) => State.user);
  const [status, setStatus] = useState("");
  // Function to fetch appointment details
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/v2/appointment/get-single-appointment/" + id
      );
      setData(response.data.singleAppointment);
      setProviders(response.data.allProviders);
      setLoading(false);
      setGotData(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
      setLoading(false);
      setGotData(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  const formSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUpload(true);
    await axios
      .post("/api/v2/appointments/admin-add-appointment", {
        user: data.user,
        id: data?._id,
        provider: selectedProvider,
        department: data?.department,
        appointment_type: data?.appointment_type,
      })
      .then((response) => {
        setUpload(false);

        toast.success(response.data.message);
      })
      .catch((err) => {
        setUpload(false);

        toast.error(err.response.data.message);
      });
  };
  //updatating appointments Status
  const updateStatus = async (e: FormEvent) => {
    e.preventDefault();
    setUpload(true);

    await axios
      .put("/api/v2/appointment/admin-update-appointment", {
        id: data?._id,
        status: status,
        compaign: Compaign,
        provider: selectedProvider,
      })
      .then((response) => {
        if (response.data.message === "deleted") {
          window.history.back();
        } else {
          setUpload(false);
          fetchData();
          toast.success("Update successfull!!");
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message);
        setUpload(false);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center gap-2 ">
      <div className="flex gap-2 items-center">
        <h1 className="text-[16px] 800px:text-[18px] capitalize select-none text-nowrap">
          {user && user?.role}
        </h1>
        <h1 className="text-[16px] 800px:text-[18px] select-none text-nowrap">
          {">>"}
        </h1>
        <h1 className="text-[16px] 800px:text-[18px] select-none text-nowrap">
          Appointment Details
        </h1>
        <h1 className="text-[16px] 800px:text-[18px] select-none text-nowrap">
          {">>"}
        </h1>
        <h1 className="text-[16px] font-medium text-primary 800px:text-[18px] select-none text-nowrap">
          {id && id.slice(0, 10)}
        </h1>
      </div>
      <div className="bg-white px-4 max-w-lg py-12 rounded-md shadow-md">
        <h1 className="text-heading-md mb-4">Appointment Details</h1>
        <h1 className="text-md my-2 select-none ">
          Name:{data && data.requested_by?.name}
        </h1>
        <h1 className="text-md my-2 select-none ">
          Email:{data && data.requested_by?.email}
        </h1>

        <h1 className="text-md my-2 select-none ">
          Contact:{data && data.requested_by?.contact}
        </h1>
        <h1 className="text-md my-2 select-none ">
          Location:{data && data?.location}
        </h1>
        {data && data?.provided_by ? (
          <div>
            <h1 className="text-md my-2 select-none ">
              <span>Provider:</span>

              <span className="font-bold">
                {data?.provided_by?.name}({data?.provided_by?.cnic})
              </span>
            </h1>
          </div>
        ) : null}
        <h1 className="text-md my-2 select-none ">
          <span> Requested Appointment Date:</span>

          <span className="font-bold">
            {data && format(new Date(data?.requested_date), "dd-MMMM-yyyy")}
          </span>
        </h1>
        {data &&
        data?.type === "Wait for Compaign" &&
        user?.role === "admin" ? (
          <h1>
            The User Has Requested an Appointment and is waiting for the
            compaign to arrive.
          </h1>
        ) : null}
        {data &&
        data?.type === "Requested Doorstep" &&
        user?.role === "admin" ? (
          <h1>
            The User Has Requested an Appointment and is waiting for the
            Provider to arrive.
          </h1>
        ) : null}
        {data && data?.status === "Attended" && user?.role === "admin" ? (
          <h1 className="text-heading-md my-4">
            The Appointment was requested And Attended Successfully.
          </h1>
        ) : null}
        {data && data?.status === "pending" && user?.role === "admin" ? (
          <form onSubmit={updateStatus} className="flex flex-col gap-3">
            <div>
              <h1 className="text-md select-none">Select Provider</h1>
              <select
                required
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="shadow-md w-full border-none rounded-md mt-2"
                disabled={!GotData} // Disable if data is not loaded
              >
                <option value="">Select Provider</option>
                {Providers.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                    {"("}
                    {doctor?.cnic}
                    {")"}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={status}
              required
              className="shadow-md w-full border-none rounded-md mt-2"
              onChange={(e) => setStatus(e.target.value)}
              name=""
              id=""
            >
              <option value="">status</option>
              {["Approve", "Cancel", "Attended"]
                .filter((m) => m !== data?.status)
                .map((m) => (
                  <option value={m}>{m}</option>
                ))}
            </select>
            <div className="flex flex-col gap-2">
              <h1>Tell the User about ongoing Compaign</h1>
              <input
                value={Compaign}
                required
                onChange={(e) => setCompaign(e.target.value)}
                type="text"
                className="w-full shadow-md  rounded-md mt-2 shadown-md p-2 border border-gray-100"
              />
            </div>
            {upload ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="p-2 bg-primary text-white rounded-md shadow-md ml-2"
              >
                Update
              </button>
            )}
          </form>
        ) : null}
        {data &&
        data?.status === "Approve" &&
        !data?.type &&
        user?.role === "admin" ? (
          <form onSubmit={updateStatus} className="flex flex-col gap-2">
            <select
              value={status}
              required
              className="shadow-md w-full border-none rounded-md mt-2"
              onChange={(e) => setStatus(e.target.value)}
              name=""
              id=""
            >
              <option value="">status</option>
              {[
                "Approve",
                "Cancel",
                "Attended",
                "Wait for Compaign",
                "Requested Doorstep",
              ]
                .filter((m) => m !== data?.status)
                .map((m) => (
                  <option value={m}>{m}</option>
                ))}
            </select>
            {upload ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="p-2 bg-primary text-white rounded-md shadow-md ml-2"
              >
                Update
              </button>
            )}
          </form>
        ) : null}
        {data &&
        data?.type &&
        data?.status === "Approve" &&
        user?.role === "admin" ? (
          <form onSubmit={updateStatus} className="flex flex-col gap-2">
            <select
              value={status}
              required
              className="shadow-md w-full border-none rounded-md mt-2"
              onChange={(e) => setStatus(e.target.value)}
              name=""
              id=""
            >
              <option value="">status</option>
              {["Cancel", "Attended"]
                .filter((m) => m !== data?.status)
                .map((m) => (
                  <option value={m}>{m}</option>
                ))}
            </select>
            {upload ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="p-2 bg-primary text-white rounded-md shadow-md ml-2"
              >
                Update
              </button>
            )}
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default AppointmentDetails;
