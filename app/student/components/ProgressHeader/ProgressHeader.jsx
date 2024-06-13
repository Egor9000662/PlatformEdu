import './ProgressHeader.scss';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ArrowRight from "../../../common/assets/controls/arrows/arrow_right.svg";
import ArrowLeft from "../../../common/assets/controls/arrows/arrow_left.svg";
import CareerIcon from "../../../student/assets/profileIcons/career.svg";
import SkillsIcon from "../../../student/assets/profileIcons/skills.svg";
import AchievementsIcon from "../../../student/assets/profileIcons/achievements.svg";
import { useReadUser } from "../../../common/apollo/localState/UserLocalState";
import { useGetByNameUserRepo } from "../../../common/repositories/UserRepository";
import { useLoadStudentRepo } from "../../../common/repositories/StudentRepository";
import getFormattedCourseName from "../../../common/template/formattedCourseName";

const ProgressHeader = () => {
    const location = useLocation();
    const { pathname } = location;

	const {currentUser, readUserFromCacheLoading} = useReadUser();
	const { data:user, userLoading,  error } = useGetByNameUserRepo(currentUser?.currentUser.username);
	const { data:studentData, loading} = useLoadStudentRepo(currentUser?.currentUser.userId);

    const courseName = getFormattedCourseName(studentData?.studentData.courses[0].name);

    if ( userLoading || loading || readUserFromCacheLoading ) {
		return null
	}

    return (
        <div className="std-profile-header-container">
            <div className="std-profile-header__std">
                <div className="std-profile-header__std-name">Привет, <span>{user.user.firstName} </span></div>
                <div className="std-profile-header__std-major major-carousel">
                    <div className='major-carousel_arrow major-carousel__previous'>
                        <img className='major-carousel_arrow_left' src={ArrowLeft} alt="ArrowLeft" />
                    </div>
                    <div className='major-carousel__major'>{courseName}</div>
                    <div className='major-carousel_arrow major-carousel__next'>
                        <img className='major-carousel_arrow_right' src={ArrowRight} alt="ArrowRight" />
                    </div>
                </div>
            </div>
            <div className="std-profile-header__options">
                <Link to='/progress/career'
                    className={pathname === '/progress/career' ?
                        'std-profile-header__option chosen-std-profile-option' :
                        'std-profile-header__option'}>
                    <div className='option-career'>
                        <div className='option-career__icon'>
                            <img className='option-icon-img' src={CareerIcon} alt="careerIcon" />
                        </div>
                        <p className='option-career__text'>Карьера</p>
                    </div>
                    <div className='option-count'><span>14</span>/40</div>
                </Link>
                <Link to='/progress/skills'
                    className={pathname === '/progress/skills' ?
                        'std-profile-header__option chosen-std-profile-option' :
                        'std-profile-header__option'}>
                    <div className='option-skills'>
                        <div className='option-skills__icon'>
                            <img className='option-icon-img' src={SkillsIcon} alt="skillsIcon" />
                        </div>
                        <p className='option-skills__text'>Навыки</p>
                    </div>
                    <div className='option-count'><span>14</span></div>
                </Link>
                <Link to='/progress/achievements'
                    className={pathname === '/progress/achievements' ?
                        'std-profile-header__option chosen-std-profile-option' :
                        'std-profile-header__option'}>
                    <div className='option-achievements'>
                        <div className='option-achievements__icon'>
                            <img className='option-icon-img' src={AchievementsIcon} alt="achievementsIcon" />
                        </div>
                        <p className='option-achievements__text'>Достижения</p>
                    </div>
                    <div className='option-count'><span>14</span>/40</div>
                </Link>
            </div>
        </div>
    );
};

export default ProgressHeader;
