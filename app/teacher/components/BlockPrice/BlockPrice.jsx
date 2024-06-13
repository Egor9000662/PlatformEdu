import Counter from "../../../common/components/Counter/Counter";
import React from "react";
import './BlockPrice.scss'
import { v4 as uuidv4 } from 'uuid';

export default function BlockPrice({ mentor, pricesCalc }) {
	const checkedMentorTasks = pricesCalc.formatCheckedMentorTasks(mentor.checkedTasks);

	return (
		<>
			<div className="block-price-container" key={mentor?.uid}>
				<h2 className="block-price_mentor-name"> {mentor.name}</h2>
				<div className="block-price-checked">
					{checkedMentorTasks.length > 0
						? checkedMentorTasks.map(
							(task) =>
								<div
									className="block-price-month"
									key={uuidv4()}
								>
									<div className="mentor-container__month-num"
										title='Месяц считается с 20 числа предыдущего месяца по 19 число текущего'>
										<span className="mentor-container__month-num_text">
											Месяц:
										</span>
										{task.month}
									</div>
									{task.blocks.map(
										(block) =>
											<div className="block-price-checked__block" key={uuidv4()}>
												<Counter num={block.amount || 0} />
												<div className="block-price-checked__title">{block.block}</div>
												<div className="container-checked__price">
													Сумма: {pricesCalc.calculatePriceOfBlock(block.block, block.amount)}
												</div>
											</div>
									)}
									<div className="mentor-container__totalCost block-price__totalCost">
										<span className="mentor-container__totalCost_text">
											Всего:
										</span>
										{pricesCalc.calculateTotalCost(task.blocks)}
									</div>
								</div>
						)
						: <p className="empty-checked-message">
							Еще не проверил задания для расчета
						</p>
					}
				</div>
			</div>
		</>
	);
}
