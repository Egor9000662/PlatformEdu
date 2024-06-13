import { gql, useQuery } from "@apollo/client";

export const GET_COURSE_BLOCKS = gql`
	query findAllBlock{
	  blocks: findAllBlock{
		id
		workspace
		courseId
		name
		homeworkPrice
	  }
	}
`

export const useLoadAllBlock = (courseName, courseId, workspace) => {
	const { data, loading: blocksLoading } = useQuery(GET_COURSE_BLOCKS, {
		skip: !courseName,
	});
	let blocks;
	if (!blocksLoading) { //todo:filter
		// blocks = data.blocks.filter(block => block.courseId === courseId && block.workspace === workspace);
		blocks = [
			{
				id:"18044032-31e9-47ce-9e1e-d3207d815780",
				workspace:"92426620-ffe0-457b-9818-c683b59c88d4",
				courseId:"66d197c8-7e21-4453-a45b-626c6c6ebc33",
				name:"HTML CSS",
				homeworkPrice:"100"
			},
			{
				id:"18044032-31e9-47ce-9e1e-d3207d815780",
				workspace:"92426620-ffe0-457b-9818-c683b59c88d4",
				courseId:"66d197c8-7e21-4453-a45b-626c6c6ebc33",
				name:"JS",
				homeworkPrice:"200"
			},
			{
				id:"18044032-31e9-47ce-9e1e-d3207d815780",
				workspace:"92426620-ffe0-457b-9818-c683b59c88d4",
				courseId:"66d197c8-7e21-4453-a45b-626c6c6ebc33",
				name:"React",
				homeworkPrice:"200"
			},
			{
				id:"18044032-31e9-47ce-9e1e-d3207d815780",
				workspace:"92426620-ffe0-457b-9818-c683b59c88d4",
				courseId:"66d197c8-7e21-4453-a45b-626c6c6ebc33",
				name:"Трудоустройство",
				homeworkPrice:"0"
			}
		]
	}
	return { blocks, blocksLoading };
}

export const GET_LESSONS_BY_BLOCK_NAME = gql`
query findByNameBlock($name: String!) {
	block: findByNameBlock(name: $name) {
	  lessons {
		id
		name
		description
		title
		lessonNumber
	  }
	}
  }
`
export const useLoadBlockLessons = (blockName) => {
	const { data, loading: lessonsLoading } = useQuery(GET_LESSONS_BY_BLOCK_NAME, {
		variables: {
			name: blockName
		},
		skip: !blockName,
	});
	// let lessons;
	//
	// if (!lessonsLoading && !data) {
	// 	if (blockName === "Block") {
	// 		lessons = [
	// 			{
	// 				"id": "77bae5ae-a350-4198-948a-6d4a2491aef8",
	// 				"name": "Введение в HTML",
	// 				"description": "Знакомимся с инструментами и тегами",
	// 				"title": "some title",
	// 				"weekNumber": 1
	// 			},
	// 			{
	// 				"id": "77bae5ae-a350-4198-948a-6d4a2491aef9",
	// 				"name": "Знакомимся с инструментами",
	// 				"description": "Знакомимся с инструментами",
	// 				"title": "some title",
	// 				"weekNumber": 2
	// 			},
	// 			{
	// 				"id": "77bae5ae-a350-4198-948a-6d4a2491aef0",
	// 				"name": "Знакомимся с тегами",
	// 				"description": "Знакомимся с тегами",
	// 				"title": "some title",
	// 				"weekNumber": 3
	// 			}
	// 		]
	// 	} else if (blockName === "Block 2") {
	// 		lessons = [
	// 			{
	// 				"id": "77bae5ae-a350-4198-948a-6d4a2491aef8",
	// 				"name": "Введение в HTML",
	// 				"description": "Знакомимся с инструментами и тегами",
	// 				"title": "some title",
	// 				"weekNumber": 1
	// 			},
	// 			{
	// 				"id": "77bae5ae-a350-4198-948a-6d4a2491aef9",
	// 				"name": "Знакомимся с инструментами",
	// 				"description": "Знакомимся с инструментами",
	// 				"title": "some title",
	// 				"weekNumber": 2
	// 			}
	// 		]
	// 	}
	// 	else {
	// 		lessons = data.block.lessons;
	// 	}
	// 	return { lessons, lessonsLoading };
	// }
	return {data, lessonsLoading}

}
