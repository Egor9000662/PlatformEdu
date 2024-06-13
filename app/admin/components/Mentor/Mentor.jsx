import React, { useState } from 'react';
import Counter from '../../../common/components/Counter/Counter';
import selectIcon from '../../../common/assets/controls/select_checkmark.svg';
import './Mentor.scss';
import { v4 as uuidv4 } from 'uuid';

export default function Mentor({ mentor, pricesCalc }) {
	const [isMonthVisible, setIsMonthVisible] = useState(false);
	const checkedMentorTasks = pricesCalc.formatCheckedMentorTasks(mentor.checkedTasks);

	return (
		<div className="mentor-container" key={mentor?.uid}>
			<h2 className="mentors-heading mentor-name"> {mentor.name}</h2>
			{checkedMentorTasks.length > 1 &&
				<div className="mentor-container__select-block">
					<img
						className={isMonthVisible ?
							"mentor-container__select-icon" :
							"mentor-container__select-icon mentor-container__select-icon-rotated"}
						src={selectIcon}
						alt="showMonths-icon"
						onClick={() => setIsMonthVisible(!isMonthVisible)} />
				</div>}
			<div className='mentor-content'>
				{checkedMentorTasks.length > 0
					? checkedMentorTasks
						.map(
							(task) =>
								<div
									className={isMonthVisible ?
										"mentor-container__month" :
										"mentor-container__month mentor-container__month-hidden"}
									key={uuidv4()}
								>
									<div className="mentor-container__month-num"
										title='Месяц считается с 20 числа предыдущего месяца по 19 число текущего'>
										<p className="mentor-container__month-num_text">
											Месяц:
										</p>
										{task.month}
									</div>
									{task.blocks.map(
										(block) =>
											<div className="container-checked" key={uuidv4()} >
												<Counter num={block.amount || 0} />
												<p className="container-checked__title">{block.block}</p>
												<p className="container-checked__price">
													Сумма: {pricesCalc.calculatePriceOfBlock(block.block, block.amount)}
												</p>
											</div>
									)}
									<div className="mentor-container__totalCost">
										<p className="mentor-container__totalCost_text">
											Всего:
										</p>
										{pricesCalc.calculateTotalCost(task.blocks)}
									</div>
								</div>
						)
					: <div className="container-checked" >
						<p className="empty-checked-message">
							Еще не проверил задания для расчета
						</p>
					</div>
				}
			</div>
		</div>
	);
}
