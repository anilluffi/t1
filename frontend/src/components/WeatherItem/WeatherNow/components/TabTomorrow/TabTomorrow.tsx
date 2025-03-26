import "./style.css";
import { TabTomorrowProps } from "./type";

export const TabTomorrow: React.FC<TabTomorrowProps> = ({
  tempMin,
  tempMax,
  iconUrl,
}) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mini-tab">
      <div className="mini-tab-info">
        <h5>{formattedDate}</h5>
        <p className="text-time">Tomorrow</p>
        <div className="temperature">
          <h6>
            {tempMin}° {tempMax}°
          </h6>
        </div>
      </div>
      <img src={iconUrl} alt="Weather icon" className="icon" />
    </div>
  );
};
