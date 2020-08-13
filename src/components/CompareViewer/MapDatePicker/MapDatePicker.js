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
    this.updateDate();
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
    let dates = null;
    if (this.props.layer.item === "MapEO") {
      dates = this.props.layer.layerinfo.layerTimes;
    } else if (this.props.layer.item === "Sentinel") {
      dates = this.props.layer.dates;
    }
    for (let i = 0; i < dates.length; i++) {
      let arrayDate = new Date();
      if (this.props.layer.item === "MapEO") {
        arrayDate = this.convertDate(dates[i].date);
      } else if (this.props.layer.item === "Sentinel") {
        arrayDate = dates[i];
      }
      if (arrayDate === formatedDate) {
        this.props.changeDateHandler(0, this.props.map, i, this.props.slide);
        break;
      }
    }
    this.updateDate();
  };

  handleArrowClicked = (amount) => {
    this.props.changeDateHandler(
      amount,
      this.props.map,
      undefined,
      this.props.slide
    );
    this.updateDate();
  };

  updateDate = () => {
    let date = new Date();
    let availableDates = [];
    if (this.props.layer.item === "MapEO") {
      date = new Date(
        this.convertDate(
          this.props.layer.layerinfo.layerTimes[this.props.layer.selectedDate]
            .date
        )
      );
      this.props.layer.layerinfo.layerTimes.forEach((layerTime) => {
        availableDates.push(parseISO(this.convertDate(layerTime.date)));
      });
    } else if (this.props.layer.item === "Sentinel") {
      date = new Date(this.props.layer.dates[this.props.layer.selectedDate]);
      availableDates = this.props.layer.availableDates;
    }
    this.setState({ startDate: date, allowedDates: availableDates });
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div
        className={[
          styles.InfoDiv,
          this.props.slide ? styles.Slide : null,
        ].join(" ")}
      >
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
