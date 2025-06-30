import React from "react";
import "./ModalWithForm.css";
import PropTypes from "prop-types";
import Modal from "../Modal";

export default function ModalWithForm({
  children,
  title,
  buttonText,
  activeModal,
  closeActiveModal,
  onSubmit,
  isFormValid,
  modalName,
  altAction = null,
}) {
  return activeModal === modalName ? (
    <Modal name={modalName} onClose={closeActiveModal}>
      <h2 className="modal__title">{title}</h2>
          <form onSubmit={onSubmit} className="modal__form">
            {children}
            <div className="modal__button-wrapper">
              <button
                type="submit"
                className="modal__submit"
                disabled={!isFormValid}
              >
                {buttonText}
              </button>

              {altAction && (<div className="modal__alt-action">{altAction}</div>)}
            </div>            
          </form>
    </Modal>
  ) : null;
}

ModalWithForm.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  buttonText: PropTypes.string.isRequired,
  activeModal: PropTypes.string.isRequired,
  closeActiveModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  modalName: PropTypes.string.isRequired,
  altAction: PropTypes.node,
};
