import React from "react";
import { useForm } from "react-hook-form";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const enrolleeData = {
  monthly: [
    { name: "Jan", individual: 40, employer: 60 },
    { name: "Feb", individual: 20, employer: 30 },
    { name: "Mar", individual: 50, employer: 10 },
    { name: "Apr", individual: 30, employer: 60 },
    { name: "May", individual: 40, employer: 20 },
    { name: "Jun", individual: 25, employer: 40 },
    { name: "Jul", individual: 12, employer: 9 },
    { name: "Jul", individual: 10, employer: 5 },
    { name: "Aug", individual: 30, employer: 20 },
    { name: "Sep", individual: 40, employer: 30 },
    { name: "Oct", individual: 50, employer: 40 },
    { name: "Nov", individual: 60, employer: 50 },
    { name: "Dec", individual: 30, employer: 20 },
  ],
  yearly: [
    { name: "Week 1", individual: 10, employer: 5 },
    { name: "Week 2", individual: 15, employer: 20 },
    { name: "Week 3", individual: 5, employer: 10 },
    { name: "Week 4", individual: 12, employer: 8 },
  ],
  biannually: [
    { name: "2021", individual: 200, employer: 300 },
    { name: "2022", individual: 250, employer: 400 },
    { name: "2023", individual: 300, employer: 350 },
    { name: "2024", individual: 280, employer: 370 },
  ],
};
type FormValues = {
  period: "monthly" | "yearly" | "biannually";
};

const NumberOfEnrollees = () => {
  const { register, watch } = useForm<FormValues>({
    defaultValues: { period: "monthly" },
  });
  const selectedPeriod = watch("period");
  return (
    <div className="bg-white p-4  shadow w-[100%]">
      <div className="flex justify-between items-start gap-40 mb-4">
        <h2 className="text-lg font-semibold">Number of Enrollees-128k</h2>
    
        <select
          {...register("period")}
          className="bg-green-100 border rounded-md px-2 py-1 text-sm">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="biannually">Biannually</option>
        </select>
       
      </div>
      <div className="flex gap-20 mb-2 justify-between text-sm items-right">
        <div className="flex  gap-1"> 
           <span className="text-red-500 text-xs">↓2.5%</span>
          <span className="text-gray-400 text-xs">last month</span>
        </div>
        <div className="flex gap-20 mb-2 text-sm items-right flex-end">
        <div className="flex  gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#2C9A5B" }}></span>
          <span className="font-medium">Individual Enrollee</span>
        </div>
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#A7D7A9" }}></span>
          <span className="font-medium">Employer Enrollee</span>
        </div>
      </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={enrolleeData[selectedPeriod]}  barGap={0}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
  domain={[0, 100]}   
  ticks={[0, 20, 40, 60, 80, 100]}/>
          <Tooltip />
          <Bar dataKey="individual" fill="#2C9A5B" name="Individual Enrollee" />
          <Bar dataKey="employer" fill="#A7D7A9" name="Employer Enrollee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default NumberOfEnrollees;
