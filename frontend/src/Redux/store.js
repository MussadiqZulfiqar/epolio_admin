import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/UserSlice";
const Store = configureStore({
  reducer: {
    user: user,
  },
});
export default Store;
