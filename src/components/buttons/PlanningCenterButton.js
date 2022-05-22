import PlanningCenterLogo from "../../images/planning-center-white.svg";

export default function PlanningCenterButton() {
  return (
    <button
      className="focus:outline-none outline-none flex-center rounded-md shadow-md p-2 bg-blue-600 cursor-default"
      style={{ height: "40px" }}
      disabled
    >
      <img
        src={PlanningCenterLogo}
        style={{ height: "100%" }}
        alt="Planning Center"
      />
    </button>
  );
}
