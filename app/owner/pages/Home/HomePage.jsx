import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Divider } from 'antd';
import './HomePage.scss';
import Input from '../../../common/components/Input/Input';
import MagnifierIcon from '../../../common/assets/controls/icon-magnifier.svg';
import LogoutButton from '../../../common/components/LogoutButton/LogoutButton';
import School from '../../../owner/components/School/School';
import SchoolModel from '../../models/SchoolModel';

function HomePage({ schoolsStore, schoolModel }) {
    const [searchName, setSearchName] = useState('');
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        setSchools(schoolModel.filterSchools(searchName));
    }, [schoolsStore.schools, searchName]);

    return (
        <div className="home-container">
            <div className="home-controls">
                <div className="logoutbtn-wrapper">
                    <LogoutButton />
                </div>
            </div>
            <Divider orientation="center" id='divider'>
                <span id='divider-text'>
                    Школы
                </span>
            </Divider>
            <div className="home-content">
                <div className="searchInput">
                    <Input
                        className="searchInput-input"
                        placeholder="Название школы"
                        onChange={(event) => {
                            setSearchName(event.target.value);
                        }}
                    />
                    <img
                        className="searchInput-icon"
                        src={MagnifierIcon}
                        alt="magnifier-icon"
                    ></img>
                </div>

                <div className="schools-list">
                    {schools && schools
                        .map((school) => (
                            <div key={school.id}>
                                <School
                                    school={school}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default inject(({ auth, schoolsStore, oneSchoolStore }) => {
    useEffect(() => {
        schoolsStore.loadSchoolsData();
    }, [schoolsStore.isLoaded]);

    const schoolModel = new SchoolModel(
        auth, oneSchoolStore, schoolsStore
    );
    return {
        schoolsStore,
        oneSchoolStore,
        schoolModel,
    };
})(observer(HomePage));