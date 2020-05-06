import React from "react";
import "./Switch.scss";

const Switch = ({ isOn, handleToggle, switchType }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className={["react-switch-checkbox", switchType].join(" ")}
        id={`react-switch-new`}
        type="checkbox"
      />
      <label className="react-switch-label" htmlFor={`react-switch-new`}>
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;
