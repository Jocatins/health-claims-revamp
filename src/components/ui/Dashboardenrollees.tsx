import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
interface DashboardCardProps {
  title: string;
  value: number;
  percentage?: string; 
  changeColor?: string; 
  indicatorColor: string;
}