import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GeoApiOptions, GEO_API_URL } from '../../api';

const Search = ({ onSearchChange }) => {
    const [search, setSearch] = useState(null);

    const loadOptions = (inputValue) => {
        return fetch(`${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${inputValue}`, GeoApiOptions)
            .then((response) => response.json())
            .then((response) => {
                // Log the response to see its structure
                console.log(response);

                // Ensure that 'data' exists in the response and it's an array
                if (response.data && Array.isArray(response.data)) {
                    return {
                        options: response.data.map((city) => {
                            return {
                                value: `${city.latitude} ${city.longitude}`,
                                label: `${city.name}, ${city.countryCode}`,
                            };
                        }),
                    };
                } else {
                    // Return an empty array if the data isn't as expected
                    console.warn("Unexpected response format");
                    return { options: [] };
                }
            })
            .catch((err) => {
                console.error(err);
                // Return an empty array in case of any error
                return { options: [] };
            });
    };

    function handleOnChange(searchData) {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    return (
        <AsyncPaginate
            placeholder="Search for city"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    );
}

export default Search;
