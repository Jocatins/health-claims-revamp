
import {
  PieChart,Pie,Cell,ResponsiveContainer,Legend,Tooltip,} from "recharts";

const claimsData = [
  { name: "Disputed", value: 20, color: "#22c55e" },  
  { name: "Approved", value: 30, color: "#3b82f6" },  
  { name: "Pending", value: 25, color: "#facc15" },   
  { name: "Rejected", value: 25, color: "#ef4444" },  
];
const ClaimsChart = () => {
  return (
    <div className="bg-white p-6 shadow w-[100%] ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">All Claims</h2>
         <a href="#" className="text-[#DC2626]-600 text-sm font-medium">
            See All Claims
          </a>
      </div>
       <div className="flex items-center gap-4">
          <select className="bg-[#DC2626]-100 border rounded-md px-3 py-1 text-sm">
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
      <div className="grid grid-cols-2 items-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-semibold">0</p>
          <p className="text-gray-500">Claimed Amount</p>
        </div>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={claimsData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={100}
                paddingAngle={3}
              >
                {claimsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default ClaimsChart;
