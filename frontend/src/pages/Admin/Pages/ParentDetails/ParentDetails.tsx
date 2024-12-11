import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ParentComp from "./components/ParentComp";
import Spinner from "../../../../components/Spinner";

const ParentDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [Loading, setLoading] = useState<boolean>(false);

  const id = searchParams.get("id");
  const fetchUser = async () => {
    setLoading(true);
    await axios
      .get("/api/v2/user/getuser-single/" + id)
      .then((res) => {
        setUserData(res.data.user);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.response.data.message);
      });
  };
  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);
  return (
    <>
      {Loading ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] ">
          <Spinner />
        </div>
      ) : (
        <div className="w-11/12 mx-auto flex flex-col 900px:flex-row">
          <UpperPortion userData={userData} />
          <ParentComp userData={userData} id={id} />
        </div>
      )}
    </>
  );
};

export default ParentDetails;

const UpperPortion: React.FC = ({ userData }) => {
  return (
    <div className="w-fit mx-auto mt-12 bg-gray-100 gap-4  grid grid-cols-1  py-12 px-2 800px:px-8">
      <div className="">
        <RxAvatar size={150} />
        <div className="my-4 flex items-center">
          <h1>Name:</h1>
          <h1>{userData?.name}</h1>
        </div>
        <div className="my-4 flex items-center">
          <h1>Cnic:</h1>
          <h1>{userData?.cnic}</h1>
        </div>{" "}
        <div className="my-4 flex items-center">
          <h1>Email:</h1>
          <h1>{userData?.email}</h1>
        </div>{" "}
        <div className="my-4 flex items-center">
          <h1>contact:</h1>
          <h1>{userData?.contact}</h1>
        </div>{" "}
        <div className="my-4 flex items-center">
          <h1>Addres:</h1>
          <h1>
            {userData?.addresses?.length > 0
              ? userData?.addresses[0]?.city +
                "," +
                userData?.addresses[0]?.state
              : "unknown"}
          </h1>
        </div>{" "}
      </div>
    </div>
  );
};
