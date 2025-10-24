/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import FormHeader from "../../../components/form/FormHeader";
import Input from "../../../components/form/Input";
import ButtonT from "../../../components/form/ButttonT";
import ButtonG from "../../../components/form/ButtonG";
import FormSelect from "../../../components/form/FormSelect";

import AdvancedDatePicker from "../../../components/form/ADatePicker";
import PhoneNumberInput from "../../../components/form/PhoneInput";

import FileUpload from "../../../components/form/FileUpload";
import CountryStateSelector from "../../../context/CountryStateSelector";

import { useMemberTypes } from "../../../hooks/resources/useMemberTypes";
import { useBillingFrequency } from "../../../hooks/resources/useBillingFrequency";

import { useCountries } from "../../../hooks/resources/useCountries";
import { useStates } from "../../../hooks/resources/useStates";
import { useEnrolleeForm } from "../../../hooks/useEnrolleeForm";
import { useNavigate } from "react-router-dom";
import { useStepValidator } from "../../../constant/stepValidatior";
import type { AppDispatch, RootState } from "../../../services/store/store";
import { fetchCorporateEntities } from "../../../services/thunks/corporateThunk";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenders, fetchMaritalStatuses, fetchRelationships, fetchEnrolleeType, fetchPlanTypes, fetchEnrolleeClass } from "../../../services/thunks/resourcesThunk";
// import { usePlanTypeById } from "../../../hooks/resources/usePlanTypeById";


export type Step = "enrollee" | "plan";

