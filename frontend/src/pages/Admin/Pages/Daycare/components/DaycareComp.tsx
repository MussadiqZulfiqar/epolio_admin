import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Spinner from "../../../../../components/Spinner";
import { format } from "date-fns";

const DaycareForm: React.FC = () => {
  const [daycares, setDaycares] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    daycareName: "",
    location: "",
    phone: "",
    email: "",
    operatingHours: "",
    services: [],
    supervisorName: "",
    date: "",
  });

  const servicesOptions = [
    "General Daycare",
    "Immunization Facility",
    "Nutrition Programs",
    "Health Checkups",
    "Education Activities",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevState) => {
      const services = e.target.checked
        ? [...prevState.services, e.target.value]
        : prevState.services.filter((service) => service !== e.target.value);
      return { ...prevState, services };
    });
  };
  const fetchDayCares = async () => {
    setLoading(true);
    await axios
      .get("/api/v2/daycare/get-all-daycares")
      .then((response) => {
        setLoading(false);
        setDaycares(response.data.daycares);
      })
      .catch((error) => {
        setLoading(false);
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/v2/daycare/add-daycare",
        formData
      );
      toast.success("Daycare added successfully!");
      setFormData({
        daycareName: "",
        location: "",
        phone: "",
        email: "",
        operatingHours: "",
        services: [],
        supervisorName: "",
        date: "",
      });
      setDaycares((prev) => [response.data.newDaycare, ...prev]);
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong!");
    }
  };
  useEffect(() => {
    fetchDayCares();
  }, []);

  return (
    <div className="flex-1 overflow-hidden 800px:py-6 800px:px-8 600px:px-2">
      <div className="bg-white 1000px:max-w-xl mb-8 1000px:mx-auto border rounded py-12 800px:py-6 800px:px-6 px-2">
        <h1 className="text-[20px] select-none text-center  font-medium ">
          DayCare Registration
        </h1>
        <form onSubmit={handleSubmit} className="bg-white  mx-auto p-4">
          <div className="grid grid-cols-1  700px:grid-cols-2 gap-4">
            <div>
              <label>Daycare Name:</label>
              <input
                type="text"
                name="daycareName"
                value={formData.daycareName}
                onChange={handleInputChange}
                required
                className="block w-full mb-2 p-2 border border-gray-100 rounded-md shadow-md focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="block w-full mb-2 p-2 border border-gray-100 rounded-md shadow-md focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label>Location/Address:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="block w-full mb-2 p-2 border border-gray-100 rounded-md shadow-md focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="block w-full mb-2 p-2 border border-gray-100 rounded-md shadow-md focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label>Email Address:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-100 rounded-md shadow-md focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label>Operating Hours:</label>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleInputChange}
                required
                className="block w-full mb-2 p-2 border border-gray-100 rounded-md shadow-md focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label>Supervisor's Name:</label>
              <input
                type="text"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleInputChange}
                className="block w-full mb-2 p-2 border border-gray-100 rounded-md shadow-md focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label>Services Provided:</label>
              <div className="mb-2">
                {servicesOptions.map((service) => (
                  <label key={service} className="block">
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={handleCheckboxChange}
                      className="mr-2 rounded-full w-4 h-4  border-gray-200 appearance-none checked:bg-DarkBlue focus:ring-transparent checked:ring-transparent"
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary mx-auto h-fit w-fit text-white p-2 rounded"
          >
            Register Daycare
          </button>
        </form>
      </div>
      <AlreadyAddedDayCares
        loading={loading}
        daycares={daycares}
        setDaycares={setDaycares}
      />
    </div>
  );
};

export default DaycareForm;

const AlreadyAddedDayCares: React.FC = ({ loading, daycares, setDaycares }) => {
  //deleting worker
  const deleteWorker = async (id: string) => {
    try {
      const response = await axios.delete("/api/v2/daycare/delete-daycare", {
        data: { id },
      });

      setDaycares((prev) => prev.filter((m) => m._id !== id));

      return response.data; // Optionally return the response data if needed
    } catch (error) {
      console.error("Error deleting worker:", error);
      // Optionally handle the error, like showing a message to the user
    }
  };

  return (
    <div className="my-8">
      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Day-Cares
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
                <th className="p-4 min-w-[100px] shrink-0">location</th>
                <th className="p-4 min-w-[100px] shrink-0">Date</th>
                <th className="p-4 min-w-[100px] shrink-0">Hours</th>
                <th className="p-4 min-w-[100px] shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {daycares &&
                daycares.map((m) => (
                  <tr key={m?._id} className="border-b border-gray-200">
                    <td className="p-4 min-w-[100px] shrink-0">{m?._id}</td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.daycareName}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.phone}</td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.location}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.date && format(new Date(m?.date), "PP")}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.operatingHours}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0 text-center">
                      <button
                        onClick={() => deleteWorker(m?._id)}
                        color="primary"
                      >
                        <MdDelete size={20} />
                      </button>
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
