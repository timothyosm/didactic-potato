import React from "react";
import Meta from "./../components/Meta";
import DashboardSection from "./../components/DashboardSection";
import { requireAuth } from "./../util/auth";
import CreateSession from "../components/CreateSession";

function DashboardPage(props) {
  return (
    <>
      <Meta title="Dashboard" />
      <CreateSession />
      <DashboardSection />
    </>
  );
}

export default requireAuth(DashboardPage);
