import {useLoadAllGroupsRepo} from "../../repositories/GroupRepository";

export const useGetAllGroupsService = (workspaceId) => {
	const {data, loading} = useLoadAllGroupsRepo();
	return {data, loading};
}

