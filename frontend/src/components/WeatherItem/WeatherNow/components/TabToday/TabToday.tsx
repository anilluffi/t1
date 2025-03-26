import "./style.css";
import { TabTodayProps } from "./type";

export const TabToday: React.FC<TabTodayProps> = ({
  tempMin,
  tempMax,
  iconUrl,
}) => {
  const date = new Date();

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mini-tab">
      <div className="mini-tab-info">
        <h5>{formattedDate}</h5>
        <p className="text-time">Today</p>
        <div className="temperature">
          <h6>
            {tempMin} {tempMax}°
          </h6>
        </div>
      </div>
      <img src={iconUrl} alt="Weather icon" className="icon" />
    </div>
  );
};
