import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollTop";

const AppWrapper = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet /> {/* This is required to see anything! */}
    </>
  );
};

export default AppWrapper;