import React, { Component } from "react";

import styles from "./DetailedInfo.module.scss";

import Aux from "../../../../hoc/Aux/Aux";
import backLogo from "../../../../assets/CompareSidebar/back.svg";

class DetailedInfo extends Component {
  getFirstUppercaseIndex(type) {
    let index = -1;
    for (let i = 0; i < type.length; i++) {
      if (
        type.charAt(i) === type.charAt(i).toUpperCase() &&
        type.charAt(i).match(/[a-z]/i)
      ) {
        index = i;
      }
    }
    return index;
  }

  getTextuurKlasse(type) {
    let textuurKlasse = type;
    let index = this.getFirstUppercaseIndex(type);
    switch (type.charAt(index)) {
      case "Z":
        textuurKlasse = "Zand";
        break;
      case "S":
        textuurKlasse = "Lemig Zand";
        break;
      case "P":
        textuurKlasse = "Licht Zandleem";
        break;
      case "L":
        textuurKlasse = "Zandleem";
        break;
      case "A":
        textuurKlasse = "Leem";
        break;
      case "E":
        textuurKlasse = "Klei";
        break;
      case "U":
        textuurKlasse = "Zware Klei";
        break;
      default:
        textuurKlasse = "Onbekend";
    }
    return textuurKlasse;
  }

  getDraineringsKlasse(type) {
    let textuurKlasse = type;
    let index = this.getFirstUppercaseIndex(type);
    if (type.charAt(index + 1)) {
      if (["A", "L", "E", "U", "G"].includes(type.charAt(index))) {
        switch (type.charAt(index + 1)) {
          case "c":
            textuurKlasse = "Zwak gleyige gronden";
            break;
          case "d":
            textuurKlasse = "Matig gleyige gronden";
            break;
          case "e":
            textuurKlasse = "Sterk gleyige gronden met reductiehorizon";
            break;
          case "f":
            textuurKlasse = "Zeer sterk gleyige gronden met reductiehorizont";
            break;
          case "g":
            textuurKlasse = "Gereduceerde gronden";
            break;
          case "h":
            textuurKlasse = "Sterk gleyige gronden";
            break;
          case "i":
            textuurKlasse = "Zeer sterk gleyige gronden";
            break;
          default:
            textuurKlasse = "Onbekend";
        }
      }
      if (["Z", "S", "P"].includes(type.charAt(index))) {
        switch (type.charAt(index + 1)) {
          case "a":
            textuurKlasse = "Zeer droge gronden";
            break;
          case "b":
            textuurKlasse = "Droge gronden";
            break;
          case "c":
            textuurKlasse = "Matig droge gronden";
            break;
          case "d":
            textuurKlasse = "Matig natte gronden";
            break;
          case "e":
            textuurKlasse = "Natte gronden";
            break;
          case "f":
            textuurKlasse = "Zeer natte gronden";
            break;
          case "g":
            textuurKlasse = "Uiterst natte gronden";
            break;
          case "h":
            textuurKlasse = "Natte gronden met relatief hoge ligging";
            break;
          case "i":
            textuurKlasse = "Zeer natte gronden met relatief hoge ligging";
            break;
          default:
            textuurKlasse = "Onbekend";
        }
      }
    }
    return textuurKlasse;
  }

  getSubstraatSymbol(type) {
    let substraatSymbol = "";
    let index = this.getFirstUppercaseIndex(type);
    if (index !== 0) {
      if (index === 1) {
        substraatSymbol = type.charAt(0);
      }
      if (index === 3) {
        substraatSymbol = type.charAt(1);
      }
    }
    return substraatSymbol;
  }

