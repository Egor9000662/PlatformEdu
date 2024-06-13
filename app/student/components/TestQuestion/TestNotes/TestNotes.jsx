import React from 'react';
import "./TestNotes.scss";
import infoLogo from "../../../assets/controls/info.svg";


function TestNotes(props) {
    return (
        <div className='test-notes-wrapper'>
            <div className="test-notes">
                <img src={infoLogo} alt="информация" className="test-notes__img" />
                <p className="test-notes__text">{props.notes}</p>
            </div>
        </div>
    );
}

export default TestNotes;