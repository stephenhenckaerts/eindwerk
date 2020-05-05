import React from "react";

import styles from "./PlotSideBar.module.scss";
import percelenLogo from "../../../assets/Sidebar/polygon.png";
import backLogo from "../../../assets/Sidebar/back.png";
import { NavLink } from "react-router-dom";
import Spinner from "../../UI/Spinner/Spinner";
import Button from "../../UI/Button/Button";

const PlotSideBar = (props) => {
  let userPlot = null;
  let feature = props.feature;
  if (props.loading && feature === null) {
    userPlot = <Spinner />;
  } else {
    if (feature != null) {
      userPlot = (
        <div className={styles.PlotDiv}>
          <h3>Naam</h3>
          <p>{feature.name}</p>
          <h3>Gewasgroepnaam</h3>
          <p>{feature.cropGroupName}</p>
          <h3>Gewasnaam</h3>
          <p>{feature.cropName}</p>
          <h3>Oppervlak</h3>
          <p>{(feature.area / 10000).toFixed(2)} ha</p>
          <h3>Opmerkingen</h3>
          <p>{feature.comments}</p>
          <div className={styles.ButtonsDiv}>
            <Button
              btnType="Info"
              className={[styles.PopupButton, styles.ClosePopupButton].join(
                " "
              )}
              clicked={() => props.plotNoted()}
            >
              Notities
            </Button>
            <Button
              btnType="Info"
              className={[styles.PopupButton, styles.ClosePopupButton].join(
                " "
              )}
              clicked={() => props.plotCompare()}
            >
              Vergelijk
            </Button>
            <Button
              btnType="SuccessLight"
              className={[styles.PopupButton, styles.ClosePopupButton].join(
                " "
              )}
              clicked={() => props.plotUpdate()}
            >
              Aanpassen
            </Button>
            <Button
              btnType="Danger"
              className={[styles.PopupButton, styles.ClosePopupButton].join(
                " "
              )}
              clicked={() => props.plotDeleted(feature.plotId)}
            >
              Verwijder
            </Button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={styles.Sidebar}>
      <div className={styles.SidebarHeaderItem}>
        <img src={percelenLogo} alt="Percelen Logo" />
        <div className={styles.SidebarTopTitle}>
          <p>MIJN</p>
          <p>PERCELEN</p>
        </div>
      </div>
      <NavLink to="/percelen" style={{ textDecoration: "none" }}>
        <div className={styles.SidebarItem}>
          <img src={backLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>Overzicht</p>
          </div>
        </div>
      </NavLink>
      {userPlot}
    </div>
  );
};

export default PlotSideBar;
