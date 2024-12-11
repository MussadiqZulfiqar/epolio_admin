import Sidebar from "../../components/Sidebar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../../components/Spinner";

const Data: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar active={20} />
      <DataComp />
    </div>
  );
};

export default Data;

const DataComp: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch records data
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v2/user/admin-all-records");
      setRecords(response.data.records);
      setShowMore(response.data.records.length >= 20);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Load more records data
  const handleShowMore = async () => {
    const startIndex = records.length;
    setIsLoadingMore(true);
    try {
      const response = await axios.get(
        `/api/v2/user/admin-all-records?startIndex=${startIndex}`
      );
      setRecords((prev) => [...prev, ...response.data.records]);
      setShowMore(response.data.records.length >= 20);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to load more data");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Delete a record
  const deleteRecord = async (id: string) => {
    try {
      await axios.delete("/api/v2/user/delet-parent", { data: { id } });
      setRecords((prev) => prev.filter((r) => r._id !== id));
      toast.success("Record deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  };

  // Open modal with record details
  const openModal = (record: any) => {
    setModalData(record);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="flex-1 overflow-hidden py-12 800px:px-8 600px:px-2">
      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Records
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-nowrap bg-white border border-gray-300 rounded-lg shadow">
            <thead>
              <tr className="text-left bg-gray-100 border-b border-gray-300">
                <th className="p-4 min-w-[100px] shrink-0">CNIC</th>
                <th className="p-4 min-w-[100px] shrink-0">Vaccinated</th>
                <th className="p-4 min-w-[100px] shrink-0">Date</th>
                <th className="p-4 min-w-[100px] shrink-0">
                  Number of Children
                </th>
                <th className="p-4 min-w-[100px] shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record?._id} className="border-b border-gray-200">
                  <td className="p-4 min-w-[100px] shrink-0">{record?.cnic}</td>
                  <td className="p-4 min-w-[100px] shrink-0">
                    {record?.vaccinated ? "Yes" : "No"}
                  </td>
                  <td className="p-4 min-w-[100px] shrink-0">
                    {record?.date &&
                      record?.date.length > 0 &&
                      record?.date
                        .slice(-1)
                        ?.map((d: string, index: number) => (
                          <div key={index}>
                            {new Date(d).toLocaleDateString()}
                          </div>
                        ))}
                  </td>
                  <td className="p-4 min-w-[100px] shrink-0">
                    {record?.numberOfChildren}
                  </td>
                  <td className="p-4 min-w-[100px] shrink-0 text-center">
                    <div>
                      <button onClick={() => openModal(record)} color="primary">
                        <AiOutlineEye size={20} />
                      </button>
                      <button
                        onClick={() => deleteRecord(record?._id)}
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
      {isLoadingMore ? (
        <Spinner />
      ) : showMore ? (
        <button
          onClick={handleShowMore}
          className="my-8 bg-primary text-white font-bold rounded-full px-6 py-3 shadow-md"
        >
          Show More
        </button>
      ) : null}

      {/* Modal for displaying detailed data */}
      {isModalOpen && modalData && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2 className="text-xl font-bold mb-4">Record Details</h2>
            <p>
              <strong>CNIC:</strong> {modalData?.cnic}
            </p>
            <p>
              <strong>Vaccinated:</strong>{" "}
              {modalData?.vaccinated ? "Yes" : "No"}
            </p>
            <p>
              <strong>Date:</strong>
            </p>
            {modalData?.date?.map((d: string, index: number) => (
              <div key={index}>{new Date(d).toLocaleDateString()}</div>
            ))}
            <p>
              <strong>Number of Children:</strong> {modalData?.numberOfChildren}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
