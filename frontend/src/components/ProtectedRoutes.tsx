import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface singleUser {
  user: {
    loading: boolean;
    isAuthenticated: boolean;
    user: {
      role: string;
    };
  };
}
interface UserRoutesProps {
  children: ReactNode;
}
const UserProtectRoutes: React.FC<UserRoutesProps> = ({ children }) => {
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     const isPageRefres = localStorage.getItem("reloaded") === "true";

  //     const handleUpload = () => {
  //       if ((children as React.ReactElement).key !== "user-dashboard") {
  //         localStorage.setItem("reloaded", "true");
  //       }
  //     };

  //     if (
  //       isPageRefres &&
  //       (children as React.ReactElement).key !== "user-dashboard"
  //     ) {
  //       dispatch(getAllPatients());
  //       // dispatch(getAllReports());
  //       dispatch(getAllDoctors());

  //       localStorage.removeItem("reloaded");
  //     }
  //     window.addEventListener("beforeunload", handleUpload);
  //     return () => window.removeEventListener("beforeunload", handleUpload);
  //   }, [dispatch, children]);
  const { loading, user, isAuthenticated } = useSelector(
    (state: singleUser) => state.user
  );
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div>...Loading</div>
      </div>
    );
  } else if (!loading && !isAuthenticated) {
    return <Navigate to={"/"} replace />;
  } else if (isAuthenticated && user.role === "admin") {
    return children;
  }
};

export default UserProtectRoutes;
