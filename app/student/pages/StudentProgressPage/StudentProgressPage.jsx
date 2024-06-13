import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import './StudentProgressPage.scss';
import ProgressHeader from '../../components/ProgressHeader/ProgressHeader';
import Skills from '../../components/Skills/Skills';
import Resume from '../../components/Resume/Resume';
import AchievementsList from '../../components/Achievement/AchievementsList/AchievementsList';
import SkillProgress from "../SkillProgressPage/SkillProgress";

const StudentProgressPage = ({ step4Ref }) => {
    return (
        <div className='profileLink'>
            <section className='std-profile-container'>
                <div className="std-profile-header" ref={step4Ref}>
                    <ProgressHeader />
                </div>
                <div className="std-profile-content">
                    <Switch>
                        <Route exact path='/progress/career' >
							<SkillProgress/>
                        </Route>
                        <Route exact path='/progress/resume' >
							<Resume />
                        </Route>
						{/*<Route exact path='/progress/skills' >*/}
						{/*	<Skills />*/}
						{/*</Route>*/}
                        {/*<Route exact path='/progress/achievements' >*/}
                        {/*    <AchievementsList student={student} />*/}
                        {/*</Route>*/}
                    </Switch>
                </div>
            </section>
        </div>
    )
};

export default StudentProgressPage
// inject(({ auth, usersStore }) => {
//     const { profile } = auth;
//     const student = usersStore.getUser(profile.uid);
//     useEffect(() => {
//         student.loadData(profile.uid);
//     }, [profile, student.isLoaded]);
//
//     return {
//         student,
//     };
// })(observer(StudentProgressPage));
