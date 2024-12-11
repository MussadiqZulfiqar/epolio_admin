import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const AddWcomp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    cnic: "",
    gender: "",
    contact: "",
    age: "",
  });
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormdata({
      ...formdata,
      [name]: value,
    });
  };
  const formUpload = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post("/api/v2/user/admin-add-worker", formdata)
      .then((response) => {
        toast.success("Success!!");
        setLoading(false);
        setWorkers((prev) => [response.data.newWorker, ...prev]);
        setFormdata({
          name: "",
          email: "",
          cnic: "",
          gender: "",
          contact: "",
          age: "",
        }); // Reset form
      })
      .catch((e) => {
        setLoading(false);

        toast.error(e.response.data.message);
      });
  };
  return (
    <div className="flex-1 overflow-hidden 800px:py-6 600px:px-2 800px:px-8 ">
      <form
        action=""
        onSubmit={formUpload}
        className={`800px:max-w-[34rem] 800px:px-6 px-4 py-12 800px:py-6    bg-white overflow-y-scroll  mx-auto transition duration-300 ease-in-out shadow rounded-md `}
      >
        <h1 className="text-[20px] select-none text-center  font-medium ">
          Add Worker
        </h1>

        <div className="grid  grid-cols-1 px-4 py-2 600px:grid-cols-2 gap-x-4">
          {Object.keys(formdata).map((field) => (
            <>
              {field !== "gender" ? (
                <div>
                  <label
                    className="capitalize text-sm font-medium select-none "
                    htmlFor=""
                  >
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type={
                      field === "cnic" || field === "contact" || field === "age"
                        ? "number"
                        : "text"
                    }
                    name={field}
                    key={field}
                    required
                    className="w-full border-gray-300 text-sm p-2 my-2 rounded-md focus:border-primarytwo outline-none appearance-none focus:ring-primarytwo  "
                    value={formdata[field]}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <label className="capitalize " htmlFor="">
                    gender
                  </label>
                  <select
                    required
                    name="gender"
                    id="gender"
                    onChange={handleInputChange}
                    className="w-full border-gray-300 my-2 rounded-md focus:border-primarytwo outline-none appearance-none focus:ring-primarytwo"
                  >
                    <option value={""}>Select Gender</option>
                    {["male", "female"].map((m) => (
                      <option value={m} key={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ))}
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="w-full flex">
            <button
              type="submit"
              className="bg-primary  px-3 py-2 text-white my-3 rounded-md border  shadow-md hover:bg-primarytwo transition duration-300 ease-in-out w-fit mx-auto "
            >
              Add Worker
            </button>
          </div>
        )}
      </form>
      <AlreadyAddedWorkers workers={workers} setWorkers={setWorkers} />
    </div>
  );
};

export default AddWcomp;

const AlreadyAddedWorkers: React.FC = ({ workers, setWorkers }) => {
  const [loading, setLoading] = useState(false);
  const [again, setagain] = useState(false);
  const [showMore, setShowmore] = useState(false);

  const fetchWorkers = async () => {
    setLoading(true);
    await axios
      .get("/api/v2/user/admin-all-workers")
      .then((response) => {
        setShowmore(
          response.data.workers.length >= 20 &&
            response.data.workers.length !== 0
        );
        setLoading(false);
        setWorkers(response.data.workers);
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
  const handleshowMore = async () => {
    const startIndex = workers.length;
    setagain(true);
    await axios
      .get(`/api/v2/user/admin-all-workers?startIndex=${startIndex}`)
      .then((response) => {
        setShowmore(
          response.data.workers.length >= 20 &&
            response.data.workers.length !== 0
        );
        setagain(false);
        setWorkers((prev) => [...prev, ...response.data.workers]);
      })
      .catch((error) => {
        toast.dismiss();
        setagain(false);
        toast.error(error.response.data.message);
      });
  };
  //deleting worker
  const deleteWorker = async (id: string) => {
    try {
      const response = await axios.delete("/api/v2/user/delet-worker", {
        data: { id },
      });

      setWorkers((prev) => prev.filter((m) => m._id !== id));

      return response.data; // Optionally return the response data if needed
    } catch (error) {
      console.error("Error deleting worker:", error);
      // Optionally handle the error, like showing a message to the user
    }
  };

  return (
    <div className="my-8">
      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Workers
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
                <th className="p-4 min-w-[100px] shrink-0">Age</th>
                <th className="p-4 min-w-[100px] shrink-0">Email</th>
                <th className="p-4 min-w-[100px] shrink-0">Gender</th>
                <th className="p-4 min-w-[100px] shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers &&
                workers.map((m) => (
                  <tr key={m?._id} className="border-b border-gray-200">
                    <td className="p-4 min-w-[100px] shrink-0">{m?._id}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.name}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.contact}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.age}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.email}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.gender}</td>
                    <td className="p-4 min-w-[100px] shrink-0 text-center">
                      <div>
                        <Link to={"/worker-detail/worker?id=" + m?._id}>
                          <button color="primary">
                            <AiOutlineEye size={20} />
                          </button>
                        </Link>
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
