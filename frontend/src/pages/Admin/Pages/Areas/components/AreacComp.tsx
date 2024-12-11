import React, {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Spinner from "../../../../../components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { format } from "date-fns";
import { Dispatch } from "@reduxjs/toolkit";

const AreacComp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setuploadLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    city: "",
    town: "",
    date: "",
    supervisorName: "",
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const fetchDayCares = async () => {
    setLoading(true);
    await axios
      .get("/api/v2/area/get-all-Areas")
      .then((response) => {
        setLoading(false);
        setAreas(response.data.Areas);
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
      setuploadLoading(true);

      const response = await axios.post("/api/v2/area/add-Area", formData);
      toast.success(response.data.message);

      const newArea = response.data.newArea;
      setFormData({ city: "", town: "", date: "", supervisorName: "" }); // Reset form

      if (response.data.message === "Area updated successfully!") {
        // Update the area if it already exists
        setAreas((prev) =>
          prev.map((area) => (area?._id === newArea?._id ? newArea : area))
        );
      } else {
        // Add the new area to the beginning of the array
        setAreas((prev) => [newArea, ...prev]);
      }

      setuploadLoading(false); // Stop loading
    } catch (e) {
      setuploadLoading(false); // Stop loading

      // Check if e.response exists and handle error
      const errorMessage =
        e.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchDayCares();
  }, []);
  return (
    <div className="flex-1 overflow-hidden 800px:py-6 600px:px-2 800px:px-8">
      <form
        action=""
        onSubmit={handleSubmit}
        className={`800px:max-w-[33rem] max-w-lg 800px:px-6 px-4 pb-6 pt-12 800px:py-6    bg-white overflow-y-scroll  mx-auto transition duration-300 ease-in-out shadow rounded-md `}
      >
        <div className="flex justify-end"></div>
        <h1 className="text-[20px] select-none text-center  font-medium ">
          Add Vaccinated Area
        </h1>
        <div className="grid grid-cols-1 mt-4 700px:grid-cols-2 gap-4 ">
          {Object.keys(formData).map((m) => (
            <div key={m}>
              <h1 className="text-base my-2 select-none capitalize">{m}</h1>
              <input
                name={m}
                value={formData[m]}
                onChange={handleInputChange}
                required
                type={m === "date" ? "date" : "text"}
                className="w-full p-2 rounded-md shadow-md border border-gray-200 focus:border-primary focus:ring-primary outline-none appearance-none"
              />
            </div>
          ))}
        </div>
        {uploadLoading ? (
          <Spinner />
        ) : (
          <div className="w-full mt-4 flex">
            <button
              type="submit"
              className="bg-primary  px-3 py-2 text-white my-3 rounded-md border  shadow-md hover:bg-primarytwo transition duration-300 ease-in-out w-fit mx-auto "
            >
              Add Worker
            </button>
          </div>
        )}
      </form>
      <AlreadyAddedArea loading={loading} areas={areas} setAreas={setAreas} />
    </div>
  );
};

export default AreacComp;
interface SingleArea {
  _id: string;
  city: string;
  town: string;
  date: string;
  supervisorName: string;
}
interface Props {
  loading: boolean;
  areas: SingleArea[];
  setAreas: Dispatch<SetStateAction<any>>;
}
const AlreadyAddedArea: React.FC<Props> = ({ loading, areas, setAreas }) => {
  //deleting worker
  const deleteArea = async (id: string) => {
    try {
      const response = await axios.delete("/api/v2/area/delete-Area", {
        data: { id },
      });

      setAreas((prev) => prev.filter((m) => m._id !== id));

      return response.data; // Optionally return the response data if needed
    } catch (error) {
      console.error("Error deleting worker:", error);
      // Optionally handle the error, like showing a message to the user
    }
  };

  return (
    <div className="my-8">
      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Added Areas
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-nowrap shrink-0 bg-white border border-gray-300 rounded-lg shadow">
            <thead>
              <tr className="text-left shrink-0 bg-gray-100 border-b border-gray-300">
                <th className="p-4 min-w-[100px] shrink-0">ID</th>
                <th className="p-4 min-w-[100px] shrink-0">City</th>
                <th className="p-4 min-w-[100px] shrink-0">Town</th>
                <th className="p-4 min-w-[100px] shrink-0">Date</th>
                <th className="p-4 min-w-[100px] shrink-0">supervisorName</th>
                <th className="p-4 min-w-[100px] shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas &&
                areas.map((m) => (
                  <tr key={m?._id} className="border-b border-gray-200">
                    <td className="p-4 min-w-[100px] shrink-0">{m?._id}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.city}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.town}</td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.date && format(new Date(m?.date), "PP")}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.supervisorName}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0 text-center">
                      <button
                        onClick={() => deleteArea(m?._id)}
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
