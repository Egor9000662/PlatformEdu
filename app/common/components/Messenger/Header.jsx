import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import './Header.scss';
import BackArrow from '../BackArrow/BackArrow';
import QueueIcon from '../../assets/controls/icon-join-queue.svg';
import backButton from '../../../common/assets/controls/back-btn.svg';
import roundArrow from '../../../common/assets/controls/arrows/round_arrow.svg';
import capitalizeFirstLetter from "../../../common/template/capitalizeFirstLetter";

const Header = ({ sidebarHidden, setSidebarHidden, auth, groupsStore, mentorsStore }) => {
    const [groupIndex, setGroupIndex] = useState(0);
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const arrGroups = auth.role === 'student' ? auth.profile.courses : Object.keys(mentorsStore.getMentor(auth.user.uid).groups);

    useEffect(() => {
        if (groupsStore.isLoaded) {
            auth.role === 'student' ?
                auth.setGroupByCourse(arrGroups[groupIndex]) :
                auth.setGroupByGroupId(arrGroups[groupIndex]);
        }
    }, [groupIndex, groupsStore.isLoaded]);

    if (!groupsStore.isLoaded || !mentorsStore.isLoaded) {
        return null;
    }

    const lastName = Boolean(groupIndex === arrGroups.length - 1);
    const firstName = Boolean(groupIndex === 0);

    const showPrev = () => {
        setGroupIndex(groupIndex - 1);
    }
    const showNext = () => {
        setGroupIndex(groupIndex + 1);
    };

    return (
        <header className="messenger-header">
            <div className="messenger-header-backBlock">
                <div className={sidebarHidden || (isDesktop && auth.role === 'student') ? 'arrow-desktop hidden-arrow' : 'arrow-desktop'}>
                    <BackArrow pathName={'/groups'} />
                </div>
                {sidebarHidden &&
                    <div className='arrow-mobile'>
                        <button type="button" onClick={() => setSidebarHidden(false)} className="round-button">
                            <img src={backButton} alt="back" />
                        </button>
                    </div>
                }
            </div>

            <div className={isDesktop ? "header-desktop" : "gamePage-course-header"}>
                <button
                    className={firstName ? 'hidden-arrow' : 'gamePage-course-container__button'}
                    onClick={showPrev}
                >
                    <img src={roundArrow} className="gamePage-course-container__arrow gamePage-course-container__arrow_left" />
                </button>
                <h2 className="gamePage-courseName">{
                    auth.role === 'student' ?
                        capitalizeFirstLetter(arrGroups[groupIndex]) :
                        `${capitalizeFirstLetter(mentorsStore.getMentor(auth.user.uid).groups[arrGroups[groupIndex]].course)}: ${capitalizeFirstLetter(arrGroups[groupIndex])}`
                }</h2>
                <button
                    className={lastName ? 'hidden-arrow' : 'gamePage-course-container__button'}
                    onClick={showNext}
                >
                    <img src={roundArrow} className="gamePage-course-container__arrow" />
                </button>
            </div>

            {/* {auth.role === 'teacher' && 
            <div className="messenger-queue__btn">
                <Link to="/tasks-queue">
                    <button type="button" className="round-button">
                        <img src={QueueIcon} alt="Join queue" />
                    </button>
                </Link>
            </div>
            } */}
        </header>
    )
}

export default inject(({ auth, groupsStore, mentorsStore }) => {
    useEffect(() => {
        mentorsStore.loadData();
    }, []);
    useEffect(() => {
        groupsStore.loadData();
    }, [groupsStore.isLoaded]);

    return { auth, groupsStore, mentorsStore };
})(observer(Header));
