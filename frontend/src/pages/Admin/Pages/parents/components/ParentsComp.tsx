import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../../../components/Spinner";

const ParentsComp: React.FC = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [again, setagain] = useState(false);
  const [showMore, setShowmore] = useState(false);
  //fetch parents
  const fetchParents = async () => {
    await axios
      .get("/api/v2/user/admin-all-parents")
      .then((response) => {
        setShowmore(
          response.data.parents.length >= 20 &&
            response.data.parents.length !== 0
        );
        setLoading(false);
        setParents(response.data.parents);
      })
      .catch((error) => {
        setLoading(false);
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };
  useEffect(() => {
    fetchParents();
  }, []);
  const handleshowMore = async () => {
    const startIndex = parents.length;
    setagain(true);
    await axios
      .get(`/api/v2/user/admin-all-parents?startIndex=${startIndex}`)
      .then((response) => {
        setShowmore(
          response.data.parents.length >= 20 &&
            response.data.parents.length !== 0
        );
        setagain(false);
        setParents((prev) => [...prev, ...response.data.parents]);
      })
      .catch((error) => {
        toast.dismiss();
        setagain(false);
        toast.error(error.response.data.message);
      });
  };
  const deleteParent = async (id: string) => {
    try {
      const response = await axios.delete("/api/v2/user/delet-parent", {
        data: { id },
      });

      setParents((prev) => prev.filter((m) => m._id !== id));

      return response.data; // Optionally return the response data if needed
    } catch (error) {
      console.error("Error deleting worker:", error);
      // Optionally handle the error, like showing a message to the user
    }
  };
  return (
    <div className="flex-1 overflow-hidden py-12 800px:px-8 600px:px-2">
      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Parents
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
                <th className="p-4 min-w-[100px] shrink-0">Gender</th>
                <th className="p-4 min-w-[100px] shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parents &&
                parents.map((m) => (
                  <tr key={m?._id} className="border-b border-gray-200">
                    <td className="p-4 min-w-[100px] shrink-0">{m?._id}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.name}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.contact}</td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.email}</td>
                    <td className="p-4 min-w-[100px] shrink-0">
                      {m?.children?.length || 0}
                    </td>
                    <td className="p-4 min-w-[100px] shrink-0">{m?.gender}</td>
                    <td className="p-4 min-w-[100px] shrink-0 text-center">
                      <div>
                        <Link to={"/parents-detail/parenst?id=" + m?._id}>
                          <button color="primary">
                            <AiOutlineEye size={20} />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteParent(m?._id)}
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

export default ParentsComp;
