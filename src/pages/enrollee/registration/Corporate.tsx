import React from "react";
import Input from "../../../components/form/Input";

import FormHeader from "../../../components/form/FormHeader";
import ButtonT from "../../../components/form/ButttonT";
import ButtonG from "../../../components/form/ButtonG";

const Corporate: React.FC = () => {
  return (
    <>
      <div>
        <FormHeader>Corporate Info</FormHeader>
        <form className="grid grid-cols-2 gap-4 mt-6">
          <Input type="text" label="First name" />
          <Input type="text" label="Other name" />
          <Input type="text" label="Last name" />
          <Input type="text" label="Gender" />
          <Input type="text" label="Occupation" />
          <Input type="text" label="Marital Status" />
          <Input type="text" label="Email" />
          <Input type="text" label="Date of Birth" />
          <Input type="text" label="Phone Number" />
          <Input type="text" label="Full Address" />

       
          <div className="flex">
       
            <ButtonT>Back</ButtonT>
          </div>
          <div className="flex justify-end">
            
            <ButtonG>Submit</ButtonG>
          </div>
        </form>
      </div>
    </>
  );
};

export default Corporate;
