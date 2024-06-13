import React, { useState, useEffect } from 'react';
import './Onboarding.scss';
import { Step } from './Step';
import arrow1 from '../../assets/onboarding/arrow-down-1.png';
import arrow2 from '../../assets/onboarding/arrow-down-2.png';
import arrow3 from '../../assets/onboarding/arrow-down-3.png';
import arrow6 from '../../assets/onboarding/arrow-down-6.png';
import { inject, observer } from 'mobx-react';

function Onboarding({
	active,
	setActive,
	step2Ref,
	step3Ref,
	step4Ref,
	step5Ref,
	step6Ref,
	onboardingRef,
	gamePagePath,
	isDesktop,
	studentData,
}) {

	const linkToStep3 = isDesktop ? '/progress/career' : '/profile';
	const step4selector = isDesktop ? step4Ref : step2Ref;

	const steps = [
		{
			number: 1,
			selector: '',
			text: `Привет!\nМеня зовут Кот.\nДавай отправимся на космическую орбиту?`,
			linkTo: gamePagePath,
			button: 'Полетели',
			catVisibility: true,
			position: [0, 0],
			image: null,
		},
		{
			number: 2,
			selector: step2Ref,
			text: 'Здесь находится вселенная, в которой ты найдёшь все свои курсы.',
			linkTo: gamePagePath,
			button: 'Далее',
			catVisibility: true,
			position: [100, -460],
			image: arrow1,
		},
		{
			number: 3,
			selector: step3Ref,
			text: 'Приветствуем тебя на неизведанной планете – этом курсе! Здесь ты получишь новые знания и научишься применять их, выполняя домашние задания. Если что-то будет непонятно – без стеснения отправляй вопросы своему куратору.',
			linkTo: linkToStep3,
			button: 'Далее',
			catVisibility: false,
			position: [100, -20],
			image: null,
		},
		{
			number: 4,
			selector: step4selector,
			text: 'Сейчас мы находимся в твоём личном шатле - профиле.',
			linkTo: linkToStep3,
			button: 'Далее',
			catVisibility: true,
			position: [100, -460],
			image: null,
		},
		{
			number: 5,
			selector: step5Ref,
			text: 'В твоём профиле будет храниться вся информация об успехах и достижениях.',
			linkTo: gamePagePath,
			button: 'Далее',
			catVisibility: true,
			position: [80, -330],
			image: arrow1,
		},
		{
			number: 6,
			selector: '',
			text: 'За прохождение урока и за выполнение домашнего задания ты будешь получать награды.',
			linkTo: '/:course/game',
			button: 'Начать!',
			catVisibility: true,
			position: [-30, -340],
			image: arrow6,
		},
	];
	const stepsNumber = steps.length;

	return (
		<div className={active ? 'onboarding active' : 'onboarding'}>
			<Step
				setActive={setActive}
				stepsNumber={stepsNumber}
				steps={steps}
				onboardingRef={onboardingRef}
				active={active}
				studentData={studentData}
			/>
		</div>
	);
}

export default Onboarding;
