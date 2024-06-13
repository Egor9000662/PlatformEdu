import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/ru';
import './GroupMeeting.scss';
import '../../../admin/components/StudentsList/StudentsList.scss';
import '../../../admin/components/Student/Student.scss';
import { Button } from 'antd';
import buildCalendar from '../../components/Calendar/buildcalendar';
import dayStyles from '../../components/Calendar/stylescalendar';
import CalendarHeader from '../../components/Calendar/headercalendar';
import BackArrow from '../../components/BackArrow/BackArrow';
import HomeButton from '../../components/HomeButton/HomeButton';
import GroupMeetingModel from '../../../common/models/GroupMeetingModel';
import AddMeetingsForm from '../../components/MeetingForms/AddMeetingsForm';
import NewMeetingForm from '../../components/MeetingForms/NewMeetingForm';
import DayContent from './DayContent';
import {useLoadByRoleIdUserRepo} from "../../repositories/UserRepository";
import GroupMeetingControllers from "../../controllers/GroupMeetingControllers";
import {useLoadStudentRepo} from "../../repositories/StudentRepository";

function GroupMeeting() {
	const [value, setValue] = useState();
	const [calendar, setCalendar] = useState([]);
	const [isModalPlanMeetingsVisible, setIsModalPlanMeetingsVisible] = useState(false);
	const [isModalAddMeetingVisible, setIsModalAddMeetingVisible] = useState(false);

	const { data: role, loading: roleLoading,} = useLoadByRoleIdUserRepo(localStorage.getItem("roleId"));
	const { data: studentData, loading, error } = useLoadStudentRepo(role.user.id);

	useEffect(() => {
		const date = new Date().setHours(0, 0, 0, 0);
		setValue(moment(date))
	}, []);

	useEffect(() => {
		setCalendar(buildCalendar(value));
	}, [value]);


	// const meetingDays = groupMeetingModel.getCurrentUsersMeetingDates();
	const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

	if (loading || roleLoading) {
		return null;
	}

	const meetingControllers = new GroupMeetingControllers(role);
	const adminOrTeacher = meetingControllers.adminOrTeacher;

	return (
		<div className="meetingPage">
			<div className="callHeader">
				{!isDesktop && <div className="callHeader__btn">
					<BackArrow
						pathName={adminOrTeacher ? '/groups' : null}
					/>
				</div>}
				{adminOrTeacher && <div className="callHeader__btn">
					<BackArrow
						pathName='/groups'
					/>
				</div>}
				<div className="callHeader__item">
					<h1 className="callTitle">Созвоны</h1>
					{adminOrTeacher ? (
						<Button
							type="primary"
							className="callHeader__btn__add"
							onClick={() => setIsModalPlanMeetingsVisible(true)}
						>
							Запланировать
						</Button>
					 ) : (
					 	<div className="callHeader__btn_right">
					 		{!isDesktop && <HomeButton />}
					 		{!isDesktop && <HomeButton />}
					 	</div>
					 )}
				</div>
			</div>
			{/*<AddMeetingsForm*/}
			{/*	isModalAddMeetingsVisible={isModalPlanMeetingsVisible}*/}
			{/*	setIsModalAddMeetingsVisible={setIsModalPlanMeetingsVisible}*/}
			{/*	groupMeetingModel={groupMeetingModel}*/}
			{/*/>*/}
			<div className="dateSection">
				<div className="todayDate">
					<p className="todayText">Сегодня</p>
					<Moment className="date" locale="ru" format="DD MMMM, YYYY">
						{new Date()}
					</Moment>
				</div>
				<div className="monthCarousel">
					<CalendarHeader value={value || moment()} setValue={setValue} />
				</div>
			</div>
			<div className="dayCarousel">
				<div className="month">
					{calendar.map((month) => (
						<div className="weekday_container" key={month + Math.random()}>
							{month.map((day) => (
								<div
									className={
									// meetingDays.includes(day.format('DD-MM-YYYY'))
									// 	? "weekday weekday_meeting"
									// 	:
										"weekday"
								}
									onClick={() => setValue(day)}
									key={`${month}-${day}`}
								>
									<div className={dayStyles(day, value)}>
										{' '}
										<div className="dayNumber">
											{day
												.locale('ru')
												.format('D')
												.toString()}{' '}
										</div>
										<div className="dayName">
											{day
												.locale('ru')
												.format('dd')
												.toString()}
										</div>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
			{/*<DayContent*/}
			{/*	value={value}*/}
			{/*	groupMeetingModel={groupMeetingModel}*/}
			{/*	adminOrTeacher={adminOrTeacher}*/}
			{/*	meetingDays={meetingDays}*/}
			{/*	setIsModalAddMeetingVisible={setIsModalAddMeetingVisible}*/}
			{/*/>*/}
			{adminOrTeacher && (
					<Button
						className="add-button"
						onClick={() => setIsModalAddMeetingVisible(true)}
						style={{ boxShadow: 'none' }}
					>
						Добавить встречу
					</Button>
				)
			}
			{/*<NewMeetingForm*/}
			{/*	isModalAddMeetingVisible={isModalAddMeetingVisible}*/}
			{/*	setIsModalAddMeetingVisible={setIsModalAddMeetingVisible}*/}
			{/*	groupMeetingModel={groupMeetingModel}*/}
			{/*	meetingId={value?.format('DD-MM-YYYY')}*/}
			{/*/>*/}
		</div >
	);
}

export default GroupMeeting;
