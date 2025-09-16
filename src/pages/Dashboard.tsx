
import React from "react";
import DashboardCard from "../components/ui/DashboardCard";


const Dashboard: React.FC = () => {
  return (
    <div className="p-6 grid grid-cols-2 grid-rows-2 gap-6">
      <DashboardCard
      indicatorColor="bg-blue-100 text-blue-600"
        value={125}
        percentage="2.5% Last Month"
        changeColor="text-red-500"
        title="New Enrollees"
      />
      <DashboardCard
      indicatorColor="bg-red-100 text-red-600"
        value={150}
       percentage="2.5% Last Month"
       changeColor="text-green-500"
         title="Expired Plan"
      />
      <DashboardCard
      indicatorColor="bg-blue-100 text-blue-600"
        value={100}
       percentage="1.56% Last Month"
        changeColor="text-red-500"
        title="Renewed Plan"
      />
      <DashboardCard
      indicatorColor="bg-orange-100 text-orange-600"
        value={125}
        title="Total Healthcare Providers"
      />
    </div>
  );
};

export default Dashboard;