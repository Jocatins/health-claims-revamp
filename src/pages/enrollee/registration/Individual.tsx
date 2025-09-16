import { useState } from "react";
import FormHeader from "../../../components/form/FormHeader";
import Input from "../../../components/form/Input";
import ButtonT from "../../../components/form/ButttonT";
import ButtonG from "../../../components/form/ButtonG";
import FormSelect from "../../../components/form/FormSelect";

import { useGender } from "../../../hooks/resources/useGender";
import { useMaritalStatus } from "../../../hooks/resources/useMaritalStatus";

type Step = "enrollee" | "plan";

const Individual = () => {
  const [step, setStep] = useState<Step>("enrollee");


const { genders, loading: loadingGenders, error: errorGenders } = useGender();
const { statuses, loading: loadingStatuses, error: errorStatuses } = useMaritalStatus();

  const nextStep = () => {
    if (step === "enrollee") setStep("plan");
  };

  const prevStep = () => {
    if (step === "plan") setStep("enrollee");
  };
 

  return (
    <>
      <div className="p-6 bg-gray-50">
        {/* Step indicators */}
        <div className="flex items-center space-x-6 mb-6">
          <div
            className={`flex items-center space-x-2 cursor-pointer ${
              step === "enrollee"
                ? "text-[#186255] font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setStep("enrollee")}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                step === "enrollee"
                  ? "bg-[#186255] text-white"
                  : "border-gray-400"
              }`}
            >
              ✓
            </span>
            <span>Enrollee Details</span>
          </div>

          <div
            className={`flex items-center space-x-2 cursor-pointer ${
              step === "plan" ? "text-[#186255] font-semibold" : "text-gray-500"
            }`}
            onClick={() => setStep("plan")}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                step === "plan" ? "bg-[#186255] text-white" : "border-gray-400"
              }`}
            >
              ○
            </span>
            <span>Plan Details</span>
          </div>
        </div>

        {/* Step forms */}
        {step === "enrollee" && (
          <div>
            <FormHeader>Basic Info</FormHeader>
            <form className="grid grid-cols-2 gap-4 mt-6">
              <Input type="text" label="First name" />
              <Input type="text" label="Other name" />
              <Input type="text" label="Last name" />
            <FormSelect 
                label="Gender" 
                defaultValue=""
                isLoading={loadingGenders}
                error={errorGenders}
              >
                {genders?.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </FormSelect>

              <Input type="text" label="Occupation" />
                  <FormSelect 
                label="Marital Status" 
                defaultValue=""
                isLoading={loadingStatuses}
                error={errorStatuses}
              >
                {statuses?.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </FormSelect>
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
                <ButtonT>Back</ButtonT>
              </div>
              <div className="flex justify-end">
                <ButtonG type="button" onClick={nextStep}>
                  Next
                </ButtonG>
              </div>
            </form>
          </div>
        )}

        {step === "plan" && (
          <form className="grid grid-cols-2 gap-4 mt-6">
            <h2 className="col-span-2 text-lg font-semibold">Plan Details</h2>
            <Input type="text" label="Plan Name" />
            <Input type="text" label="Plan Name" />
            <Input type="text" label="Plan Name" />
            <Input type="text" label="Plan Name" />

            <div className="flex">
              <ButtonT onClick={prevStep}>Back</ButtonT>
            </div>
            <div className="flex justify-end">
              <ButtonG type="button">Submit</ButtonG>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Individual;
