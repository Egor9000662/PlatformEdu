import React, { useEffect, useState } from 'react';
import X from '../../assets/onboarding/x_icon.svg';
import Cat from '../../assets/onboarding/gumball.svg';
import { Link } from 'react-router-dom';
import {useUpdateStudentStatusRepo} from "../../../common/repositories/StudentRepository";

export const Step = ({
	setActive,
	stepsNumber,
	steps,
	onboardingRef,
	active,
	studentData,
}) => {
	const [updateStudent, updateStudentStatusError] = useUpdateStudentStatusRepo();
	const [step, setStep] = useState(0);

	const {
		number,
		text,
		linkTo,
		button,
		catVisibility,
		selector,
		position,
		image,
	} = steps[step];

	useEffect(() => {
		if (
			localStorage.getItem('onboardingTour') &&
			active === true
		) {
			root.style.pointerEvents = 'none';
		}
		if (selector && selector.current) {
			const element = selector.current;
			element.style.zIndex = 100;

			const stepWrapper = onboardingRef.current;

			if (step != 0) {
				const prevSelector = steps[step - 1].selector;
				const prevElement = prevSelector.current;
				if (prevSelector && prevElement && prevElement.className === 'sidebar-container') {
					prevElement.style.zIndex = null;
				}
				if (prevSelector && prevElement && prevElement.className !== 'sidebar-container') {
					prevElement.style.zIndex = 5;
				}
			}

			if (number === 2 && window.matchMedia("(min-width: 1024px)").matches) {
				stepWrapper.style.top = 150 + 'px';
				stepWrapper.style.left = 'calc(' + 37 + '% - ' + 70 + 'px)';
			} else {
				stepWrapper.style.transform = '';
			}

			if (number === 3) {
				if (window.matchMedia("(min-width: 1024px)").matches) {
					stepWrapper.style.top = 350 + 'px';
					stepWrapper.style.left = 'calc(' + 55 + '% - ' + 70 + 'px)';
				} else {
					stepWrapper.style.marginLeft = 24 + 'vw';
				}
			}

			if (number === 4 && window.matchMedia("(min-width: 1024px)").matches) {
				stepWrapper.style.top = 300 + 'px';
				stepWrapper.style.left = 'calc(' + 37 + '% - ' + 70 + 'px)';
			}

			if (number === 5) {
				stepWrapper.style.top = 150 + 'px';
				stepWrapper.style.left = 'calc(' + 39 + '% - ' + 70 + 'px)';
				stepWrapper.style.transform = 'scale(1)';
			} else {
				stepWrapper.style.transform = '';
			}

			if (number === stepsNumber) {
				stepWrapper.style.top = 250 + 'px';
				if (window.matchMedia("(min-width: 1024px)").matches) {
					stepWrapper.style.top = 390 + 'px';
					stepWrapper.style.left = 'calc(' + 85 + '% - ' + 70 + 'px)';
				}
			}
		}
	}, [step, number]);

	const handleStep = () => {
		if (step + 1 === stepsNumber) {
			setActive(false);
			root.style.pointerEvents = 'all';
			try{
				updateStudent({
					variables: {
						studentBaseRequestDto: {
							id: studentData.studentData.id,
							userId: studentData.studentData.user.id,
							status: "active",
						}
					}
				})
			}catch (error){
				console.log(error)
			}
		}
		setStep((prevState) =>
			prevState + 1 == stepsNumber ? 0 : prevState + 1
		);
	};

	return (
		<div className="step-wrapper-container">
			<div
				className="step-wrapper"
				ref={onboardingRef}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="step">
					<div className="step-header">
						<p className="step-header__number">
							{number} / {stepsNumber}
						</p>
						<button
							className="step-header__skip"
							onClick={() => setActive(false)}
						>
							<img src={X} alt="skip" />
						</button>
					</div>
					<p className="step__text">{text}</p>
					<Link to={linkTo}>
						<button
							className={
								step != stepsNumber - 1
									? 'step__btn _blue'
									: 'step__btn _green'
							}
							onClick={handleStep}
						>
							{button}
						</button>
					</Link>
				</div>
				<div
					className={
						catVisibility ? 'step-cat' : 'step-cat step-cat_hiden'
					}
				>
					<img src={Cat} alt="cat" />
				</div>
				{image && (
					<div className={`step-arrow step-arrow-${number}`}>
						<img src={image} alt="cat" />
					</div>
				)}
			</div>
		</div>
	);
};
