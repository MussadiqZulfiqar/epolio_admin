import React from "react";
import { IconBaseProps } from "react-icons";
import { Link } from "react-router-dom";

interface ContentCardProps {
  icon: React.ComponentType<IconBaseProps>;
  total: number;
  text: string;
  link: string;
}
const ContentCard: React.FC<ContentCardProps> = ({
  icon: Icon,
  link,
  total,
  text,
}) => {
  return (
    <Link
      to={link}
      className="w-full group  overflow-hidden relative  hover:scale-[1.1] duration-500 ease-in-out transition-all flex items-center justify-between bg-white rounded-md shadow-md h-full px-6 py-12"
    >
      <div className="flex z-[10] transition-all duration-300 ease-in-out flex-col mb-2 gap-6 ">
        <Icon size={30} />
        <h1 className="text-heading-md">{text}</h1>
      </div>
      <h1 className="text-center">{total}</h1>
    </Link>
  );
};
export default ContentCard;
