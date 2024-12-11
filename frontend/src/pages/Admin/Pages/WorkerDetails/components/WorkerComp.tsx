import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import Spinner from "../../../../../components/Spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable";
import { BsDownload } from "react-icons/bs";

const WorkerComp: React.FC = ({ id, userData }) => {
  const [parents, setParents] = useState(null);
  const [again, setagain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowmore] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    await axios
      .get("/api/v2/appointment/get-worker-appointments/" + id)
      .then((response) => {
        setShowmore(
          response.data.allAppointments.length >= 20 &&
            response.data.allAppointments.length !== 0
        );
        setLoading(false);
        setParents(response.data.allAppointments);
      })
      .catch((error) => {
        setLoading(false);
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    if (id) {
      fetchAppointments();
    }
  }, [id]);

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
        setParents((prev) => [...prev, ...response.data.allAppointments]);
      })
      .catch((error) => {
        toast.dismiss();
        setagain(false);
        toast.error(error.response.data.message);
      });
  };

  // Function to generate PDF with Worker’s details and latest 2 appointments
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Worker's Data and Latest Appointments", 14, 16);

    // Worker’s Personal Information
    const workerData = userData; // Use the passed userData for personal information
    if (workerData) {
      doc.setFontSize(12);
      let yOffset = 30;

      doc.text("Worker's Name: " + workerData?.name, 14, yOffset);
      yOffset += 10;
      doc.text("CNIC: " + workerData?.cnic, 14, yOffset);
      yOffset += 10;
      doc.text("Contact: " + workerData?.contact, 14, yOffset);
      yOffset += 10;
      doc.text("Email: " + workerData?.email, 14, yOffset);
      yOffset += 10;

      // Check if there are appointments
      if (parents && parents.length === 0) {
        doc.text("No appointment history", 14, yOffset);
      } else {
        // Latest 2 Appointments
        doc.text("Latest Appointments", 14, yOffset);
        yOffset += 10;

        // Creating the table for appointments
        const latestAppointments = parents.slice(0, 5);
        const appointmentData = latestAppointments.map((item) => [
          item?._id,
          item?.status,
          item?.requested_by?.name,
          item?.requested_by?.contact,
          item?.requested_by?.email,
        ]);

        doc.autoTable({
          startY: yOffset,
          head: [["ID", "Status", "Name", "Contact", "Email"]],
          body: appointmentData,
          theme: "grid",
          margin: { top: 10, bottom: 10, left: 14 },
          styles: { fontSize: 10 },
        });
      }

      // Save the PDF
      doc.save(`${workerData.name}.pdf`);
    } else {
      toast.error("No worker data available.");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="py-12 px-2 flex-1 overflow-hidden 800px:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-heading-lg mb-4">Appointments</h1>

            <button
              onClick={downloadPDF}
              className="bg-primary text-white rounded-full p-4 mb-6"
            >
              <BsDownload size={23} className="shrink-0" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-nowrap bg-white border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="text-left bg-gray-100 border-b border-gray-300">
                  <th className="p-4 min-w-[100px] shrink-0">ID</th>
                  <th className="p-4 min-w-[100px] shrink-0">Name</th>
                  <th className="p-4 min-w-[100px] shrink-0">Contact</th>
                  <th className="p-4 min-w-[100px] shrink-0">Email</th>
                  <th className="p-4 min-w-[100px] shrink-0">Childrens</th>
                  <th className="p-4 min-w-[100px] shrink-0">Status</th>
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
                      <td className="p-4 min-w-[100px] shrink-0">
                        {m?.status}
                      </td>
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

          {again ? (
            <Spinner />
          ) : showMore ? (
            <button
              onClick={handleshowMore}
              className="my-8 bg-primary text-white font-bold rounded-full px-6 py-3 shadow-md"
            >
              Show More
            </button>
          ) : null}
        </div>
      )}
    </>
  );
};

export default WorkerComp;
