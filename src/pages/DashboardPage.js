import { useEffect } from "react";
import Welcome from "../components/Welcome";

export default function DashboardPage() {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);
  return <Welcome />;
}
