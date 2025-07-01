import React from "react";
import "./Preloader.css";
import PropTypes from "prop-types";

export default function Preloader({text}) {
  return (
    <div className="preloader">
      <div className="preloader__spinner"></div>
      <p className="preloader__text">{text}</p>
    </div>
  );
}

Preloader.propTypes = {
  text: PropTypes.string,
};