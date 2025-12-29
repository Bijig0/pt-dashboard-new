import { FC } from "react";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import Grid from "./grid";
import MetadataSidebar from "./metadata-sidebar";
import RekapanProvider from "./rekapan-provider";

const FirstOne: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <h1 className="font-bold text-4xl dark:text-white">
          Hi, Welcome Back 👋
        </h1>
        <div className="my-4"></div>
        <RekapanProvider>
          <div className="flex gap-x-4">
            <div className="">
              {/* <SynchronizeCompanyNamesModal /> */}
              <MetadataSidebar />
            </div>
            <div className="flex-1">
              <Grid />
            </div>
          </div>
        </RekapanProvider>
        {/* <div>
          <Downloads />
        </div> */}
      </div>
    </NavbarSidebarLayout>
  );
};

export default FirstOne;
