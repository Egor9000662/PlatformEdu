import React from "react";
import FigmaIcon from "../../../student/assets/skillProgress/figma-w-background.png";
import PhotoshopIcon from "../../../student/assets/logos/photoshop.png";
import bootstrapIcon from "../../../student/assets/logos/bootstrap.png";
import cssIcon from "../../../student/assets/logos/css3.png";
import gitIcon from "../../../student/assets/logos/git.png";
import htmlIcon from "../../../student/assets/logos/html-5.png";
import JSIcon from "../../../student/assets/logos/javascript.png";
import trelloIcon from "../../../student/assets/logos/trello.png";
import sassIcon from "../../../student/assets/logos/sass.png";
import npmIcon from "../../../student/assets/logos/npm.png";
import reactIcon from "../../../student/assets/logos/react.png";
import '../SkillProgressPage/SkillProgress.scss'
import SkillHexagon from "./SkillHexagon";
import ProgressBar from "../../../common/components/ProgressBar/ProgressBar";
import {Link} from "react-router-dom";

const SkillProgress = () => {
	const skillsArr = [FigmaIcon, PhotoshopIcon, bootstrapIcon, cssIcon, gitIcon, htmlIcon, JSIcon, reactIcon, trelloIcon, sassIcon, npmIcon];
	const hexagonArray = skillsArr.map((item, index)=> ({url: item, isActive: false})) //todo дописать логику пройденных навыков курса
    return (
        <div className="student-skill-progress">
            <div className="std-sp__header">
                <div className="std-sp__skill-amount">
                    <span className="sa_open">0</span>
                    <span className="sa_total">{`/${hexagonArray.length}`}</span>
                </div>
				<ProgressBar
					item={0}
					amount={hexagonArray.length}
				></ProgressBar>
                {/*<div className="std-sp__progress-bar">*/}
                {/*    <div className="pb_full"></div>*/}
                {/*    <div className="pb_empty"></div>*/}
                {/*    <div className="pb_empty"></div>*/}
                {/*    <div className="pb_empty"></div>*/}
                {/*    <div className="pb_empty"></div>*/}
                {/*</div>*/}
                <Link
					to="/progress/resume"
					className="std-sp__resume-button"
				>
					Резюме
				</Link>
            </div>
            <div className="std-sp__progress-grids">
                {
                    hexagonArray.map((element, i) => <SkillHexagon icon={element.url} isActive={element.isActive} key={i} />)
                }
            </div>
        </div >

    )
}

export default SkillProgress;
