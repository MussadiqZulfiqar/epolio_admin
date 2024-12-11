import React from "react";
import { BsPeople } from "react-icons/bs";
import { FaPeopleArrows, FaSyringe } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import ContentCard from "../components/Cards";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import DashBoardGraph from "../components/DashBoardGraph";
import { jsPDF } from "jspdf";
import { BiDownload } from "react-icons/bi";
import "jspdf-autotable";
const Content: React.FC = ({
  latestfive,
  appointmentStatus,
  appointmentDates,
  workerNumber,
  AppointmentNumber,
  CenterNumber,
  ParentNumber,
}) => {
  const approvedStatus = appointmentStatus.filter(
    (m) => m?.status === "Approve"
  );
  const pendingStatus = appointmentStatus.filter(
    (m) => m?.status === "pending"
  );
  const attendedStatus = appointmentStatus.filter(
    (m) => m?.status === "Attended"
  );

  // Function to generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Dashboard Data", 14, 16);

    // Adding some space after the title
    let yOffset = 30; // Start after the title

    // Appointment Status Table
    doc.setFontSize(12);
    doc.text("Appointment Status Summary", 14, yOffset);
    yOffset += 10; // Add space between title and the total appointment text

    // Total Appointments
    doc.text(
      `Total Appointments = ${AppointmentNumber.toString()}`,
      14,
      yOffset
    );

    yOffset += 10; // Added spacing before the table
    // Table Header for Appointment Status Summary
    doc.autoTable({
      startY: yOffset,
      head: [["Status", "Count"]],
      body: [
        ["Pending", pendingStatus.length],
        ["Attended", attendedStatus.length],
        ["Approved", approvedStatus.length],
      ],
      theme: "grid",
      margin: { top: 10, bottom: 10, left: 14 },
      styles: { fontSize: 10 },
    });

    // Adjust yOffset after the table
    yOffset = doc.lastAutoTable.finalY + 15; // Added some space after the table

    // Adding the statistics for workers, parents, centers, and appointments
    doc.text("Dashboard Summary", 14, yOffset);
    yOffset += 10; // Space between section title and table
    doc.text(
      `Total Users = ${(workerNumber + ParentNumber).toString()}`,
      14,
      yOffset
    );
    yOffset += 10;
    // Create the Dashboard Summary Table
    doc.autoTable({
      startY: yOffset,
      head: [["Category", "Count"]],
      body: [
        ["Total Workers", workerNumber],
        ["Total Parents", ParentNumber],
        ["Total Centers", CenterNumber],
        ["Total Appointments", AppointmentNumber],
      ],
      theme: "grid",
      margin: { top: 10, bottom: 10, left: 14 },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save("dashboard-data.pdf");
  };

  return (
    <div className="flex-1 overflow-hidden 800px:px-8 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
          DASHBOARD
        </h1>

        {/* Add a button for downloading PDF */}
        <button
          onClick={downloadPDF}
          className="bg-primary text-white rounded-full 800px:p-4 p-2 mb-6"
        >
          <BiDownload size={23} className="shrink-0 text-lg" />
        </button>
      </div>

      <div className="grid gap-8 grid-cols-1 600px:grid-cols-2 mb-8 900px:grid-cols-3 1000px:grid-cols-4">
        <ContentCard
          icon={FaPeopleArrows}
          link={"/admin-add-worker"}
          text={"Total Workers"}
          total={workerNumber && workerNumber}
        />
        <ContentCard
          icon={BsPeople}
          link={"/admin-parents"}
          text={"Parents"}
          total={ParentNumber && ParentNumber}
        />
        <ContentCard
          icon={SlCalender}
          link={"/admin-appointments"}
          text={"Appointments"}
          total={AppointmentNumber && AppointmentNumber}
        />
        <ContentCard
          icon={FaSyringe}
          link={"/admin-vaccination"}
          text={"Centers"}
          total={CenterNumber && CenterNumber}
        />
      </div>

      <DashBoardGraph
        appointmentStatus={appointmentStatus}
        appointmentDates={appointmentDates}
      />

      <h1 className="text-heading-md uppercase 800px:text-heading-2xl font-medium tracking-wider select-none mb-6">
        Appointments
      </h1>

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
            {latestfive &&
              latestfive.map((m) => (
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
    </div>
  );
};

export default Content;
