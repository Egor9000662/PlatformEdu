import React, { useEffect, useState } from 'react';
import './BlocksPrice.scss';
import iconEdit from '../../../common/assets/controls/icon-edit.svg';
import iconOk from '../../assets/controls/icon-ok.png';
import iconCancel from '../../assets/controls/icon-cancel.png';
import AdminBlocksPriceModel from '../../models/AdminBlocksPriceModel'

const BlocksPrice = ({ frontendBlocks, updateCostOfValidationBlock }) => {
	const [modules, setModules] = useState([]);
	const [editData, setEditData] = useState({
		id: '',
		homeworkCheckPrice: '',
	});
	const [editModuleId, setEditModuleId] = useState(null);
	const adminBlocksPriceModel = new AdminBlocksPriceModel();

	useEffect(() => {
		setModules(frontendBlocks);
	}, [])

	const handleEditDataChange = (event) => {
		event.preventDefault();
		const newData = adminBlocksPriceModel.getEditData(event, editData);
		setEditData(newData);
	};

	const handleEditDataSubmit = (event) => {
		event.preventDefault();
		const newModules = adminBlocksPriceModel.getNewModules(editModuleId, editData, modules, updateCostOfValidationBlock)

		setModules(newModules);
		setEditModuleId(null);
	};

	const handleEditClick = (event, module) => {
		event.preventDefault();
		setEditModuleId(module.id);
		const values = {
			id: module.id,
			homeworkCheckPrice: module.homeworkCheckPrice,
		};
		setEditData(values);
	};

	const handleCancelClick = () => {
		setEditModuleId(null);
	};
	return (
		<>
			<h1 className="priceInfo__title">Стоимость модулей</h1>
			<h2 className="priceInfo__title_frontend">Frontend</h2>
			{modules.map((module) => (
				<div key={module.id} className="priceInfo__row">
					<div className="priceInfo__row-item">
						<p className="priceInfo__row-text">
							{module.id}
						</p>
						{editModuleId === module.id ? (
							<div className="priceInfo__editable">
								<input
									className="priceInfo__input"
									type="text"
									name="homeworkCheckPrice"
									value={editData.homeworkCheckPrice}
									onChange={handleEditDataChange}
								></input>
								<p className="priceInfo__row-text">руб.</p>
							</div>
						) : (
							<p className="priceInfo__row-text">
								{module.homeworkCheckPrice} руб.
							</p>
						)}
					</div>
					{editModuleId === module.id ? (
						<div className="priceInfo__btn-actions">
							<button
								type="button"
								className="priceInfo__btn-save"
								style={{ boxShadow: 'none' }}
								onClick={handleEditDataSubmit}
							>
								<img
									className="priceInfo__icon priceInfo__icon-ok"
									src={iconOk}
									alt="ok"
								/>
							</button>
							<button
								type="button"
								className="priceInfo__btn-cancel"
								style={{ boxShadow: 'none' }}
								onClick={handleCancelClick}
							>
								<img
									className="priceInfo__icon priceInfo__icon-cancel"
									src={iconCancel}
									alt="cancel"
								/>
							</button>
						</div>
					) : (
						<div className="priceInfo__btn-edit">
							<button
								type="button"
								className="priceInfo__btn-edit"
								style={{ boxShadow: 'none' }}
								onClick={(event) =>
									handleEditClick(event, module)
								}
							>
								<img src={iconEdit} alt="edit" />
							</button>
						</div>
					)}
				</div>
			))}
		</>
	);
};

export default BlocksPrice;
