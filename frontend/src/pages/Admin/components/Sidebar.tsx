import React from "react";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { BsClock, BsPeople } from "react-icons/bs";
import { FaBaby, FaChild } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineDashboardCustomize, MdVaccines } from "react-icons/md";
import { RiParentLine } from "react-icons/ri";
import { Link } from "react-router-dom";
interface SidebarProps {
  active: number;
}
const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  return (
    <div className="h-screen overflow-y-scroll sticky top-0 left-0  bg-white w-fit py-12">
      <div className="mb-8">
        <h1 className="px-6  uppercase text-heading-md 800px:text-heading-xl">
          E-Polio
        </h1>
      </div>
      <Link
        to={"/dashboard"}
        className={`cursor-pointer flex items-center px-6 py-6 mb-4 gap-2 text-sm 800px:text-base ${
          active == 1 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <MdOutlineDashboardCustomize size={25} />
        <h1 className="hidden 800px:block">Dashboard</h1>
      </Link>
      <Link
        to={"/admin-attendance"}
        className={`cursor-pointer flex items-center px-6 py-6 mb-4 gap-2 text-sm 800px:text-base ${
          active == 10 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <AiOutlineCheckSquare size={25} />
        <h1 className="hidden 800px:block">Attendance</h1>
      </Link>
      <Link
        to={"/admin-appointments"}
        className={`cursor-pointer flex items-center px-6 py-6 mb-4 gap-2 text-sm 800px:text-base ${
          active == 2 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <BsClock size={25} />
        <h1 className="hidden 800px:block">Appointments</h1>
      </Link>
      <Link
        to={"/admin-data"}
        className={`cursor-pointer flex items-center px-6 py-6 mb-4 gap-2 text-sm 800px:text-base ${
          active == 20 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <BsPeople size={25} />
        <h1 className="hidden 800px:block">Data</h1>
      </Link>

      <Link
        to={"/admin-add-worker"}
        className={`cursor-pointer flex items-center px-6 py-6 mb-4 gap-2 text-sm 800px:text-base ${
          active == 3 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <BsPeople size={25} />
        <h1 className="hidden 800px:block">Workers</h1>
      </Link>

      <Link
        to={"/admin-parents"}
        className={`cursor-pointer flex items-center px-6 py-6 mb-4 gap-2 text-sm 800px:text-base ${
          active == 4 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <RiParentLine size={25} />
        <h1 className="hidden 800px:block">Parents</h1>
      </Link>
      <Link
        to={"/admin-vaccination"}
        className={`cursor-pointer flex items-center px-6 py-6   gap-2 text-sm 800px:text-base ${
          active == 7 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <MdVaccines size={25} />
        <h1 className="hidden 800px:block">Centers</h1>
      </Link>
      <Link
        to={"/admin-daycare"}
        className={`cursor-pointer flex items-center px-6 py-6 mb-4 gap-2 text-sm 800px:text-base ${
          active == 5 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <FaBaby size={25} />
        <h1 className="hidden 800px:block">Day care</h1>
      </Link>
      <Link
        to={"/admin-areas"}
        className={`cursor-pointer flex items-center px-6 py-6   gap-2 text-sm 800px:text-base ${
          active == 6 ? "bg-primary text-white" : "bg-white"
        }`}
      >
        <FaLocationDot size={25} />
        <h1 className="hidden 800px:block">Areas</h1>
      </Link>
    </div>
  );
};

export default Sidebar;
