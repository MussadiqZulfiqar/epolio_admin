import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetUser } from "./../../Redux/slices/UserSlice.js";
import { useNavigate } from "react-router-dom";
interface userDataProps {
  email: string;
  password: string;
}
const LoginPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<userDataProps>({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);
  const handleformsubmision = async (e: FormEvent) => {
    e.preventDefault();
    await axios
      .post("/api/v2/user/login-user", {
        email: userData.email,
        password: userData.password,
      })
      .then((response) => {
        if (response.data.user.role === "admin") {
          dispatch(GetUser());
        } else {
          toast.error("You are not allowed to access this page");
        }
      })
      .catch((e) => {
        toast.dismiss();
        toast.error(e.response.data.message);
      });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full 600px:max-w-md px-10 py-6 rounded-md bg-white shadow-md">
        <h1 className="text-center text-heading-md font-semibold">
          Admin Login
        </h1>
        <form
          onSubmit={handleformsubmision}
          action=""
          className=" mt-8 flex flex-col gap-3 "
        >
          {Object.keys(userData).map((m) => (
            <div className="flex flex-col gap-1">
              <h1 className="text-sm capitalize">{m}</h1>
              <input
                type={m === "password" ? "password" : "text"}
                id={m}
                name={m}
                value={userData[m as keyof userDataProps]}
                onChange={handleInputChange}
                className="w-full rounded-md shadow-md border border-gray-50 focus:border-DarkBlue p-2 focus:ring-DarkBlue focus:outline-none focus:border focus:appearance-none "
              />
            </div>
          ))}

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id={"remember"}
              className="rounded-full w-4 h-4  border-gray-200 appearance-none checked:bg-DarkBlue focus:ring-transparent checked:ring-transparent"
              name=""
            />
            <label htmlFor="remember" className="text-gray-600 select-none">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="w-full hover:bg-primary hover:text-white bg-primary/10 p-2 rounded-md shadow-md"
          >
            <h1 className="tracking-widest uppercase font-semibold">Login</h1>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
