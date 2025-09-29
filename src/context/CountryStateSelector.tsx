import React from "react";
import FormSelect from "../components/form/FormSelect";

interface CountryStateSelectorProps {
  selectedCountryCode: string | null;
  onCountryChange: (countryCode: string) => void;
  selectedStateId: string | null;
  onStateChange: (stateId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countries: any[]; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  states: any[];
  countriesLoading: boolean;
  statesLoading: boolean;
  countriesError: string | null;
  statesError: string | null;
}

const CountryStateSelector: React.FC<CountryStateSelectorProps> = ({
  selectedCountryCode,
  onCountryChange,
  selectedStateId,
  onStateChange,
  countries, // Use the data from props
  states,
  countriesLoading,
  statesLoading,
  countriesError,
  statesError,
}) => {


  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* Country Selector */}
        <div>
          <FormSelect
            label="Country"
            value={selectedCountryCode || ""}
            onChange={(e) => onCountryChange(e.target.value)}
            isLoading={countriesLoading}
            error={countriesError || undefined}
          >
            <option value="">Select a country</option>
            {countries.map((country, index) => (
              <option key={country.alpha2 ?? `country-${index}`} value={country.alpha2}>
                {country.name}
              </option>
            ))}
          </FormSelect>
        </div>

        {/* State Selector */}
        <div>
          <FormSelect
            label="State"
            value={selectedStateId || ""}
            onChange={(e) => onStateChange(e.target.value)}
            isLoading={statesLoading}
            error={statesError || undefined}
            disabled={!selectedCountryCode}
          >
            <option value="">Select a state</option>
            {states.map((state, index) => (
              <option key={state.id ?? `state-${index}`} value={state.id}>
                {state.name}
              </option>
            ))}
          </FormSelect>
        </div>
      </div>
    </>
  );
};

export default CountryStateSelector;