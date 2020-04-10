import React, { Component } from "react";

import styles from "./FeatureForm.module.scss";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

class FeatureForm extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Perceelsnaam",
        },
        label: "Naam Perceel",
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      area: {
        elementType: "number",
        elementConfig: {
          type: "number",
          placeholder: "Oppervlakte",
        },
        label: "Grond oppervlakte",
        value: "",
        metric: "m²",
        validation: {
          required: true,
          isNumeric: true,
        },
        valid: true,
        touched: false,
      },
      cropGroupName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Gewasgroepsnaam",
        },
        label: "Gewasgroepsnaam",
        value: "",
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
      cropName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Gewasnaam",
        },
        label: "Gewasnaam",
        value: "",
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
      comments: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: "",
        },
        label: "Opmerkingen",
        value: "",
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
      },
    },
    formIsValid: false,
  };

  componentDidMount() {
    let feature = null;
    if (this._reactInternalFiber._debugOwner.type.name === "HomeMap") {
      feature = {
        name: "",
        area: this.props.selectedFeature.getProperties().OPPERVL.toFixed(0),
        cropGroupName: this.props.selectedFeature.getProperties().GEWASGROEP,
        cropName: this.props.selectedFeature.getProperties().LBLHFDTLT,
        comments: "",
      };
    } else {
      feature = this.props.selectedFeature;
    }

    this.setState((prevState) => ({
      orderForm: {
        ...prevState.orderForm,
        name: {
          ...prevState.orderForm.name,
          value: feature.name,
        },
        area: {
          ...prevState.orderForm.area,
          value: feature.area,
        },
        cropGroupName: {
          ...prevState.orderForm.cropGroupName,
          value: feature.cropGroupName,
        },
        cropName: {
          ...prevState.orderForm.cropName,
          value: feature.cropName,
        },
        comments: {
          ...prevState.orderForm.comments,
          value: feature.comments,
        },
      },
    }));

    if (this._reactInternalFiber._debugOwner.type.name === "PlotMap") {
      this.setState({ formIsValid: true });
      this.setState((prevState) => ({
        orderForm: {
          ...prevState.orderForm,
          name: {
            ...prevState.orderForm.name,
            valid: true,
          },
          area: {
            ...prevState.orderForm.area,
            valid: true,
          },
          cropGroupName: {
            ...prevState.orderForm.cropGroupName,
            valid: true,
          },
          cropName: {
            ...prevState.orderForm.cropName,
            valid: true,
          },
          comments: {
            ...prevState.orderForm.comments,
            valid: true,
          },
        },
      }));
    }
  }

  orderHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    let geometry = null;
    let coords = null;
    let geometryArray = [];
    let id = null;

    if (this._reactInternalFiber._debugOwner.type.name === "HomeMap") {
      geometry = this.props.selectedFeature.getProperties().geometry
        .flatCoordinates;
      coords = this.props.selectedFeature.getProperties().geometry.extent_;
      id = this.props.selectedFeature.id_;
      while (geometry.length) geometryArray.push(geometry.splice(0, 2));
    } else if (this._reactInternalFiber._debugOwner.type.name === "PlotMap") {
      geometryArray = this.props.selectedFeature.geometry;
      coords = this.props.selectedFeature.coords;
      id = this.props.selectedFeature.plotId;
    }
    const plot = {
      plotId: id,
      geometry: geometryArray,
      coords: coords,
      name: this.state.orderForm.name.value,
      area: this.state.orderForm.area.value,
      cropGroupName: this.state.orderForm.cropGroupName.value,
      cropName: this.state.orderForm.cropName.value,
      comments: this.state.orderForm.comments.value,
    };
    this.props.onAddPlot(plot);
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm,
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            label={formElement.config.label}
            metric={formElement.config.metric}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <div className={styles.ButtonDiv}>
          <Button btnType="Danger" clicked={this.props.formClosed}>
            ANNULEER
          </Button>
          <Button btnType="Success" disabled={!this.state.formIsValid}>
            {this._reactInternalFiber._debugOwner.type.name === "HomeMap"
              ? "VOEG TOE"
              : "PAS AAN"}
          </Button>
        </div>
      </form>
    );
    return (
      <div className={styles.ContactData}>
        <h4 className={styles.FormTitle}>
          {this._reactInternalFiber._debugOwner.type.name === "HomeMap"
            ? "Nieuw Perceel Toevoegen"
            : "Perceel Aanpassen"}
        </h4>
        {form}
      </div>
    );
  }
}

export default FeatureForm;
