import { makeAutoObservable } from "mobx";

export default class AdminPaymentModel {

    /** @private {UsersStore} */
    #usersStore;

    /** @private {GroupsStore} */
    #groupsStore;

    /** @private {String} */
    #groupId;

    constructor(usersStore, groupsStore) {
        this.#usersStore = usersStore;
        this.#groupsStore = groupsStore;
        makeAutoObservable(this)
    }

    /**
     * @param {string} id
     */
    set groupId(id) {
        this.#groupId = id
    }

    get groupId() {
        return this.#groupId
    }

    get users() {
        return this.#usersStore.users
    }

    get groups() {
        return this.#groupsStore.groups
    }

    get filteredGroups() {
        return this.groups.filter(group => group.id !== 'group-unassigned')
    }

    get beneficiaries() { //todo скорректировать свойство beneficiary, если юзер в нескольких группах
        // return this.users.filter(user => user.group === this.#groupId && user.beneficiary === true)
        return this.users.filter(user => Object.keys(user.groups).includes(this.#groupId) && user.beneficiary === true)
    }

    get debtors() { //todo скорректировать свойство debtor, если юзер в нескольких группах
        // return this.users.filter(user => user.group === this.#groupId && user.debtor === true)
        return this.users.filter(user => Object.keys(user.groups).includes(this.#groupId) && user.debtor === true)
    }

    get paymentDate() {
        const group = this.groups.find((group) => group.id === this.#groupId)
        return group?.paymentDate
    }

    async removeBeneficiaryStatus(uid) {
        const user = this.users.find(user => user.uid === uid)
        await user.deleteBeneficiaryStatus(uid);
        const newBeneficiaries = this.beneficiaries.filter(
            (beneficiary) => beneficiary.uid !== uid && beneficiary.beneficiary === true
        );
        return newBeneficiaries;
    }

    setDebtors() { //todo скорректировать метод для нескольких групп у юзера
        this.users.forEach(user => {
            const groupInfo = this.groups?.find((group) => group.id === user.group);
            user.addMonthInDebt(user.uid, user.group);
            user.setDebtorStatus(user.uid, user.group, groupInfo?.startDate);
        })
    }

    async removeUserFromDebtors(uid, months) {
        const user = this.users.find(user => user.uid === uid)
        await user.updateDebtorPaymentInfo(uid);
        // удаляет по одному месяцу задолженности
        if (months - 1 <= 0) {
            const newDebtors = this.debtors.filter(
                (debtor) => debtor.uid !== uid && debtor.debtor === true
            );
            return newDebtors;
        }
        return this.debtors;
    }

    setPaymentDateForGroups() {
        this.groups.forEach(group => {
            group.setPaymentDate(group.id)
        })
    }

    updateGroupPaymentDate(newPaymentDate) {
        const group = this.groups.find((group) => group.id === this.#groupId)
        group.updateGroupPaymentDate(group.id, newPaymentDate);
    }

    getDebtorSinceDate(paymentDate, monthsAmount) {
        if (paymentDate !== '') {
            let debtorDateFormated = new Date(
                paymentDate?.split('.').reverse().join('-')
            );
            debtorDateFormated.setMonth(
                debtorDateFormated.getMonth() - monthsAmount
            );

            return debtorDateFormated.toLocaleDateString();
        }
        return '';
    }
}