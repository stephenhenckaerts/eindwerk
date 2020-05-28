import React from "react";

import Button from "../UI/Button/Button";
import styles from "./DeleteFeatureForm.module.scss";

const DeleteFeatureForm = (props) => {
  return (
    <div className={styles.ContactData}>
      <h4 className={styles.FormTitle}>
        {props.selectedFeature.name} verwijderen?
      </h4>
      <div className={styles.ButtonDiv}>
        <Button btnType="Success" clicked={props.formClosed}>
          ANNULEER
        </Button>
        <Button btnType="Danger" clicked={props.onDeleteFeature}>
          VERWIJDER
        </Button>
      </div>
    </div>
  );
};

export default DeleteFeatureForm;
