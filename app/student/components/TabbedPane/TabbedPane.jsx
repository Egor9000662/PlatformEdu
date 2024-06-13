import React, { useEffect, useState, useRef } from 'react';
import './TabbedPane.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

const TabbedPane = ({
	uid,
	getNotifs,
	paths,
	step2Ref }) => {
	// temporary states to create styles.
	// in the future they will be controlled from above
	const [checked, setChecked] = useState(0);
	const [notification, setNotification] = useState(false);
	let location = useLocation();
	const tabNeeded = ['/:course/game', '/profile', '/:course/notification', '/:course/messenger'];

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

	useEffect(() => {
		getNotifs(uid).then((data) => {
			data.every((notif) => notif.seen === true) || checked == 2
				? setNotification(false)
				: setNotification(true);
		});
	}, [checked]);

	return (
		<React.Fragment>
			<nav
				className={`tab-list-student ${checked ? 'moving' : ''} `}
				data-selected={checked}
				ref={step2Ref}
			>
				{/* icon links */}
				<div className="tab-icons" ref={activeIndex}>
					{paths.map((path, i) => {
						return (
							<NavLink
								data-index={i}
								className={(isActive) =>
									`tab-link ${isActive
										? `selected-tab-student initialised`
										: ``
									}`
								}
								to={path}
								onClick={(e) => handleClick(e, i)}
								key={`${path}-i`}
							>
								<div className={`tab-icon-student tab-icon-student_${i}`} />
								{i === 2 && notification ? (
									<span className="tab-notification" />
								) : (
									''
								)}
							</NavLink>
						);
					})}
				</div>

				{/* panel background */}
				<div className="bar">
					<div className="cap"></div>
					<div className="middle">
						<div className="side"></div>
						<div className={tabNeeded.includes(location.pathname) ? `circle` : ''}></div>
						<div className="side"></div>
						<div className="side"></div>
					</div>
					<div className="cap"></div>
				</div>
			</nav>
		</React.Fragment>
	);
};

export default inject(({ auth, oneUserStore }) => {
	const { profile } = auth;
	const { getNotifs } = oneUserStore;
	const uid = profile?.uid;

	return {
		uid,
		getNotifs,
	};
})(observer(TabbedPane));
