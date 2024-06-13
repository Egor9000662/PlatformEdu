import { makeAutoObservable } from "mobx";

export default class AdminBlocksPriceModel {

    constructor() {

        makeAutoObservable(this)
    }

    getEditData(event, editData) {
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newData = { ...editData };
        newData[fieldName] = fieldValue;
        return newData;
    }

    getNewModules(editModuleId, editData, modules, updateCostOfValidationBlock) {
        const editedModule = {
            id: editModuleId,
            homeworkCheckPrice: editData.homeworkCheckPrice,
        };
        const newModules = [...modules];
        const index = modules.findIndex((module) => module.id === editModuleId);
        newModules[index] = editData;

        updateCostOfValidationBlock(editedModule.id, editedModule.homeworkCheckPrice);
        return newModules;
    }
}