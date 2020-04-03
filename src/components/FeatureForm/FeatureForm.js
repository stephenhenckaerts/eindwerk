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
          placeholder: "Perceelsnaam"
        },
        label: "Naam Perceel",
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      area: {
        elementType: "number",
        elementConfig: {
          type: "number",
          placeholder: "Oppervlakte"
        },
        label: "Grond oppervlakte",
        value: this.props.selectedFeature.getProperties().OPPERVL.toFixed(0),
        metric: "m²",
        validation: {
          required: true,
          isNumeric: true
        },
        valid: true,
        touched: false
      },
      cropGroupName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Gewasgroepsnaam"
        },
        label: "Gewasgroepsnaam",
        value: this.props.selectedFeature.getProperties().GEWASGROEP,
        validation: {
          required: true
        },
        valid: true,
        touched: false
      },
      cropName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Gewasnaam"
        },
        label: "Gewasnaam",
        value: this.props.selectedFeature.getProperties().LBLHFDTLT,
        validation: {
          required: true
        },
        valid: true,
        touched: false
      },
      comments: {
        elementType: "textarea",
        elementConfig: {
          type: "text",
          placeholder: ""
        },
        label: "Opmerkingen",
        value: "",
        validation: {
          required: false
        },
        valid: true,
        touched: false
      }
    },
    formIsValid: false
  };

  orderHandler = event => {
    event.preventDefault();

    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    const plot = {
      plotId: this.props.selectedFeature.id_,
      coords: this.props.selectedFeature.getProperties().geometry.extent_,
      name: this.state.orderForm.name.value,
      area: this.state.orderForm.area.value,
      cropGroupName: this.state.orderForm.cropGroupName.value,
      cropName: this.state.orderForm.cropName.value,
      comments: this.state.orderForm.comments.value
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
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
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
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
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
            changed={event => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <div className={styles.ButtonDiv}>
          <Button btnType="Danger" clicked={this.props.formClosed}>
            ANNULEER
          </Button>
          <Button btnType="Success" disabled={!this.state.formIsValid}>
            VOEG TOE
          </Button>
        </div>
      </form>
    );
    return (
      <div className={styles.ContactData}>
        <h4 className={styles.FormTitle}>Nieuw Perceel Toevoegen</h4>
        {form}
      </div>
    );
  }
}

export default FeatureForm;
