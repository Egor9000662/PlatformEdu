import questions from '../../../modules/questionnare.json';

export default class QuestionnaireData {

    get questions() {
        return questions;
    }

    get allQuestions() {
        return Object.values(questions).flat().map((block) => {
            return [
                ...block.questions,
            ];
        }).flat();
    }

    get formDataInitial() {
        const allQuestionsIds = this.allQuestions.map((question) => question.id);
        return allQuestionsIds.reduce((acc, id) => {
            acc[id] = '';
            return acc;
        }
            , {});
    }

    handleNextQuestionnaireBlock(block, formData) {
        const requiredQuestions = block.questions.filter((question) => question.required);
        if (requiredQuestions.length === 0) {
            return false;
        }
        const checkRequiredQuestionsByBlock = requiredQuestions.every((question) => formData[question.id] !== '');
        if (checkRequiredQuestionsByBlock) {
            return true;
        }
        return false;
    }

    handleSubmitQuestionnaire(formData) {
        const requiredQuestionsAll = this.allQuestions.filter((question) => question.required);
        const checkRequiredQuestionsAll = requiredQuestionsAll.every((question) => formData[question.id] !== '');
        if (checkRequiredQuestionsAll) {
            return true;
        }
        return false;
    }
}