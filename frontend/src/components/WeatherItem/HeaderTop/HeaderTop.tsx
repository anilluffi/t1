import "./style.css";
export const HeaderTop = () => {
  return (
    <div className="header-top">
      <h4 className="me-5">Meteofor</h4>
      <div className=" d-flex  w-100 justify-content-between">
        <div className="input-group w-25">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            className="form-control"
            placeholder="Search"
            aria-label="Search"
          />
        </div>

        <select className="custom-select">
          <optgroup label="Temperature">
            <option value="celsius" selected>
              °C
            </option>
            <option value="fahrenheit">°F</option>
          </optgroup>
          <optgroup label="Wind Speed">
            <option value="m/s" selected>
              m/s
            </option>
            <option value="km/h">km/h</option>
            <option value="miles/h">miles/h</option>
          </optgroup>
          <optgroup label="Pressure">
            <option value="mmhg" selected>
              mmHg
            </option>
            <option value="hpa">hPa</option>
          </optgroup>
          <optgroup label="Language">
            <option value="en" selected>
              En
            </option>
            <option value="ru">Ru</option>
          </optgroup>
          <optgroup label="Theme">
            <option value="light">Light theme</option>
            <option value="dark">Dark theme</option>
            <option value="system">System theme</option>
          </optgroup>
        </select>
      </div>
    </div>
  );
};
