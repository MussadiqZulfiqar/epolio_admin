import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import Spinner from "../../../../../components/Spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable";
import { BsDownload } from "react-icons/bs";
import { Chart } from "chart.js"; // Import Chart.js

// Register required chart.js components

const ParentComp: React.FC = ({ id, userData }) => {
  const [parents, setParents] = useState(null);
  const [again, setAgain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [allStatus, setAllStatus] = useState(null);
  const fetchAppointments = async () => {
    setLoading(true);
    await axios
      .get("/api/v2/appointment/get-parent-appointments/" + id)
      .then((response) => {
        setAllStatus(response.data.allStatus);
        setShowMore(
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

  const handleShowMore = async () => {
    const startIndex = parents.length;
    setAgain(true);
    await axios
      .get(`/api/v2/appointment/get-all-appointments?startIndex=${startIndex}`)
      .then((response) => {
        setShowMore(
          response.data.allAppointments.length >= 20 &&
            response.data.allAppointments.length !== 0
        );
        setAgain(false);
        setParents((prev) => [...prev, ...response.data.allAppointments]);
      })
      .catch((error) => {
        toast.dismiss();
        setAgain(false);
        toast.error(error.response.data.message);
      });
  };
  const getAllStatus = () => {
    const mapOfStatus = {};
    allStatus &&
      allStatus.forEach((m) => {
        const thisStatus = m.status;
        mapOfStatus[thisStatus] = (mapOfStatus[thisStatus] || 0) + 1;
      });
    return mapOfStatus;
  };

  const Keys = Object.keys(getAllStatus());
  const Values = Object.values(getAllStatus());
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Parent's Data and Latest Appointments", 14, 16);

    // Parent's Personal Information
    const parentData = userData;
    if (parentData) {
      doc.setFontSize(12);
      let yOffset = 30;

      doc.text("Parent's Name: " + parentData?.name, 14, yOffset);
      yOffset += 10;
      doc.text("CNIC: " + parentData?.cnic, 14, yOffset);
      yOffset += 10;
      doc.text("Contact: " + parentData?.contact, 14, yOffset);
      yOffset += 10;
      doc.text("Email: " + parentData?.email, 14, yOffset);
      yOffset += 10;
      doc.text("Children: " + (parentData?.children?.length || 0), 14, yOffset);
      yOffset += 15;

      // Check if there are appointments
      if (parents && parents.length === 0) {
        doc.text("No appointment history", 14, yOffset);
      } else {
        // Latest 2 Appointments
        doc.text("Latest 2 Appointments", 14, yOffset);
        yOffset += 10;

        // Creating the table for appointments
        const latestAppointments = parents.slice(0, 2); // Get the first 2 appointments
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
        yOffset += 40; // Adjusted offset after the appointment table
      }

      // Add Status Counts table to PDF
      const statusCounts = getAllStatus();
      const statusData = Object.entries(statusCounts).map(([status, count]) => [
        status,
        count,
      ]);
      // OR
      // const statusCountData = Keys.map((status, index) => [
      //   status,  // Status name
      //   Values[index], // Corresponding count
      // ]);
      doc.setFontSize(12);
      doc.text("Status Counts:", 14, yOffset);
      yOffset += 10;

      // Creating a table for status counts
      doc.autoTable({
        startY: yOffset,
        head: [["Status", "Count"]],
        body: statusData,
        theme: "grid",
        margin: { top: 10, bottom: 10, left: 14 },
        styles: { fontSize: 10 },
      });

      doc.save(`${parentData?.name}.pdf`);
    } else {
      toast.error("No parent data available.");
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
                  <th className="p-4 min-w-[100px] shrink-0">Children</th>
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
              onClick={handleShowMore}
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

export default ParentComp;
