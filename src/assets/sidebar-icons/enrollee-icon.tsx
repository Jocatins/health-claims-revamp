import React from "react";

interface EnrolleeLogoProps {
  className?: string;
}

const EnrolleeIcon: React.FC<EnrolleeLogoProps> = ({className= ""}) => {
  return (
    <svg
      width="28"
      height="26"
      viewBox="0 0 28 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.4609 11.8286C10.3493 11.8179 10.2152 11.8179 10.0924 11.8286C7.43459 11.7433 5.32397 9.66548 5.32397 7.1081C5.32397 4.49745 7.5351 2.37695 10.2822 2.37695C13.0182 2.37695 15.2405 4.49745 15.2405 7.1081C15.2294 9.66548 13.1187 11.7433 10.4609 11.8286Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M18.5572 4.50781C20.7236 4.50781 22.4657 6.18076 22.4657 8.23732C22.4657 10.2513 20.7906 11.8922 18.7023 11.9668C18.613 11.9562 18.5125 11.9562 18.412 11.9668"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.87732 15.7613C2.17484 17.4876 2.17484 20.3007 4.87732 22.0162C7.94833 23.9769 12.9848 23.9769 16.0558 22.0162C18.7583 20.29 18.7583 17.4769 16.0558 15.7613C12.9959 13.8113 7.95949 13.8113 4.87732 15.7613Z"
        stroke="currentColor"
       strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M20.7125 21.5575C21.5166 21.3977 22.2759 21.0887 22.9013 20.6305C24.6434 19.3837 24.6434 17.3272 22.9013 16.0805C22.2871 15.6329 21.5389 15.3346 20.746 15.1641"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EnrolleeIcon;
