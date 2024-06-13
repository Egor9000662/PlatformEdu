import React, {useEffect, useRef} from 'react';
import './NotionCard.scss';
import TableOfContent from '../../../student/components/TableOfContent/TableOfContent';
import {NotionRenderer, Code } from "react-notion-x";
import UpArrow from "../UpArrow/UpArrow";
export default ({ recordMap, handleScroll, theme }) =>
	recordMap && (
		<div className="notionCard-container">
			{/* <div className="notionCard-header">
				<BackArrow />
			</div> */}
			{/*{theme && (*/}
			{/*	<div className="notionCard-tableOfContent">*/}
			{/*		<TableOfContent />*/}
			{/*	</div>*/}
			{/*)}*/}
			<div className="lesson-notion-container">
				<NotionRenderer
					recordMap={recordMap}
					fullPage
					darkMode={false}
					components={{ code: Code }}
				/>
			</div>
			{recordMap.type === 'theme' && <UpArrow handleScroll={handleScroll} />}
		</div>
	);

// function NotionCard({ theme, pat }){
	// useEffect(()=>{
	// 	addHtmlElement(path);
	// }, [path]);
	//
	// const article = useRef(null);
	//
	// async function addHtmlElement(path) {
	// 	let response = await fetch(path);
	// 	let result = await response.text();
	// 	const html = replaceLinkVideo(result);
	// 	article.current.attachShadow({mode: 'open'});
	// 	article.current.shadowRoot.innerHTML = html;
	// 	const style = document.createElement( 'style' );
	// 	style.innerHTML = additionalStyle;
	// 	article.current.shadowRoot.appendChild( style );
	// }
	//
	// const additionalStyle = '.source { ' +
	// 	'width: 100%; ' +
	// 	'padding: 0; ' +
	// 	'padding-bottom: 56.25%; ' +
	// 	'position: relative;\n' +
	// 	'height: 0; } ' +
	// 	'.source>iframe {position: absolute;\n' +
	// 	'width: 100%;\n' +
	// 	'top: 0;\n' +
	// 	'left: 0;\n' +
	// 	'bottom: 0;\n' +
	// 	'right: 0;\n' +
	// 	'height: 100%;' +
	// 	'} a {color: #07b9f1;}'
	//
	// function replaceLinkVideo(string) {
	// 	const video = '<iframe src="https://www.youtube.com/embed/$<id>" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>'
	// 	let pattern = /<a href="(?<url>https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)(?<id>[a-zA-Z0-9_-]+)(?:&amp;feature=youtu\.be)?)">\k<url><\/a>/g;
	// 	const result = string.replaceAll(pattern, video);
	// 	return result;
	// }

	// return (
	// 	<div className="notionCard-container">
	// 		{/*{theme && (*/}
	// 		{/*	<div className="notionCard-tableOfContent">todo вернуть бургер-меню*/}
	// 		{/*		<TableOfContent/>*/}
	// 		{/*	</div>*/}
	// 		{/*)}*/}
	// 		<div className="lesson-notion-container">
	// 			<article className='test' ref={article}>Loading...</article>
	// 		</div>
	// 	</div>
	// )
// }
// export default NotionCard;
