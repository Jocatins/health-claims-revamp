import React from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import FormHeader from "../../../components/ui/FormHeader";

const Individual: React.FC = () => {
  return (
    <>
      <div>
        <FormHeader>Basic Info</FormHeader>
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

          <FormHeader>Next of Kin</FormHeader>
          <Input type="text" label="First name" />
          <Input type="text" label="Other name" />
          <Input type="text" label="Last name" />
          <Input type="text" label="Gender" />
          <div className="flex">
            <Button
              type="button"
              className="w-1/2 bg-green-900 text-white py-2 rounded-md hover:bg-green-800 transition-colors"
            >
              Back
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-1/2 bg-green-900 text-white py-2 rounded-md hover:bg-green-800 transition-colors"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Individual;
