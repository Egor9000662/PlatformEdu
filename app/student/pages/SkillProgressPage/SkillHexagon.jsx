import React from "react";
import '../SkillProgressPage/SkillHexagon.scss';

const SkillHexagon = ({ icon, isActive }) => {
    const HexagonClassName = `pg__cell${isActive ? " pg__cell_in-progress" : ""}`;
    return (
        <div className={HexagonClassName}>
            <div className="pg__skill-container">
                <div className="pg__skill">
                    <img className="pg__skill_logo" src={icon} alt="skill-icon" />
                </div>
            </div>
        </div>
    )
}

export default SkillHexagon;
