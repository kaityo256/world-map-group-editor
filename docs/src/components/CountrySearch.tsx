import { useEffect, useMemo, useState } from "react";
import type { Country } from "../data/types";
import { searchCountries } from "../utils/countries";

type CountrySearchProps = {
  countries: Country[];
  selectedCountry?: Country;
  resetKey?: number;
  onSelect: (country: Country) => void;
  onQueryChange?: () => void;
};

export function CountrySearch({ countries, selectedCountry, resetKey, onSelect, onQueryChange }: CountrySearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");
  }, [resetKey]);

  const matches = useMemo(() => searchCountries(countries, query, 10), [countries, query]);

  return (
    <div className="country-search">
      <input
        type="search"
        value={query}
        placeholder="Search countries..."
        onChange={(event) => {
          setQuery(event.target.value);
          onQueryChange?.();
        }}
      />
      {selectedCountry ? <div className="selected-candidate">Selected: {countryLabel(selectedCountry)}</div> : null}
      {matches.length > 0 ? (
        <div className="candidate-list" role="listbox">
          {matches.map((country) => (
            <button
              type="button"
              key={country.id}
              className="candidate-option"
              onClick={() => {
                onSelect(country);
                setQuery(country.name);
              }}
            >
              {countryLabel(country)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function countryLabel(country: Country): string {
  return country.isoCode ? `${country.name} (${country.isoCode})` : country.name;
}
