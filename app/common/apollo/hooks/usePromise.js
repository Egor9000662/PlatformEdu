import {useEffect, useState} from "react";

export function usePromise(promiseFn, deps = [], initialData = undefined) {
	const [state, setState] = useState({ data: initialData, loading: false, error: undefined });

	async function loadUser() {
		let promise = promiseFn();
		if (promise) {
			setState({...state, loading: true});
			try {
				const newData = await promise;
				setState({...state, loading: false, data: newData});
			} catch (error) {
				setState({...state, loading: false, error});
			}
		}
	}

	useEffect(() => {
		loadUser();
	}, deps);

	return state;
}
