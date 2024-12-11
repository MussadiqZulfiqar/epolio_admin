import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../../../../../components/Spinner";
import { MdDelete } from "react-icons/md";

const AddVaccinationCenter = () => {
  const [loading, setLoading] = useState(false);
  const [Centers, setCenters] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    openingHours: "",
    availableVaccines: "",
  });

  const { name, address, contactNumber, openingHours, availableVaccines } =
    formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const vaccinesArray = availableVaccines
        .split(",")
        .map((vaccine) => vaccine.trim());
      const res = await axios.post("/api/v2/vaccination/add-center", {
        ...formData,
        availableVaccines: vaccinesArray,
      });
      setLoading(false);
      setCenters((prev) => [res.data, ...prev]);
      setFormData({
        name: "",
        address: "",
        contactNumber: "",
        openingHours: "",
        availableVaccines: "",
      });
      toast.success("Vaccination center added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error adding vaccination center");
    }
  };

  return (
    <div className="flex-1 overflow-hidden 800px:py-6 600px:px-2 800px:px-8">
      <form
        className="800px:max-w-[34rem] 800px:px-6 px-4 py-12 800px:py-6    bg-white overflow-y-scroll  mx-auto transition duration-300 ease-in-out shadow rounded-md "
        onSubmit={onSubmit}
      >
        <h1 className="text-[20px] select-none text-center  font-medium ">
          Add Center
        </h1>
        <div>
          <label>Name</label>
          <input
            className="w-full border-gray-300 my-2 text-sm p-2 my-2 rounded-md focus:border-primarytwo outline-none appearance-none focus:ring-primarytwo  "
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Address</label>
          <input
            className="w-full border-gray-300 my-2 text-sm p-2 my-2 rounded-md focus:border-primarytwo outline-none appearance-none focus:ring-primarytwo  "
            type="text"
            name="address"
            value={address}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Contact Number</label>
          <input
            className="w-full border-gray-300 my-2 text-sm p-2 my-2 rounded-md focus:border-primarytwo outline-none appearance-none focus:ring-primarytwo  "
            type="text"
            name="contactNumber"
            value={contactNumber}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Opening Hours</label>
          <input
            className="w-full border-gray-300 my-2 text-sm p-2 my-2 rounded-md focus:border-primarytwo outline-none appearance-none focus:ring-primarytwo  "
            type="text"
            name="openingHours"
            value={openingHours}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Available Vaccines (comma separated)</label>
          <input
            className="w-full border-gray-300 my-2 text-sm p-2 my-2 rounded-md focus:border-primarytwo outline-none appearance-none focus:ring-primarytwo  "
            type="text"
            name="availableVaccines"
            value={availableVaccines}
            onChange={onChange}
            required
          />
        </div>
        <div className="w-full flex">
          {loading ? (
            <Spinner />
          ) : (
            <button
              type="submit"
              className="bg-primary  px-3 py-2 text-white my-3 rounded-md border  shadow-md hover:bg-primarytwo transition duration-300 ease-in-out w-fit mx-auto "
            >
              Add Center
            </button>
          )}
        </div>
      </form>
      <AlreadyAddedCenters Centers={Centers} setCenters={setCenters} />
    </div>
  );
};

export default AddVaccinationCenter;
const AlreadyAddedCenters: React.FC = ({ Centers, setCenters }) => {
  const [loading, setLoading] = useState(false);

  const fetchWorkers = async () => {
    setLoading(true);
    await axios
      .get("/api/v2/vaccination/admin-all-centers")
      .then((response) => {
        setLoading(false);
        setCenters(response.data.Centers);
      })
      .catch((error) => {
        setLoading(false);
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };
  useEffect(() => {
    fetchWorkers();
  }, []);

  //deleting worker
  const deleteWorker = async (id: string) => {
    try {
      const response = await axios.delete("/api/v2/vaccination/delet-center", {
        data: { id },
      });

      setCenters((prev) => prev.filter((m) => m._id !== id));

      return response.data; // Optionally return the response data if needed
    } catch (error) {
      console.error("Error deleting worker:", error);
      // Optionally handle the error, like showing a message to the user
    }
  };

  return (
    <div className="my-8">
      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Centers
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-nowrap bg-white border border-gray-300 rounded-lg shadow">
            <thead>
              <tr className="text-left bg-gray-100 border-b border-gray-300">
                <th className="p-4 min-w-[100px] shrink-0">Worker ID</th>
                <th className="p-4 min-w-[100px] shrink-0">Name</th>
                <th className="p-4 min-w-[100px] shrink-0">Contact</th>
                <th className="p-4 min-w-[100px] shrink-0">Address</th>
                <th className="p-4 min-w-[100px] shrink-0">openingHours</th>
                <th className="p-4 min-w-[100px] shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Centers &&
                Centers.map((m) => (
                  <tr key={m?._id} className="border-b border-gray-200">
                    <td className="p-4 min-w-[100px] shrink-0">{m?._id}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.name}</td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.contactNumber}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.address}</td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.openingHours}
                    </td>

                    <td className="p-4 min-w-[100px] shrink-0 text-center">
                      <div>
                        <button
                          onClick={() => deleteWorker(m?._id)}
                          color="primary"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
