import React, { useContext, useState, useEffect } from "react";
import Navbar from "components/Navbar/Navbar";
import Modal from "components/Modal/Modal";
import "./App.scss";
import { UserContext } from "context/UserContext";
import { WarningNotificationContext } from "context/WarningNotificationContext";

import Routes from "routes/Routes";

import Footer from "components/Footer/Footer";
import LoadingOverlay from "components/LoadingOverlay/LoadingOverlay";
import fetchData from "helper/fetchData";
import WarningNotification from "components/WarningNotification/WarningNotification";


function App() {
	const [{ authStatus, theme }, dispatchUser] = useContext(UserContext);
	const [{
		type: WarningNotificationType,
		message: WarningNotificationMessage,
		show: WarningNotificationShow
	}] = useContext(WarningNotificationContext);
	const [authLoading, setAuthLoading] = useState(true);

	useEffect(() => {
		const checkUserAuthentication = async () => {
			const { data, status } = await fetchData({
				url: "/isAuth",
				token: true,
				method: "GET",
			});
			if (status === 401) dispatchUser({ type: "LOGIN_FAIL" });
			if (!!data) dispatchUser({ type: "LOGIN_SUCCESS", payload: { user: data.user } });
		};
		checkUserAuthentication();

		return () => { };
	}, [dispatchUser]);

	useEffect(() => {
		if (authStatus === "success" || authStatus === "failed") setAuthLoading(false);
		return () => { };
	}, [authStatus]);

	return (
		<div className={`App ${theme ? "theme-light" : "theme-dark"}`}>
			<WarningNotification show={WarningNotificationShow} message={WarningNotificationMessage} type={WarningNotificationType} />
			<Modal />
			<Navbar isAuth={authStatus === "success"} />
			<LoadingOverlay classes={["authentication-loading"]} show={authLoading} opacity={0}>
				<Routes />
			</LoadingOverlay>
			<Footer />
		</div>
	);
}

export default App;