const Individual = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [step, setStep] = useState<Step>("enrollee");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { data: genders, loading: loadingGenders, error: errorGenders } = useSelector((state: RootState) => state.gender);
  const { data: relations, loading: loadingRelations, error: errorRelations } = useSelector((state: RootState) => state.relations);
  const { data: maritalStatus, loading: loadingMaritalStatus, error: errorMaritalStatus } = useSelector((state: RootState) => state.maritalStatus);
  const { data: enrolleeType, loading: loadingEnrolleeType, error: errorEnrolleeType } = useSelector((state: RootState) => state.enrolleeType);
  const { data: enrolleeClass, loading: loadingEnrolleeClass, error: errorEnrolleeClass } = useSelector((state: RootState) => state.enrolleeClass);
  const {data: planType, loading: loadingPlanType, error: errorPlanType} = useSelector((state: RootState) => state.planType);
  const { corporates, loading: loadingCorporates, error: errorCorporates} = useSelector((state: RootState) => state.corporate);


  const { validateEnrolleeStep } = useStepValidator();


  // react - form hooks
  const {
    methods: {
      register,
      formState: { errors },
      watch,
      setValue,
      trigger,
    },
    handleFormSubmit,
    isSubmitting,
  } = useEnrolleeForm();
  // ----------------------
  const handleValidateEnrolleeStep = () => {
    validateEnrolleeStep(trigger, setStep);
  };
  // const watchedPlanTypeId = watch("planTypeId");

  const {
    memberTypes,
    loading: loadingMemberTypes,
    error: errorMemberTypes,
  } = useMemberTypes();
  const {
    billingFrequency,
    loading: loadingBillingFrequency,
    error: errorBillingFrequency,
  } = useBillingFrequency();


  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null
  );
  const {
    countries,
    loading: countriesLoading,
    error: countriesError,
  } = useCountries();
  const {
    states,
    loading: statesLoading,
    error: statesError,
  } = useStates(selectedCountryCode);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  // --------------------------

  const [_selectedType, setSelectedType] = useState("");

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setSelectedStateId(null);

    // Find the country name and set the form value
    const selectedCountry = countries.find((c) => c.alpha2 === countryCode);
    if (selectedCountry) {
      setValue("nationality", selectedCountry.name); // Set country name
      console.log("Country set to:", selectedCountry.name);
    }

    // Clear state when country changes
    setValue("stateOfResidence", "");
  };

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);

    // Find the state name and set the form value
    const selectedState = states.find((s) => s.id === stateId);
    if (selectedState) {
      setValue("stateOfResidence", selectedState.name);
      console.log("State set to:", selectedState.name);
    }
  };

  const watchedEnrolleeType = watch("enrolleeTypeId");
  const selectedEnrolleeTypeName = enrolleeType.find(
    (et) => et.id === watchedEnrolleeType
  )?.name;

  // const nextStep = () => {
  //   if (step === "enrollee") setStep("plan");
  // };

  const prevStep = () => {
    if (step === "plan") setStep("enrollee");
  };
  // const handleDateChange = (date: Date | null) => {
  //   console.log("Date selected:", date);
  //   setDateOfBirth(date);
  //   if (date) {
  //     setValue("dateOfBirth", date, {
  //       shouldValidate: true,
  //     });
  //     console.log("Date set in form:", date);
  //   } else {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     setValue("dateOfBirth", null as any, {
  //       shouldValidate: true,
  //     });
  //   }
  // };
  //
  const handleDateChange = (date: Date | null) => {
  console.log("Date selected:", date);
  setDateOfBirth(date);
  if (date) {
    // Convert Date to ISO string
    const dateString = date.toISOString();
    setValue("dateOfBirth", dateString, {
      shouldValidate: true,
    });
    console.log("Date set in form:", dateString);
  } else {
    setValue("dateOfBirth", "", {
      shouldValidate: true,
    });
  }
};
  useEffect(() => {
    dispatch(fetchGenders());
    dispatch(fetchMaritalStatuses());
    dispatch(fetchRelationships());
    dispatch(fetchEnrolleeType());
    dispatch(fetchEnrolleeClass());
    dispatch(fetchPlanTypes());
    if (corporates.length === 0) {
      dispatch(fetchCorporateEntities());
    }
  }, [dispatch, corporates.length]);

  const backNavigation = () => {
    navigate("/enrollee/enrollees");
  };

  return (
    <>
      <div className="p-6 bg-gray-50">
        {/* Step indicators */}
        <div className="flex items-center space-x-6 mb-6">
          <div
            className={`flex items-center space-x-2 cursor-pointer ${step === "enrollee"
                ? "text-[#186255] font-semibold"
                : "text-gray-500"
              }`}
            onClick={() => setStep("enrollee")}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${step === "enrollee"
                  ? "bg-[#186255] text-white"
                  : "border-gray-400"
                }`}
            >
              ✓
            </span>
            <span>Enrollee Details</span>
          </div>

          <div
            className={`flex items-center space-x-2 cursor-pointer ${step === "plan" ? "text-[#186255] font-semibold" : "text-gray-500"
              }`}
            onClick={() => step === "plan" && setStep("plan")}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${step === "plan" ? "bg-[#186255] text-white" : "border-gray-400"
                }`}
            >
              {step === "plan" ? "✓" : "○"}
            </span>
            <span>Plan Details</span>
          </div>
        </div>

        {/* Single form wrapper */}
        <form onSubmit={handleFormSubmit} className="mt-6">
          {step === "enrollee" && (
            <div>
              <FormHeader>Basic Info</FormHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Input
                  type="text"
                  label="First name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={errors.firstName?.message}
                />
                <Input
                  type="text"
                  label="Other name"
                  {...register("otherName")}
                />
                <Input
                  type="text"
                  label="Last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  error={errors.lastName?.message}
                />

                <FormSelect
                  label="Gender"
                  defaultValue=""
                  isLoading={loadingGenders}
                  error={errorGenders}
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                >
                  {genders?.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </FormSelect>

                <Input
                  type="text"
                  label="Occupation"
                  {...register("occupation", {
                    required: "Occupation",
                  })}
                  error={errors.occupation?.message}
                />

                <FormSelect
                  label="Marital Status"
                  {...register("maritalStatus")}
                  error={errorMaritalStatus}
                  isLoading={loadingMaritalStatus}
                  defaultValue=""
                >
                  {maritalStatus?.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </FormSelect>

                <Input
                  type="email"
                  label="Email"
                  {...register("emailAddress", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.emailAddress?.message}
                />

                <AdvancedDatePicker
                  label="Date of Birth"
                  selected={dateOfBirth}
                  onChange={handleDateChange}
                />

                <PhoneNumberInput
                  register={register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  error={errors.phoneNumber?.message}
                />

                <Input
                  type="text"
                  label="Full Address"
                  {...register("fullAddress", {
                    required: "Address is required",
                  })}
                  error={errors?.fullAddress?.message}
                />

                <CountryStateSelector
                  onCountryChange={handleCountryChange}
                  selectedCountryCode={selectedCountryCode}
                  selectedStateId={selectedStateId}
                  onStateChange={handleStateChange}
                  countries={countries} // Pass the data
                  states={states} // Pass the data
                  countriesLoading={countriesLoading}
                  statesLoading={statesLoading}
                  countriesError={countriesError}
                  statesError={statesError}
                />

                <Input
                  type="text"
                  label="Ethnicity"
                  {...register("ethnicity")}
                  error={errors.ethnicity?.message}
                />

                <FormSelect
                  label="Enrollee Type"
                  {...register("enrolleeTypeId")}
                  error={errorEnrolleeType}
                  isLoading={loadingEnrolleeType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setValue("enrolleeTypeId", e.target.value);
                  }}
                  defaultValue=""
                >
                  {enrolleeType?.map((et) => (
                    <option key={et.id} value={et.id}>
                      {et.name}
                    </option>
                  ))}
                </FormSelect>

                {watchedEnrolleeType &&
                  selectedEnrolleeTypeName !== "Individual" && (
                    <>
                      <FormSelect
                        label="Enrollee Class"
                        {...register("enrolleeClassId")}
                        error={errorEnrolleeClass}
                        isLoading={loadingEnrolleeClass}
                        defaultValue=""
                      >
                        {enrolleeClass?.map((ec) => (
                          <option key={ec.id} value={ec.id}>
                            {ec.name}
                          </option>
                        ))}
                      </FormSelect>

                      <FormSelect
                        label="Beneficiary"
                        {...register("corporateId")}
                        error={errorCorporates}
                        isLoading={loadingCorporates}
                        defaultValue=""
                      >
                        <option value="">Select a corporate</option>
                        {Array.isArray(corporates) &&
                          corporates.map((corp) => (
                            <option key={corp.id} value={corp.id}>
                              {corp.companyName}
                            </option>
                          ))}
                      </FormSelect>
                    </>
                  )}

                <FormSelect
                  label="Plan Types"
                  {...register("planTypeId")}
                  error={errorPlanType}
                  isLoading={loadingPlanType}
                  defaultValue=""
                >
                  {planType?.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </FormSelect>

                <FileUpload
                  register={register("photo")}
                  error={errors.photo?.message}
                />

                <FormHeader>Next of Kin</FormHeader>
                <Input
                  type="text"
                  label="Full name"
                  {...register("nextOfKin.fullName", {
                    required: "Full Name is required",
                  })}
                  error={errors.nextOfKin?.fullName?.message}
                />
                <FormSelect
                  label="Relationship"
                  {...register("nextOfKin.relationship")}
                  error={errorRelations}
                  isLoading={loadingRelations}
                  defaultValue=""
                >
                  {relations?.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </FormSelect>

                <PhoneNumberInput
                  register={register("nextOfKin.phoneNumber", {
                    required: "NOK Phone number is required",
                  })}
                  error={errors.nextOfKin?.phoneNumber?.message}
                />

                <Input
                  type="text"
                  label="Home Address"
                  {...register("nextOfKin.homeAddress", {
                    required: "Home Address is required",
                  })}
                  error={errors.nextOfKin?.homeAddress?.message}
                />

                <div className="flex">
                  <ButtonT type="button" onClick={backNavigation}>
                    Back
                  </ButtonT>
                </div>
                <div className="flex justify-end">
                  <ButtonG type="button" onClick={handleValidateEnrolleeStep}>
                    Next
                  </ButtonG>
                </div>
              </div>
            </div>
          )}

          {step === "plan" && (
            <div>
              <FormHeader>Plan Details</FormHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <FormSelect
                  label="Membership Type"
                  isLoading={loadingMemberTypes}
                  error={errorMemberTypes}
                  defaultValue=""
                >
                  {Array.from(
                    new Map(memberTypes?.map((mt) => [mt.id, mt])).values()
                  ).map((mt, index) => (
                    <option key={mt.id || `mt-${index}`} value={mt.id}>
                      {mt.name}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  label="Billing Frequency"
                  isLoading={loadingBillingFrequency}
                  error={errorBillingFrequency}
                  defaultValue=""
                >
                  {billingFrequency?.map((bf: string) => (
                    <option key={bf} value={bf}>
                      {bf}
                    </option>
                  ))}
                </FormSelect>

                <Input type="number" label="Amount" />

                <Input type="number" label="Discount" />

                <Input type="text" label="Benefit" />

                <Input type="text" label="Referral Number" />

                <div className="flex">
                  <ButtonT type="button" onClick={prevStep}>
                    Back
                  </ButtonT>
                </div>
                <div className="flex justify-end">
                  <ButtonG
                    type="submit"
                    disabled={isSubmitting}
                    className={
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </ButtonG>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Individual;


