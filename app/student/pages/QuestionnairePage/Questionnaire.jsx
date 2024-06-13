import React, { useEffect, useState } from 'react';
import './Questionnaire.scss';
import questions from '../../../modules/questionnare.json';
import QuestionnaireData from './QuestionnaireData';
import WritingQuestion from '../../components/QuestionnaireQuestions/WritingQuestion';
import MultiQuestion from '../../components/QuestionnaireQuestions/MultiQuestion';
import CheckQuestion from '../../components/QuestionnaireQuestions/CheckQuestion';
import SelectQuestion from '../../components/QuestionnaireQuestions/SelectQuestion';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import roundArrow from '../../../common/assets/controls/arrows/round_arrow.svg';
import { useUpdateStudentWorkspaceRepo } from "../../../common/repositories/StudentRepository";
import client from "../../../common/apollo/client";

function Questionnaire({ questionnaire, setQuestionnaire }) {
	useEffect(() => {
		if(questionnaire?.workspace) {
			const copyQuestionnaire = JSON.parse(JSON.stringify(questionnaire))
			copyQuestionnaire.workspace.workspace.questionnaire.questionList = questions
			setQuestionnaire(copyQuestionnaire);
		}
	}, [])

	const studentId = Object.values(client.cache.data.data).find(item => item.__typename === "Student").id

	const [fillQuestionnaireWorkspace, fillQuestionnaireWorkspaceError] = useUpdateStudentWorkspaceRepo();

	const questionnaireData = new QuestionnaireData();
	const [formData, setFormData] = useState(questionnaireData.formDataInitial);
	const [page, setPage] = useState(0);
	const [errShown, setErrShown] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [block, setBlock] = useState({
		title: '',
		questions: [],
	});

	const questionsData = questionnaire?.workspace?.workspace?.questionnaire?.questionList?.blocks?.flat() || [];
	const history = useHistory();

	useEffect(() => {
		setBlock(Object.values(questionnaireData.questions).flat()[page]);
	}, [page]);

	useEffect(() => {
		const requiredQuestions = questionnaireData.handleNextQuestionnaireBlock(block, formData);
		if (requiredQuestions) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [formData]);

	const getQuestionnaireComponent = (question) => {
		switch (question.type) {
			case 'write':
				return (
					<WritingQuestion
						key={question.id}
						question={question}
						formData={formData}
						handleChangeData={handleChangeData}
						deleteAnswer={deleteAnswer}
					/>
				);
			case 'check':
				return (
					<CheckQuestion
						key={question.id}
						question={question}
						formData={formData}
						handleChangeData={handleChangeData}
						deleteAnswer={deleteAnswer}
					/>
				);
			case 'multi':
				return (
					<MultiQuestion
						key={question.id}
						question={question}
						formData={formData}
						handleChangeData={handleChangeData}
						deleteAnswer={deleteAnswer}
					/>
				);
			case 'select':
				return (
					<SelectQuestion
						key={question.id}
						question={question}
						formData={formData}
						handleChangeData={handleChangeData}
						deleteAnswer={deleteAnswer}
					/>
				);
			default:
				break;
		}
	};

	const handleChangeData = (question, answer) => {
		setFormData({
			...formData,
			[question]: answer,
		});
	};

	const deleteAnswer = (id) => {
		setFormData({
			...formData,
			[id]: '',
		});
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		const allAnswered = questionnaireData.handleSubmitQuestionnaire(formData);
		if (!allAnswered) {
			setErrShown(true);
		} else {
			try {
				fillQuestionnaireWorkspace({
					variables: {
						questionnaireId: questionnaire.workspace.workspace.questionnaire.id,
						studentId: studentId,
						answer: JSON.stringify(formData)
					}
				});
				setQuestionnaire({});
				history.push(`/game`);
			}catch (error) {
				console.log(error)
			}
		}
	};

	const handleNext = (e) => {
		e.preventDefault();
		const requiredQuestions = questionnaireData.handleNextQuestionnaireBlock(block, formData);
		if (!requiredQuestions) {
			setErrShown(true);
		} else {
			setErrShown(false);
			setPage((currentPage) => currentPage + 1);
		}
	}

	if (fillQuestionnaireWorkspaceError) {
		return <p>Ой, кажется что-то пошло не так...</p>
	}

	return (
		<div className="questionnairePage">
			<h1 className="questionnaire-header">Анкета ученицы</h1>
			<div className="questionnairePage-container" key={block.title} >
				<h1 className="questionnaire-header">{block.title}</h1>
				<div className="questionnaire-body-wrapper">
					<button
						className='questionnaire-body-button'
						disabled={page === 0}
						onClick={() => {
							setPage((currPage) => currPage - 1);
						}}
					>
						<img src={roundArrow} className="questionnaire-body-arrow questionnaire-body-arrow_left" />
					</button>
					<div>
						<form className="questionnaire-body" onSubmit={handleSubmit}>
							{Object.values(block.questions).flat().map((question) =>
								getQuestionnaireComponent(question)
							)}
							{page === questionsData.length - 1 ?
								(<button type="submit" className="primary questionnaire-btn">
									Отправить
								</button>) : (
									<button
										className={isDisabled ? "primary questionnaire-btn-disabled" : "primary"}
										onClick={(e) => handleNext(e)}>
										Дальше
									</button>
								)}
						</form>
						{errShown && (
							<p className="questionnaire-error">
								Заполните все поля, пожалуйста
							</p>
						)}
					</div>
					<button
						className='questionnaire-body-button'
						onClick={handleNext}
					>
						<img src={roundArrow} className="questionnaire-body-arrow" />
					</button>
				</div>
			</ div>
		</div >
	);
}

export default Questionnaire;

