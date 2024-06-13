import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import './Resume.scss';
import BackArrow from '../../../common/components/BackArrow/BackArrow';
import defaultAvatar from '../../../common/assets/defaultAvatars/frontend-avatar.png';
import HomeButon from '../../../common/components/HomeButton/HomeButton';
import { useReadUser } from "../../../common/apollo/localState/UserLocalState";
import { useGetByNameUserRepo } from "../../../common/repositories/UserRepository";
import { useLoadStudentRepo } from "../../../common/repositories/StudentRepository";
import getFormattedCourseName from "../../../common/template/formattedCourseName";
const userSkills = [
	{
		block: `HTML CSS`,
		skill: 'Отличные знания HTML/CSS/SASS',
	},
	{
		block: `HTML CSS`,
		skill: 'Работа с макетами в Figma',
	},
	{
		block: `HTML CSS`,
		skill: 'Уверенная работа с SVG',
	},
	{
		block: `HTML CSS`,
		skill: 'Кроссбраузерная вёрстка',
	},
	{ block: `JS`, skill: 'Уверенный навык использования Javascript' },
	{
		block: `React`,
		skill: 'Работа с Gulp, NPM',
	},
	{
		block: `React`,
		skill: 'Освоение новых технологий за короткие сроки',
	},
	{
		block: `React`,
		skill: 'Опыт работы с React.js и MobX',
	},
];

const Resume = ({ avatarURL, groupLesson }) => {

	const {currentUser, readUserFromCacheLoading} = useReadUser();
	const { data: user, userLoading, error } = useGetByNameUserRepo(currentUser?.currentUser.username);
	const { data: studentData, loading } = useLoadStudentRepo(user.user.id);

	const [resumeAvatar, setResumeAvatar] = useState(defaultAvatar);
	const [passedBlocks, setPassedBlocks] = useState([]);
	const [numbOfProjects, setNumbOfProjects] = useState(0);
	const getNumberOfProjects = () => {
		const blocks = [];
		if (groupLesson > 8) {
			setNumbOfProjects(1);
		}
		if (groupLesson > 13) {
			setNumbOfProjects(2);
			blocks.push('HTML CSS');
		}
		if (groupLesson > 25) {
			setNumbOfProjects(3);
			blocks.push('JS');
		}
		if (groupLesson > 34) {
			setNumbOfProjects(4);
			blocks.push('React');
		}
		setPassedBlocks(blocks);
	};

	useEffect(() => {
		getNumberOfProjects();
	}, [groupLesson]);

	useEffect(() => {
		const resumeAvatar = localStorage.getItem('resume-avatar');
		resumeAvatar
			? setResumeAvatar(resumeAvatar)
			: setResumeAvatar(avatarURL);
	}, []);

	const updateResumeAvatar = (e) => {
		if (!e.target.files) {
			return;
		}
		const avatar = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			const avatarLink = reader.result;
			localStorage.setItem('resume-avatar', avatarLink);
			setResumeAvatar(avatarLink);
		};
		reader.readAsDataURL(avatar);
	};

	const checkPassed = (block) => passedBlocks.some((item) => item === block);
	const courseName = getFormattedCourseName(studentData.studentData.courses[0].name);

	if (userLoading || loading || readUserFromCacheLoading) return null;

	return (
		<div className="resumeWrap">
			<div className="resumeWrap-header">
				<div className="resumeWrap-header-btn">
					<BackArrow pathName={'/profile'} />
				</div>
				<h1 className="resumeWrap-header__h">Моё резюме</h1>
				<div className="resumeWrap-header-btn">
					<HomeButon />
				</div>
			</div>
			<Card className="resumeWrap-body__card">
				<section className="resumeWrap-body__card-user">
					<div>
						<p className="resumeWrap-body__card-userName">
							{user.user.firstName}
						</p>
						<p className="resumeWrap-body__card-userSpecialty">{`${courseName}-разработчик`}</p>
						<div className="resumeWrap-body__card-item">
							<p className="resumeWrap-body__card-userExperience">
								Опыт:
								<span className="resumeWrap-body__card-userSkills resumeWrap-body__card-text">
									{' '}
									менее 1 года
								</span>
							</p>
							<p className="resumeWrap-body__card-userProjects">
								Реализовано проектов:
								<span className="resumeWrap-body__card-userSkills resumeWrap-body__card-text">
									{' '}
									{numbOfProjects}{' '}
								</span>
							</p>
							<p
								className={
									numbOfProjects > 0
										? 'resumeWrap-body__card-userSkills resumeWrap-body__card-text'
										: 'resumeWrap-body__card-userUnable resumeWrap-body__card-text'
								}
							>
								Опыт работы в команде
							</p>
						</div>
					</div>
					<input
						type="file"
						id="upload"
						accept=".jpg, .jpeg, .png, .svg"
						onChange={updateResumeAvatar}
						name="uploadImg"
						hidden
					/>
					<label htmlFor="upload">
						<img
							className="resumeWrap-body__card-user-avatar"
							src={resumeAvatar ? resumeAvatar : defaultAvatar}
							alt="avatar"
						/>
					</label>
				</section>
				<div className="resumeWrap-body__card-userKeySkillsTitle">
					Ключевые навыки:
				</div>
				<ul className="resumeWrap-body__card-userKeySkillsList">
					{userSkills &&
						userSkills.map((item) => {
							return (
								<li
									key={item.skill}
									className={
										checkPassed(item.block)
											? 'resumeWrap-body__card-userSkills'
											: 'resumeWrap-body__card-userUnable'
									}
								>
									{item.skill}
								</li>
							);
						})}
				</ul>
			</Card>
			<button type="button" className="resumeWrap-body__card-btnDownload">
				Скачать
			</button>
		</div>
	);
};

export default Resume;
