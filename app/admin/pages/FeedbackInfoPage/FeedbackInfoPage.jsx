import React, { useEffect, useState } from 'react';
import './FeedbackInfoPage.scss';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import selectCheckmark from '../../../common/assets/controls/select_checkmark.svg';
import FeedbackTable from '../../components/FeedbackTable/FeedbackTable';
import AdminFeedbackModel from '../../models/AdminFeedbackModel';

function FeedbackInfoPage({ setLoaded, adminFeedbackModel }) {
	const [feedbackType, setFeedbackType] = useState('');
	const [filterBy, setFilterBy] = useState('');
	const [selectText, setSelectText] = useState('');
	const [selectOptions, setSelectOptions] = useState(null);
	const [extraSelect, setExtraSelect] = useState(false);
	const [mentorId, setMentorId] = useState(null);

	const handleSelectFeedback = (feedbackType) => {
		const selectData = adminFeedbackModel.getSelectInfo(feedbackType);
		setSelectText(selectData.selectText);
		setSelectOptions(selectData.selectOptions);
		setFeedbackType(feedbackType);
		if (feedbackType !== '' && feedbackType !== 'school') {
			setExtraSelect(true);
		}
		setFilterBy('');
		setLoaded(false);
	}

	const handleSelectMentor = (mentorId) => {
		setFilterBy(mentorId);
		setMentorId(mentorId);
		setLoaded(false);
	}

	return (
		<div className="feedbackInfo-container">
			<div className="feedbackInfo-header">
				<h1>Отзывы</h1>
			</div>
			<div className="feedbackInfo-main">
				<div className="feedbackInfo-filtering">
					<div className="fI-select-container">
						<select
							className="fI-select"
							onChange={(e) => {
								handleSelectFeedback(e.target.value);
							}}
						>
							<option value="">Выберите категорию</option>
							<option value="mentor">Менторы (созвоны)</option>
							<option value="student">Ученицы</option>
							<option value="lessons">Уроки</option>
							<option value="low">Низкое качество</option>
							<option value="school">Оценка школы</option>
						</select>
						<div>
							<img
								className="fI-select-button"
								src={selectCheckmark}
								alt="button"
							/>
						</div>
					</div>
					{extraSelect && (
						<div className="fI-select-container">
							<select
								className="fI-select"
								onChange={(e) => {
									handleSelectMentor(e.target.value);
								}}
							>
								<option value="">Выберите {selectText}</option>
								{selectOptions?.map((option) => (
									<option key={option.id} value={option.id}>
										{option.text}
									</option>
								))}
							</select>
							<div>
								<img
									className="fI-select-button"
									src={selectCheckmark}
									alt="button"
								/>
							</div>
						</div>
					)}
				</div>

				<div className="feedbackInfo-table">
					{feedbackType !== '' && (
						<FeedbackTable
							feedbackType={feedbackType}
							filterBy={filterBy}
							mentorId={mentorId}
							adminFeedbackModel={adminFeedbackModel}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default inject(({ coursesStore, usersStore, mentorsStore }) => {
	const { setLoaded } = usersStore;

	const loadAllData = async () => {
		await usersStore.loadData();
		await mentorsStore.loadData();
		await coursesStore.loadDataCourse();
	};

	useEffect(() => {
		loadAllData();
	}, [usersStore.isLoaded, mentorsStore.isLoaded, coursesStore.isLoaded]);

	const adminFeedbackModel = new AdminFeedbackModel(usersStore, mentorsStore, coursesStore);

	return {
		setLoaded, adminFeedbackModel
	};
})(observer(FeedbackInfoPage));
