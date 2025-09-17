import React from "react"
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
interface StatCardProps {
    percentage: number;
    title: string;
    bgColor: string;
    textColor: string;
    pathColor: string
}
const StatCard : React.FC<StatCardProps> = ({title,percentage,bgColor,textColor,pathColor}) => {
    return(
      
        <div className={`w-[90%] rounded-xl p-4 flex gap-5 items-center shadow ${bgColor}`}>
            <div className="w-20 h-20 mb-2">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          strokeWidth={12}
          styles={buildStyles({
            pathColor: pathColor,
            textColor: textColor,
          })}
        />
      </div>
            <span className="text-gray-600 text-sm">{title}</span>
        </div>
        
    )
};
export default StatCard