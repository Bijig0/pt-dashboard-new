import { FC } from "react";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import Main from "./main";

const AddHarga: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <h1 className="font-bold text-4xl dark:text-white">
          Hi, Welcome Back 👋
        </h1>
        <div className="my-4"></div>
        <div className="flex gap-x-4">
          <div className="">
            <Main />
          </div>
        </div>

        {/* <div>
          <Downloads />
        </div> */}
      </div>
    </NavbarSidebarLayout>
  );
};

export default AddHarga;
