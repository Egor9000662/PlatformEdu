import {gql, useMutation, useQuery} from "@apollo/client";
import {useEffect} from "react";

export const GET_ALL_GROUP = gql`
	query findAllGroup{
	  groups:findAllGroup{
	    id
		workspace{
		  id
		  name
		}
		name
		bestHomework{
		  id
		  needCheck
		  weekNumber
		  lessonTask{
			lesson{
			  name
			}
		  }
		}
		bestStudent{
		  id
		  status{
			name
		  }
		}
		course{
		  id
		  name
		  workspace{
			id
		    name
		  }
		}
		startDate
		endDate
		paymentDate
		mentors{
		  id
		  mentorName
		}
	  }
	}
`;

export const CREATE_GROUP = gql`
	mutation createGroup($groupCreateRequestDto:GroupCreateRequestDto!){
	  newGroupId:createGroup(groupCreateRequestDto:$groupCreateRequestDto)
	}
`;

export const useCreateGroupRepo = (allMentors, workspaceId) => {
	const [createGroup, createGroupStatus] = useMutation(CREATE_GROUP, {
		update(cache, createGroupResult) {
			const {data: {newGroupId}} = createGroupResult;
			console.log('CREATE_GROUP update', {createGroupResult});
			const {groups} = cache.readQuery({query: CREATE_GROUP});
			// cache.writeQuery({
			// 	query: GET_ALL_GROUP,
			// 	data: {
			// 		groups: [group, ...groups]
			// 	},
			// })
		}
	});
	const {data: newGroupId, loading: createGroupLoading, error: createGroupError} = createGroupStatus;
	const [createGroupMentor, createGroupMentorStatus] = useMutation(CREATE_GROUP_MENTOR, {
		update(cache, createGroupMentorResult) {
			const {data: {groupMentorTableId}} = createGroupMentorResult;
			console.log(' CREATE_GROUP_MENTORupdate', {createGroupMentorResult});
			const {groups} = cache.readQuery({query: CREATE_GROUP_MENTOR});
			// const updatedGroups = groups.map(group => {
			// 	if (group.id === groupId) {
			// 		return {...group, id: groupId};
			// 	}
			// 	return group;
			// });
			// cache.writeQuery({
			// 	query: GET_ALL_GROUP,
			// 	data: {
			// 		groups: updatedGroups
			// 	},
			// })
		}
	});
	const {
		data: groupMentorTableId,
		loading: groupMentorLoading,
		error: createGroupMentorError
	} = createGroupMentorStatus;
	console.log('outer', {createGroupStatus, createGroupMentorStatus});
	useEffect(() => {
		console.log('useEffect', {createGroupStatus, createGroupMentorStatus});
		if (newGroupId) {
			const mentor = allMentors.find(mentor => mentor.mentorName === mentor);
			createGroupMentor({
				variables: {
					groupId: newGroupId,
					mentorId: mentor.id,
					workspaceId: workspaceId
				}
			})
		}
	}, [newGroupId])
	return [createGroup, newGroupId, createGroupLoading, createGroupError];
}

export const CREATE_GROUP_MENTOR = gql`
	mutation createGroupMentor($groupMentorCreateRequestDto: GroupMentorCreateRequestDto) {
  		groupMentorTableId:createGroupMentor(groupMentorCreateRequestDto:$groupMentorCreateRequestDto)
	}
`
export const useCreateGroupMentorRepo = () => {
	const [createGroupMentor, {
		data: groupMentorTableId,
		loading: groupMentorLoading,
		error: createGroupMentorError
	}] = useMutation(CREATE_GROUP_MENTOR, {
		// update(cache, { data: { group } }) {
		// 	const { groups } = cache.readQuery({ query: CREATE_GROUP });
		// 	cache.writeQuery({
		// 		query: GET_ALL_GROUP,
		// 		data: {
		// 			groups: [group, ...groups]
		// 		},
		// 	})
		// }
	});
	console.log(groupMentorTableId)
	return [createGroupMentor, groupMentorTableId, groupMentorLoading, createGroupMentorError];
}
export const GET_STUDENTS_GROUP = gql`
	query findAllStudentGroup{
	  students:findAllStudentGroup{
		id
		student{
		  id
		  status{
			name
		  }
		  user{
			userRole{
			  role{
				name
			  }
			}
		  }
		  hardskill
		  softskill
		}
		course{
		  name
		}
	  }
	}
`

export const DELETE_GROUP = gql`
	mutation deleteGroup ($id:ID!){
	  deleteGroup (id:$id){
		id
		workspaceId
		name
	  }
	}
`

export const GET_GROUP = gql`
query findByIdGroup($id:ID!){
  group: findByIdGroup(id:$id){
	id
    workspace{
      id
      name
    }
    name
    bestHomework{
      id
      needCheck
      weekNumber
    }
    bestStudent{
      id
      status{
        name
      }
      user{
        id
        firstName
        firstName
      }
    }
    course{
      id
      name
    }
    startDate
    endDate
    paymentDate
    mentors{
      id
      mentorName
    }
    schedules{
      id
      dateStart
      dateEnd
      open
      lesson{
        id
        block{
          name
        }
        name
        description
        duration
        title
        lessonNumber
        lessonTasks{
          id
          title
          description
          task{
            type
          }
          isExtra
        }
      }
    }
  }
}
`

export const useLoadAllGroupsRepo = () => {
	const {data, loading, error: loadAllGroupError} = useQuery(GET_ALL_GROUP);
	return {data, loading, loadAllGroupError};
}


export const useLoadStudentOfGroupRepo = () => {                                  //todo:filter
	const {data, loading: studentsLoading} = useQuery(GET_STUDENTS_GROUP); //todo дописать параметр поиска
	return {data, studentsLoading};
}

export const useDeleteGroupRepo = () => {
	const [deleteGroup, {error: deleteGroupError}] = useMutation(DELETE_GROUP, {
		update(cache, {data: {deleteGroup}}) {
			cache.modify({
				fields: {
					groups(currentGroups = []) {
						return currentGroups.filter(
							post => post.__ref !== `Group:${deleteGroup.id}`
						)
					}
				}
			})
		}
	});
	return [deleteGroup, deleteGroupError];
}

export const useLoadGroupRepo = (groupId) => {
	const {data, loading: groupLoading, error: loadGroupError} = useQuery(GET_GROUP, {
		variables: {
			id: groupId
		}
	});

	if(data && !groupLoading) {
		if(data.group.schedules.length === 1) {
			const testLesson = {
				dateEnd: "2023-09-20T10:55:06.000Z",
				dateStart: "2023-09-16T10:55:06.000Z",
				id: "a9667201-89ec-47da-9589-688d5e01a75c",
				lesson: {
					block: {
						name: 'HTML + CSS'
					},
					description: "Знакомимся с инструментами и тегами",
					duration: null,
					id: "77bae5ae-a350-4198-948a-6d4a2491aef8",
					lessonNumber: 2,
					lessonTasks: [
						{
							description: "Знакомимся с инструментами и тегами",
							id: "2-48ce0ab7c0864b74a229829f8697224a",
							isExtra: true,
							task: {__typename: 'Task', type: 'THEME'},
							title: "lesson 2",
						}
					],
					name: "Знакомство с тегами",
					title: "some title",
				},
				open: false,
			}
			data.group.schedules.push(testLesson);
		}

	}
	return {data, groupLoading, loadGroupError};
}
