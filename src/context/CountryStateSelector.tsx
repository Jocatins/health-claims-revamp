import React from "react";
import FormSelect from "../components/form/FormSelect";
import { useCountries } from "../hooks/resources/useCountries";
import { useStates } from "../hooks/resources/useStates";

interface CountryStateSelectorProps {
  selectedCountryCode: string | null;
  onCountryChange: (countryCode: string) => void;
  selectedStateId: string | null;
  onStateChange: (stateId: string) => void;
}

const CountryStateSelector: React.FC<CountryStateSelectorProps> = ({
  selectedCountryCode,
  onCountryChange,
  selectedStateId,
  onStateChange,
}) => {
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
