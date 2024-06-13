import React, { useEffect, useState, useRef } from 'react';
import './TabbedPane.scss';
import { NavLink } from 'react-router-dom';

const TabbedPane = ({ paths }) => {
	// temporary states to create styles.
	// in the future they will be controlled from above
	const [checked, setChecked] = useState(0);

	const handleClick = (e, index) => {
		// animation of movement in the navigation panel
		let navtab = e.target.parentNode.parentNode;
		navtab.dataset.selected = index;
		setChecked(index);
	};

	const activeIndex = useRef(null);
	useEffect(() => {
		const arrLink = Array.from(activeIndex.current.childNodes).map((el) =>
			el.className.toString()
		);
		for (let i = 0; i < arrLink.length; i++) {
			if (arrLink[i].includes('active')) {
				setChecked(i);
			}
		}
	});

	return (
		<React.Fragment>
			<nav
				className={`tab-list ${checked ? 'moving' : ''} `}
				data-selected={checked}
			>
				{/* icon links */}
				<div className="tab-icons" ref={activeIndex}>
					{paths.map((path, i) => {
						return (
							<NavLink
								data-index={i}
								className={(isActive) =>
									`tab-link ${
										isActive && `selected-tab initialised `
									}`
								}
								to={path}
								onClick={(e) => handleClick(e, i)}
								key={`${path}-i`}
							>
								<div className={`tab-icon tab-icon_${i}`} />
							</NavLink>
						);
					})}
				</div>

				{/* panel background */}
				<div className="bar">
					<div className="cap"></div>
					<div className="middle">
						<div className="side"></div>
						<div className={`circle`}></div>
						<div className="side"></div>
						<div className="side"></div>
					</div>
					<div className="cap"></div>
				</div>
			</nav>
		</React.Fragment>
	);
};

export default TabbedPane;
