import { makeAutoObservable } from "mobx";

export default class HomeworkCheckPriceCalculator {
	/** @private {Map<string, number>} */
	#blockPrices;

	constructor(blockPrices) {
		this.#blockPrices = blockPrices;
		makeAutoObservable(this);
	}

	calculatePriceOfBlock(block, amount) {
		const blockPrice = this.#blockPrices.get(block.toUpperCase());
		return blockPrice * amount;
	}

	calculateTotalCost(checkedMentorTasks) { //принимает на вход массив массивов [ [key, value], [key, value] ]
		let sum = 0
		for (const checkedTask of checkedMentorTasks) {
			sum += this.calculatePriceOfBlock(checkedTask.block, checkedTask.amount);
		}
		return sum;
	}

	formatCheckedMentorTasks(checkedMentorTasksData) {
		const checkedMentorTasks = (JSON.parse(JSON.stringify(checkedMentorTasksData)));
		return Object.entries(checkedMentorTasks).map(
			([key, value]) => {
				const res = {
					month: key, blocks:
						Object.entries(value).map(
							([key, value]) => {
								return { block: key, amount: value.amount };
							}
						)
				};
				return res;
			})
			.sort((a, b) => {
				if ((+a.month === 12 || +a.month === 11) && (+b.month === 1 || +b.month === 2)) {
					return -1;
				}
				return +a.month - +b.month;
			});
	}
}
