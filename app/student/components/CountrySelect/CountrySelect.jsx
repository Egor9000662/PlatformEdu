import React from 'react';
import OptgroupOfCountry from './OptgroupOfCountry';
import "./CountrySelect.scss";

const CountrySelect = ({ countries, value, handleCountryName }) => {
    return (
        <div>
            <select className='select' onChange={handleCountryName}>
                <option value={value} className="option">{value}</option>
                {
                    countries.map(country => (
                        <OptgroupOfCountry name={country.name} regions={country.areas} key={country.id} />
                    ))
                }
            </select>
        </div>
    );
};

export default CountrySelect;