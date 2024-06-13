import capitalizeFirstLetter from "../../common/template/capitalizeFirstLetter";
import React from "react";
import { ReactComponent as Jupiter } from '../assets/game/Jupiter.svg';
import { ReactComponent as Venus } from '../assets/game/Venus.svg';
import { ReactComponent as Neptune } from '../assets/game/Neptune.svg';
import { ReactComponent as IO } from '../assets/game/IO.svg';

export default class GamePageData {

	#today = new Date().setDate(new Date().getDate());
	#interval = 7;
	/** @private {GroupStore}*/
	#oneGroupStore;
	/** @private {LessonsStore}*/
	#lessonsStore;

	constructor(group, lessonsStore) {
		this.#oneGroupStore = group;
		this.#lessonsStore = lessonsStore;
	}

	setGroup(group) {
		this.#oneGroupStore = group;
	}

	get group() {
		return this.#oneGroupStore;
	}
	get schedule() {
		return Object.values(this.#oneGroupStore.schedule);
	}

	get blocks() {
		const lessons = Object.values(this.#lessonsStore.lessons || {});
		return [...new Set(lessons.map((lesson) => lesson.block))];
	}

	getCourseName(course) {
		return capitalizeFirstLetter(course);
	}

	// /**
	//  * @param {Array <Object>} blockIcons
	//  * @returns {Array <Object>}
	//  */
	// getModulesCourse(blockIcons) {
	// 	const blocks = this.blocks;
	// 	return blocks.map((block, index) => ({
	// 		block,
	// 		icon: blockIcons[index % blockIcons.length],
	// 		unblocked: false,
	// 	}))
	// }


	/**
	 * @param blockIcons
	 * @param courseName
	 * @returns {unknown[] | undefined}
	 */
	#getModulesCourse(blockIcons, courseName = 'frontend-2') {
		let lessonsInfo = this.#lessonsStore.allCourses[courseName]?.lessons;
		const lessons = Object.values(lessonsInfo || {});
		const blocks = [...new Set(lessons.map((lesson) => lesson.block))];
		return blocks?.map((block, index) => ({
			block,
			icon: blockIcons[index % blockIcons.length],
			unblocked: false,
		}));
	}

	getModules(courseName) {
		const blockIcons = [<Jupiter />, <Venus />, <Neptune />, <IO />,];
		const modules = this.#getModulesCourse(blockIcons, courseName);
		if (modules) {
			this.unblockModule(modules);
			return modules;
		}
	}

	/**
	 * @param {string} moduleName
	 * @returns {Array<Object>}
	 */
	getStartModules = (moduleName) => {
		return this.schedule
			.filter((item) => item.block === moduleName)
			.map((item) => item.dateStart)
			.sort((a, b) => a - b)[0];
	};

	/**
	 * @param {Object} module
	 * @returns {number}
	 */
	getCurrentWeekLesson(module) {
		const passedDays = this.#today - this.getStartModules(module.block);
		const currentWeek = Math.ceil(passedDays / 1000 / 3600 / 24 / this.#interval);
		const countLessons = this.countModuleLessons(module.block);
		if (currentWeek >= countLessons) {
			return countLessons;
		}
		if (currentWeek < countLessons && module.unblocked) {
			return currentWeek;
		}
		return 0;
	};

	/**
	 * @param {string} blockName
	 * @returns {number}
	 */
	countModuleLessons(blockName) {
		let count = 0;
		Object.values(this.schedule).map((lesson) => {
			lesson.block === blockName ? count++ : false;
		});
		if (!count) {
			return;
		}
		return count;
	};

	/**
	 * @param {Array<Object>} modules
	 */
	unblockModule(modules) {
		for (let module of modules) {
			const startModule = this.getStartModules(module.block);
			if (this.#today > startModule) {
				module.unblocked = true;
			}
		}
	}

	handleSlideRight() {
		const slider = document.getElementById('slider');
		slider.scrollLeft += 200;
	}

	handleSlideLeft() {
		const slider = document.getElementById('slider');
		slider.scrollLeft -= 200;
	}

	handleUpperSlideRight() {
		const slider = document.getElementById('upper-slider');
		slider.scrollLeft += 200;
	}

}
