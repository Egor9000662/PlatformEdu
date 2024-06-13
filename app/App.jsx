import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import LoginForm from './common/pages/Form/LoginForm/LoginForm';
import Form from './common/pages/Form/SignUpForm/Form';
import Loader from './common/pages/Loader/Loader';
import AppStudent from './student/pages/App/App';
import AppTeacher from './teacher/pages/App/App';
import AppAdmin from './admin/pages/App/App';
import AppOwner from './owner/pages/App/App';
import Background from "./assets/images/background-desktop.jpg";
import ForgotPasswordForm from './common/pages/Form/ForgotPasswordForm/ForgotPasswordForm';
import { useReadUser } from "./common/apollo/localState/UserLocalState";
import { useLoadByRoleIdUserRepo } from "./common/repositories/UserRepository";

export const signupPath = '/signup';

function AuthUser() {
	return (
		<Switch>
			<Route path={signupPath}>
				<Form />
			</Route>
			<Route path="/login">
				<LoginForm />
			</Route>
			<Route path="/forgot-password">
				<ForgotPasswordForm />
			</Route>
			<Redirect to="/login" />
		</Switch>
	);
}

function App() {
	const { currentUser, readUserFromCacheLoading } = useReadUser();
	const { data: role, loading, error } = useLoadByRoleIdUserRepo(currentUser?.currentUser.roleId);

	if (loading || readUserFromCacheLoading) {
		return <Loader />;
	}
	if (!currentUser?.currentUser.username || !currentUser?.currentUser.roleId) {
		return <AuthUser />;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	const userRole = role.user.role.name;
	const userId = role.user.user.id;

	return (
		<>
			<div
				className="upperSide"
				style={{
					background: `url(${Background})`,
					backgroundSize: 'cover',
				}}
			>
				{userRole === 'STUDENT' && <AppStudent userId={userId}/>}
				{userRole === 'ADMIN' && <AppAdmin  userId={userId}/>}
				{/*{role === 'teacher' && <AppTeacher />}*/}
				{/*{role === 'owner' && <AppOwner />}*/}
			</div>
		</>
	);
}

export default App;
