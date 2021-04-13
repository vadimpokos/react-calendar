import React from "react";
import axios from "axios";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      weather: " ",
    };
  }

  calculateLastDay = () => {
    let nextMonth = new Date(this.state.date);
    nextMonth.setMonth(this.state.date.getMonth() + 1);
    return Math.trunc((nextMonth - this.state.date) / (24 * 3600 * 1000));
  };

  calculateLastWeekDay = () => {
    let lastWeekDay = new Date(this.state.date);
    lastWeekDay.setDate(this.calculateLastDay());
    return lastWeekDay.getDay();
  };

  calculateFirstWeekDay = () => {
    let firstWeekDay = new Date(this.state.date);
    firstWeekDay.setDate(1);
    return firstWeekDay.getDay();
  };

  calsulatePrevLastDate = () => {
    let prevMonth = new Date(this.state.date);
    prevMonth.setMonth(this.state.date.getMonth() - 1);
    return Math.trunc((this.state.date - prevMonth) / (24 * 3600 * 1000));
  };

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest = () => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=53.89&lon=27.56&dt=${Math.trunc(
          this.state.date.getTime() / 1000
        )}&appid={api key}`
      )
      .then((res) => {
        console.log(res);
        this.setState({
          weather: { ...res.data.hourly },
        });
      })
      .catch((er) => this.setState({ weather: null }));
  };

  setNextMonth = () => {
    let nextMonth = new Date(this.state.date);
    nextMonth.setMonth(this.state.date.getMonth() + 1, 1);
    this.setState({ date: new Date(nextMonth) }, () => this.makeRequest());
  };

  setPrevMonth = () => {
    let prevMonth = new Date(this.state.date);
    prevMonth.setMonth(this.state.date.getMonth() - 1, 1);
    this.setState({ date: new Date(prevMonth) }, () => this.makeRequest());
  };

  handleDateClick = (e) => {
    console.log(
      Array.from(e.target.classList).find((item) => item === "prev-days")
        ? this.setState(
            (prevState) => ({
              date: new Date(
                prevState.date.setMonth(
                  prevState.date.getMonth() - 1,
                  e.target.innerText
                )
              ),
            }),
            () => this.makeRequest()
          )
        : Array.from(e.target.classList).find((item) => item === "next-days")
        ? this.setState(
            (prevState) => ({
              date: new Date(
                prevState.date.setMonth(
                  prevState.date.getMonth() + 1,
                  e.target.innerText
                )
              ),
            }),
            () => this.makeRequest()
          )
        : this.setState(
            (prevState) => ({
              date: new Date(prevState.date.setDate(e.target.innerText)),
            }),
            () => this.makeRequest()
          )
    );
  };

  render() {
    console.log("render");
    return (
      <div className="calendar-wrapper">
        <div className="calendar-header">
          {months[this.state.date.getMonth()]}, {this.state.date.getFullYear()}
        </div>
        <div className="week-days">
          {weekDays.map((item, index) => {
            return (
              <div className="week-day" key={index}>
                {item}
              </div>
            );
          })}
        </div>

        <div className="day-numbers">
          <Days
            firstDay={this.calculateFirstWeekDay()}
            prevLastDate={this.calsulatePrevLastDate()}
            lastDate={this.calculateLastDay()}
            lastDay={this.calculateLastWeekDay()}
            onClick={this.handleDateClick}
            date={this.state.date}
          />
        </div>
        <div>
          <Button value="Prev" onClick={this.setPrevMonth} />
          <Button value="Next" onClick={this.setNextMonth} />
        </div>
        <Weather weather={this.state.weather} date={this.state.date} />
      </div>
    );
  }
}

function Days(props) {
  let arr = [];
  let prevDays = props.prevLastDate - props.firstDay;
  let nextDays = 6 - props.lastDay;

  props.prevLastDate - prevDays >= 3
    ? (prevDays = props.prevLastDate - props.firstDay)
    : (prevDays = prevDays - 7);
  nextDays >= 3 ? (nextDays = 6 - props.lastDay) : (nextDays = nextDays + 7);

  for (let j = props.prevLastDate; j > prevDays; j--) {
    arr.push(
      <div key={j} onClick={props.onClick} className="day-item prev-days">
        {j}
      </div>
    );
  }

  let arr1 = arr.reverse();

  for (let i = 1; i <= props.lastDate; i++) {
    props.date.getDate() === i
      ? arr1.push(
          <div
            key={100 + i}
            onClick={props.onClick}
            className="day-item current-day"
          >
            {i}
          </div>
        )
      : arr1.push(
          <div key={100 + i} onClick={props.onClick} className="day-item">
            {i}
          </div>
        );
  }

  for (let a = 1; a <= nextDays; a++) {
    arr1.push(
      <div key={200 + a} onClick={props.onClick} className="day-item next-days">
        {a}
      </div>
    );
  }

  return arr1;
}

function Button(props) {
  return <input type="button" value={props.value} onClick={props.onClick} />;
}

function Weather(props) {
  return props.weather ? (
    <div>
      <span>
        Weather {props.date.getDate()}, {months[props.date.getMonth()]}{" "}
        {props.date.getFullYear()}:
      </span>
      <div>
        {Object.values(props.weather).map((item, index) => {
          let hours = `${new Date(item.dt * 1000).getUTCHours()}`;
          return (
            <div key={index}>
              {hours.length > 1 ? hours : "0" + hours}:00:{" "}
              {Math.trunc(item.temp - 273.15)}°C, feels like{" "}
              {Math.trunc(item.feels_like - 273.15)}°C, humidity {item.humidity}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>
      No weather data for {props.date.getDate()},{" "}
      {months[props.date.getMonth()]} {props.date.getFullYear()}
    </div>
  );
}

export default App;
