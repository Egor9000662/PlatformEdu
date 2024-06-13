import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { Select } from 'antd';
import selectCheckmark from '../../../assets/controls/select_checkmark.svg';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import './MentorForm.scss';
import MentorFormModel from '../../../models/MentorFormModel';
import FormsModel from '../../../models/FormsModel';

const MentorForm = ({
	setIsMentorFormModalVisible,
	currentCourses,
	mentors,
	setLoaded,
	mentorFormModel,
	formsModel,
	isEdit = false,
}) => {

	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [chosenCourses, setChosenCourses] = useState([]);
	const [companies, setCompanies] = useState('');
	const [experience, setExperience] = useState('');
	const [education, setEducation] = useState('');
	const [specialization, setSpecialization] = useState('');
	const [password, setPassword] = useState('');

	const [nameError, setNameError] = useState(false);
	const [surnameError, setSurnameError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [nameErrorMessage, setNameErrorMessage] =
		useState('Не жалей символов');
	const [surnameErrorMessage, setSurnameErrorMessage] =
		useState('Не жалей символов');
	const [emailErrorMessage, setEmailErrorMessage] = useState(
		'Email не может быть пустым'
	);
	const [chosenCoursesErrorMessage, setChosenCoursesErrorMessage] =
		useState('');
	const [companiesErrorMessage, setCompaniesErrorMessage] = useState('');
	const [experienceErrorMessage, setExperienceErrorMessage] = useState('');
	const [educationErrorMessage, setEducationErrorMessage] = useState('');
	const [specializationErrorMessage, setSpecializationErrorMessage] =
		useState('');
	const [passwordErrorMessage, setPasswordErrorMesssage] = useState(
		'Пароль не может быть пустым'
	);
	const [passwordShown, setPasswordShown] = useState(false);
	const [error, setError] = useState('');

	async function handleSubmit(e) {
		e.preventDefault();
		const mentorObj = {
			name: `${name} ${surname}`,
			courses: chosenCourses,
			email, companies, experience, education, specialization, password,
		};
		const error = await mentorFormModel.submitMentorForm(mentorObj, mentors);
		if (error) {
			setError(error);
		} else {
			setError('');
			setIsMentorFormModalVisible(false);
			setLoaded(false);
		}
	}

	const nameHandler = (e) => {
		e.target.name === "name" ? setName(e.target.value) : setSurname(e.target.value);
		const error = formsModel.validateName(e.target.value, e.target.name);
		if (error) {
			e.target.name === "name" ? setNameError(true) : setSurnameError(true);
			e.target.name === "name" ? setNameErrorMessage(error) : setSurnameErrorMessage(error);

		} else {
			e.target.name === "name" ? setNameError(false) : setSurnameError(false);
		}
	};

	const emailHandler = (e) => {
		setEmail(e.target.value.trim());
		const errors = formsModel.validateEmail(e.target.value);
		if (errors !== '') {
			setEmailError(true);
			setEmailErrorMessage(errors);
		} else {
			setEmailError(false);
		}
	};

	const passwordHandler = (e) => {
		setPassword(e.target.value.trim());
		const errors = formsModel.validatePassword(e.target.value);
		if (errors !== '') {
			setPasswordError(true);
			setPasswordErrorMesssage(errors);
		} else {
			setPasswordError(false);
		}
	};

	const handleChosenCourses = (chosenCourses) => {
		setError('');
		setChosenCourses(chosenCourses);
		if (!chosenCourses.length) {
			setChosenCoursesErrorMessage(
				'Необходимо выбрать хотя бы один курс'
			);
		} else {
			setChosenCoursesErrorMessage('');
		}
	};

	const companiesHandler = (e) => {
		setError('');
		setCompanies(e.target.value);
		const error = mentorFormModel.validateInput(e.target.value, e.target.name);
		setCompaniesErrorMessage(error);
	};

	const experienceHandler = (e) => {
		setError('');
		setExperience(e.target.value);
		const error = mentorFormModel.validateInput(e.target.value, e.target.name);
		setExperienceErrorMessage(error);
	};

	const educationHandler = (e) => {
		setError('');
		setEducation(e.target.value);
		const error = mentorFormModel.validateInput(e.target.value, e.target.name);
		setEducationErrorMessage(error);
	}

	const specializationHandler = (e) => {
		setError('');
		setSpecialization(e.target.value);
		const error = mentorFormModel.validateInput(e.target.value, e.target.name);
		setSpecializationErrorMessage(error);
	};

	const blurHandler = (e) => {
		switch (e.target.name) {
			case 'companies':
				setCompaniesErrorMessage('');
				break;
			case 'experience':
				setExperienceErrorMessage('');
				break;
			case 'education':
				setEducationErrorMessage('');
				break;
			case 'specialization':
				setSpecializationErrorMessage('');
				break;;
			default:
				console.log('Что-то по дефолту');
		}
	};

	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	return (
		<form onSubmit={handleSubmit} className="form-addMentor">
			<h1 className="authForm__title">{isEdit ? 'Отредактируем данные' : 'Добавим ментора'}</h1>
			<span className="error-addMentor">{error}</span>

			{nameError && (
				<div className="authForm__error-message">
					{nameErrorMessage}
				</div>
			)}
			<Input
				className="authForm__input"
				onChange={(e) => nameHandler(e)}
				value={name}
				onBlur={(e) => blurHandler(e)}
				name="name"
				type="text"
				placeholder="Имя*"
				minLength="2"
				maxLength="20"
				required
			/>

			{surnameError && (
				<div className="authForm__error-message">
					{surnameErrorMessage}
				</div>
			)}

			<Input
				className="authForm__input"
				onChange={(e) => nameHandler(e)}
				value={surname}
				onBlur={(e) => blurHandler(e)}
				name="surname"
				type="text"
				placeholder="Фамилия*"
				minLength="2"
				maxLength="20"
			/>

			{emailError && (
				<div className="authForm__error-message">
					{emailErrorMessage}
				</div>
			)}

			<Input
				className="authForm__input"
				onChange={(e) => emailHandler(e)}
				value={email}
				onBlur={(e) => blurHandler(e)}
				name="email"
				type="email"
				placeholder="Почта *"
				minLength="6"
				required
			/>

			<div className="authForm__error-message">
				{chosenCoursesErrorMessage}
			</div>

			<div className="addMentor-selectContainer">
				<Select
					mode="multiple"
					id="course"
					onChange={handleChosenCourses}
					placeholder="Может вести курсы *"
				// value={chosenCourses}
				>
					{currentCourses.map((course) => (
						<Select.Option key={course} value={course}>
							{course}
						</Select.Option>
					))}
				</Select>
				<img src={selectCheckmark} className="addMentor-checkMark" />
			</div>

			<div className="authForm__error-message">
				{companiesErrorMessage}
			</div>

			<Input
				className="authForm__input"
				onChange={(e) => companiesHandler(e)}
				value={companies}
				onBlur={(e) => blurHandler(e)}
				name="companies"
				type="text"
				placeholder="Компании"
				minLength="2"
				maxLength="30"
			/>

			<div className="authForm__error-message">
				{experienceErrorMessage}
			</div>

			<Input
				className="authForm__input"
				onChange={(e) => experienceHandler(e)}
				value={experience}
				onBlur={(e) => blurHandler(e)}
				name="experience"
				type="text"
				placeholder="Опыт работы"
				minLength="2"
				maxLength="30"
			/>

			<div className="authForm__error-message">
				{educationErrorMessage}
			</div>

			<Input
				className="authForm__input"
				onChange={(e) => educationHandler(e)}
				value={education}
				onBlur={(e) => blurHandler(e)}
				name="education"
				type="text"
				placeholder="Образование"
				minLength="2"
				maxLength="30"
			/>

			<div className="authForm__error-message">
				{specializationErrorMessage}
			</div>

			<Input
				className="authForm__input"
				onChange={(e) => specializationHandler(e)}
				value={specialization}
				onBlur={(e) => blurHandler(e)}
				name="specialization"
				type="text"
				placeholder="Специальность"
				minLength="2"
				maxLength="30"
			/>

			{passwordError && (
				<div className="authForm__error-message">
					{passwordErrorMessage}
				</div>
			)}

			<Input
				className="authForm__input"
				onChange={(e) => passwordHandler(e)}
				value={password}
				onBlur={(e) => blurHandler(e)}
				name="password"
				type={passwordShown ? 'text' : 'password'}
				placeholder="Пароль *"
				minLength="5"
				maxLength="15"
				required
			/>

			<div className="authForm__controls">
				<button type="button" onClick={togglePassword}>
					<div className="authForm__text">
						{passwordShown ? 'Скрыть пароль' : 'Показать пароль'}
					</div>
				</button>
				<Button
					className="signup-button"
					type="submit"
					text={isEdit ? "Сохранить" : "Зарегистрировать"}
				></Button>
			</div>
		</form>
	);
};

export default inject(({ coursesStore, oneMentorStore }) => {
	const { courses, loadDataCourse, isLoaded } = coursesStore;
	const { addMentor } = oneMentorStore;
	const [currentCourses, setCurrentCourses] = useState([]);
	useEffect(() => {
		loadDataCourse();
	}, [isLoaded]);

	const mentorFormModel = new MentorFormModel(oneMentorStore, coursesStore);
	const formsModel = new FormsModel();

	useEffect(() => {
		const currentCourses = mentorFormModel.formatCourses();
		setCurrentCourses(currentCourses);
	}, [courses]);

	return {
		currentCourses,
		addMentor,
		mentorFormModel,
		formsModel,
	};
})(observer(MentorForm));
