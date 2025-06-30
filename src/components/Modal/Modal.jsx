import "./Modal.css";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import closeIcon from "../../assets/close.png";

export default function Modal({ name, onClose, children }) {
  useEffect(() => {
    if (!name) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [name, onClose]);

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!name) return null;

    return (
      <div className="modal" onClick={handleOverlay}>
        <div className={`modal__container modal__container_${name}`}>
          <button onClick={onClose} type="button" className="modal__close">
            <img src={closeIcon} alt="close" className="modal__close-icon" />
          </button>
          {children}
        </div>
      </div>
    );
  }

Modal.propTypes = {
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
