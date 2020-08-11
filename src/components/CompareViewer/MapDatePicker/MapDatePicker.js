import React, { Component } from "react";

import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";

import styles from "./MapDatePicker.module.scss";
import "react-datepicker/dist/react-datepicker.css";

class MapDatePicker extends Component {
  state = {
    startDate: new Date(),
    allowedDates: [],
  };

  componentDidMount() {
    let date = new Date(
      this.convertDate(
        this.props.map.topLayer.layerinfo.layerTimes[
          this.props.map.topLayer.selectedDate
        ].date
      )
    );
    let availableDates = [];
    this.props.map.topLayer.layerinfo.layerTimes.forEach((layerTime) => {
      availableDates.push(parseISO(this.convertDate(layerTime.date)));
    });
    this.setState({ startDate: date, allowedDates: availableDates });
  }

  convertDate(date) {
    return date.substring(0, date.length - 10);
  }

  handleChange = (date) => {
    let formatedDate = date.getFullYear() + "-";
    if (parseInt(date.getMonth() + 1) < 9) {
      formatedDate += "0" + (parseInt(date.getMonth()) + 1) + "-";
    } else {
      formatedDate += parseInt(date.getMonth()) + 1 + "-";
    }

    if (parseInt(date.getDate()) < 9) {
      formatedDate += "0" + parseInt(date.getDate());
    } else {
      formatedDate += parseInt(date.getDate());
    }
    for (
      let i = 0;
      i < this.props.map.topLayer.layerinfo.layerTimes.length;
      i++
    ) {
      let arrayDate = this.convertDate(
        this.props.map.topLayer.layerinfo.layerTimes[i].date
      );
      if (arrayDate === formatedDate) {
        this.props.changeDateHandler(0, this.props.map, i);
        break;
      }
    }
    this.updateDate();
  };

  handleArrowClicked = (amount) => {
    this.props.changeDateHandler(amount, this.props.map);
    this.updateDate();
  };

  updateDate = () => {
    let date = new Date(
      this.convertDate(
        this.props.map.topLayer.layerinfo.layerTimes[
          this.props.map.topLayer.selectedDate
        ].date
      )
    );
    let availableDates = [];
    this.props.map.topLayer.layerinfo.layerTimes.forEach((layerTime) => {
      availableDates.push(parseISO(this.convertDate(layerTime.date)));
    });
    this.setState({ startDate: date });
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div className={styles.InfoDiv}>
        <p className={styles.Arrow} onClick={() => this.handleArrowClicked(-1)}>
          &lt;
        </p>

        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          dateFormat="yyyy-MM-dd"
          includeDates={this.state.allowedDates}
          highlightDates={this.state.allowedDates}
          className={styles.DatePicker}
          onChangeRaw={this.handleDateChangeRaw}
        />
        <p
          className={styles.Arrow}
          onClick={() => {
            this.handleArrowClicked(1);
          }}
        >
          &gt;
        </p>
      </div>
    );
  }
}

export default MapDatePicker;
