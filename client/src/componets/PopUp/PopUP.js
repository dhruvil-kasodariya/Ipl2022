import React, { useState } from "react";
import AddEdit from "../AddEdit/AddEdit";
import View from "../View/View";
import "./PopUp.css";

function PopUP({ id, buttonValue, GrView, GrEdit }) {
  const [popUp, setPopUp] = useState(false);

  if (popUp) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleModel = () => {
    setPopUp(!popUp);
  };
  return (
    <div>
      {buttonValue ? (
        <button onClick={handleModel} className="btn-view">
          {GrView}
        </button>
      ) : id ? (
        <button onClick={handleModel} className="btn-edit">
          {GrEdit}
        </button>
      ) : (
        <button onClick={handleModel} className="btn-add">
          Add
        </button>
      )}
      {popUp && (
        <div className="modal">
          <div className="overlay" onClick={handleModel} />
          <div className="modal-content">
            {!buttonValue ? (
              <AddEdit id={id} setPopUp={setPopUp} popUp={popUp} />
            ) : (
              <View id={id} />
            )}
            <button className="btn-close" onClick={handleModel}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopUP;
