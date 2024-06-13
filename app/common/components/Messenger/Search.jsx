import React, { useState } from "react";
import Input from '../../components/Input/Input';
import MagnifierIcon from '../../assets/controls/icon-magnifier.svg';
import './Search.scss';


const Search = ({ username, setUsername }) => {

    return (
        <div className="search-container">
            <div className="messengerSearch">
                <Input
                    className="searchInput-input"
                    placeholder="Имя, фамилия"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
                <img
                    className="messenger_search_icon"
                    src={MagnifierIcon}
                    alt="magnifier-icon"
                ></img>
            </div>
        </div>
    );
};

export default Search;
