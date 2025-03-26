import "./style.css";
import { TabNowProps } from "./type";
export const TabNow: React.FC<TabNowProps> = ({ temp, iconUrl }) => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="mini-tab">
      <div className="mini-tab-info ">
        <h5>Now</h5>
        <p className="text-time">{time}</p>

        <h5>{temp}</h5>
      </div>

      <img src={iconUrl} alt="Weather icon" className="icon" />
    </div>
  );
};
