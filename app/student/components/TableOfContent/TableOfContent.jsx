import React, { useState } from 'react';
import { useEffect } from 'react';
import './TableOfContent.scss';
import burgerMenu from '../../assets/controls/burger_menu.png';

export default function TableOfContent() {
	const [headers, setHeaders] = useState([]);
	const [shownToC, setShownToC] = useState(false);
	const [activeId, setActiveId] = useState('');

	useEffect(() => {
		const headings = Array.from(
			document.querySelectorAll('h2, h3, h4, h5, h6')
		).map((heading, i) => {
			heading.setAttribute('id', `heading-${i}`);

			return {
				name: heading.textContent,
				id: heading.id,
				level: heading.tagName.substring(1),
			};
		});
		setHeaders(headings);
	}, []);

	const handleScrollTo = (headerId) => {
		document.querySelector(`#${headerId}`)?.scrollIntoView({
			behavior: 'smooth',
		});
		setActiveId(headerId);
		setShownToC(false);
	};

	const handleShowing = () => {
		setShownToC(true);
	};

	useEffect(() => {
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [shownToC]);

	const handleMouseUp = (e) => {
		const list = document.getElementsByClassName('ToC-list');
		if (e.target !== list) {
			setShownToC(false);
		}
	};

	return (
		<div className="ToC-container">
			<button
				className={
					shownToC ? 'notionCard-btnToC rotated' : 'notionCard-btnToC'
				}
				onClick={handleShowing}
			>
				<img src={burgerMenu} />
			</button>{' '}
			<nav>
				<ul className={shownToC ? 'ToC-list' : 'ToC-list hidden'}>
					{headers
						.filter((elem) => {
							return (
								elem.name !== 'Оцените качество урока' &&
								elem.name !== 'Спасибо за ваш отзыв!'
							);
						})
						.map((header) => (
							<li
								key={header.id}
								className={
									header.id === activeId
										? `ToC-heading${header.level} activeHeader`
										: `ToC-heading${header.level}`
								}
							>
								<a
									href={`#${header.id}`}
									onClick={(e) => {
										e.preventDefault();
										handleScrollTo(header.id);
									}}
								>
									{header.name}
								</a>
							</li>
						))}
				</ul>
			</nav>
		</div>
	);
}
