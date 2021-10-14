import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import NotificationSettingsList from "../components/NotificationSettingsList";
import PageLoading from "../components/PageLoading";
import PageTitle from "../components/PageTitle";
import settingsApi from "../api/settingsApi";
import { useEffect } from "react";
import { useState } from "react";

export default function AccountNotificationSettingsPage() {
	const [settings, setSettings] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		document.title = "Notification Settings";
		async function fetchData() {
			try {
				setLoading(true);
				let { data } = await settingsApi.getNotificationSettings();
				setSettings(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	function handleSettingChanged(updatedSetting) {
		setSettings((currentSettings) => {
			return currentSettings.map((setting) =>
				setting.id === updatedSetting.id ? updatedSetting : setting
			);
		});
	}

	if (loading) return <PageLoading />;

	return (
		<div>
			<Link to="/account">
				<Button variant="open" color="gray">
					<div className="flex-center">
						<ArrowNarrowLeftIcon className="mr-4 w-4 h-4" />
						Menu
					</div>
				</Button>
			</Link>
			<PageTitle title="Notification settings" />
			<p className="leading-relaxed lg:px-2 mb-4">
				You can configure the way you receive notifications below. Each type of notification can be
				customized, meaning you can opt to receive event reminders through text messages while
				receiving other notifications through email.
			</p>
			<NotificationSettingsList settings={settings} onSettingChanged={handleSettingChanged} />
		</div>
	);
}