  getSubstraatKlasse(type) {
    let substraatklasse = "Geen substraatklasse";
    let substraatSymbol = this.getSubstraatSymbol(type);
    if (substraatSymbol !== "") {
      switch (substraatSymbol) {
        case "f":
          substraatklasse = "Schiefersubstraat";
          break;
        case "g":
          substraatklasse = "Grintsubstraat of stenig substraat";
          break;
        case "h":
          substraatklasse = "Leemsubstraat";
          break;
        case "l":
          substraatklasse = "Mergelsubstraat";
          break;
        case "m":
          substraatklasse = "Krijtsubstraat";
          break;
        case "n":
          substraatklasse = "Krijtsubstraat";
          break;
        case "p":
          substraatklasse = "Psammietsubstraat";
          break;
        case "q":
          substraatklasse = "Zandsteensubstraat";
          break;
        case "r":
          substraatklasse = "Schier-zandsteensubstraat";
          break;
        case "s":
          substraatklasse = "Zandsubstraat";
          break;
        case "t":
          substraatklasse = "Terrassubstraat";
          break;
        case "u":
          substraatklasse = "Kleisubstraat";
          break;
        case "v":
          substraatklasse = "Veensubstraat";
          break;
        case "w":
          substraatklasse = "Klei-zandsubstraat";
          break;
        case "x":
          substraatklasse = "Onbepaald substraat";
          break;
        case "z":
          substraatklasse = "Kalkhoudend zandsubstraat";
          break;
        default:
          substraatklasse = "Onbekende substraatklasse";
          break;
      }
      if (
        substraatklasse !== "Onbekende substraatklasse" &&
        substraatklasse !== "Onbepaald substraat"
      ) {
        let index = this.getFirstUppercaseIndex(type);
        if (index === 3) {
          substraatklasse += " op matige diepte (tussen 75 en 125 cm)";
        } else if (index === 1) {
          substraatklasse += " op geringe diepte (ondieper dan 75 cm)";
        } else {
          substraatklasse += " op geringe of matige diepte";
        }
      }
    }
    return substraatklasse;
  }

  getSpecialType(type) {
    let specialType = "";
    switch (type) {
      case "B":
        specialType = "Bronzones";
        break;
      case "R":
        specialType = "Stenige valleibodems";
        break;
      case "S":
        specialType = "Lemige valleibodems";
        break;
      case "J":
        specialType = "Rotsontsluitingen";
        break;
      case "X":
        specialType = "Duinen";
        break;
      case "W":
        specialType = "Hoogveen";
        break;
      case "V":
        specialType = "Veengronden";
        break;
      case "M":
        specialType = "Mergelgronden";
        break;
      case "N":
        specialType = "Krijtgronden";
        break;
      case "OB":
        specialType = "Bebouwde zone";
        break;
      case "OE":
        specialType = "Groeve";
        break;
      case "ON":
        specialType = "Opgehoogd terrein";
        break;
      case "OT":
        specialType = "Vergraven terrein";
        break;
      default:
        specialType = "Onbepaald gebied";
        break;
    }
    return specialType;
  }

  render() {
    let detailedInfo = null;
    if (this.props.type.length > 2) {
      detailedInfo = (
        <div className={styles.typeTable}>
          <div className={styles.typeTableElement}>
            <p>Textuurklasse:</p>
            <p>{this.getTextuurKlasse(this.props.type)}</p>
          </div>
          <div className={styles.typeTableElement}>
            <p>Draineringsklasse:</p>
            <p>{this.getDraineringsKlasse(this.props.type)}</p>
          </div>
          <div className={styles.typeTableElement}>
            <p>Substraatklasse:</p>
            <p>{this.getSubstraatKlasse(this.props.type)}</p>
          </div>
        </div>
      );
    } else {
      detailedInfo = (
        <div className={styles.specialType}>
          {this.getSpecialType(this.props.type)}
        </div>
      );
    }
    return (
      <Aux>
        <div className={styles.backButtonDiv}>
          <div
            className={styles.backButton}
            onClick={() => this.props.returnClicked()}
          >
            <img src={backLogo} alt="Percelen Logo" />
            <p>Terug</p>
          </div>
        </div>
        <div className={styles.typeHeader}>
          <h1>{this.props.type}</h1>
        </div>
        {detailedInfo}
      </Aux>
    );
  }
}

export default DetailedInfo;
