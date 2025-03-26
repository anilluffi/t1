import React from "react";
// import "./style.css";
import { NowDetailConteinerProps } from "./type";
export const NowDetailConteiner: React.FC<NowDetailConteinerProps> = ({
  temp,
  wind,
  pressure,
  humidity,
}) => {
  return (
    <div className="conteiner-w-now h-100">
      <div className="detail-conteiner">
        <h1 className="display-1 text-center text-white">{temp}</h1>

        <div className="details-w-now d-flex justify-content-around align-items-center  text-white px-3">
          <div>
            <h3>wind</h3> <h2>{wind}</h2>
          </div>
          <div>
            <h3>pressure</h3> <h2>{pressure}</h2>
          </div>
          <div>
            <h3>humidity</h3> <h2>{humidity}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
