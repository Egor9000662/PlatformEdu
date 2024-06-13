import React from 'react';

const OptgroupOfCountry = ({ name, regions }) => {
    return (
        <optgroup label={name}>
            {
                regions.map(region => (
                    <option value={region.name} key={region.id}>{region.name}</option>
                ))
            }
        </optgroup>
    );
};

export default OptgroupOfCountry;