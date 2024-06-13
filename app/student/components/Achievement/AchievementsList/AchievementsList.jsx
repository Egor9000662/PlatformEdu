import React from 'react';
import Achievement from './Achievement';
import './AchievementsList.scss';
import { v4 } from 'uuid';

const achievents = [
	{
		title: 'Воин выходного дня',
		description: 'Проходи уроки в субботу и воскресенье',
		current: 3,
		max: 5,
		type: 'default',
	},
	{
		title: 'Борец',
		description: 'Пройди 5 уроков без ошибок',
		current: 2,
		max: 5,
		type: 'extra',
	},
	{
		title: 'Мудрец',
		description: 'Заходи на платформу 10 дней подряд',
		current: 3,
		max: 10,
		type: 'default',
	},
	{
		title: 'Покоритель HTML и CSS',
		description: 'Пройти все уроки первого модуля "HTML CSS"',
		current: 5,
		max: 8,
		type: 'HTML',
	},
	{
		title: 'Разрушитель JS',
		description: 'Пройти все уроки второго модуля "JS"',
		current: 0,
		max: 10,
		type: 'JS',
	},
	{
		title: 'Мастер React',
		description: 'Пройти все уроки третьего модуля "React"',
		current: 0,
		max: 10,
		type: 'React',
	},
	{
		title: 'Фронтендер',
		description: 'Завершить курс Фронтенд-разработчик',
		current: 5,
		max: 37,
		type: 'final',
	},
	{
		title: 'Идеальное испытание',
		description: 'Пройти тест с первой попытки',
		current: 1,
		max: 1,
		type: 'extra',
	},
];

function AchievementsList({ student }) {

	const getPercent = ({ current, max }) => (current / max) * 100;

	const handlePercentGained = (firstItem, secondItem) => {
		const firstPercent = getPercent(firstItem);
		const secondPercent = getPercent(secondItem);
		return firstPercent - secondPercent;
	};
	return (
		<div className="achievements">
			<h1 className="achievements-heading">Достижения</h1>
			<ul className="achievements-list">
				{/* {Object.values(student.achievement) */}
				{achievents
					.sort((a, b) => handlePercentGained(a, b))
					.map((item) => (
						<Achievement
							achievement={item}
							key={v4()}
						/>
					))}
			</ul>
		</div>
	);
}

export default AchievementsList;
