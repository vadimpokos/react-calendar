import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      lastDate: 0,
      lastDay: 0,
      firstDay: 0,
      prevLastDate: 0,
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: [
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
      ],
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

  updateState = () => {
    this.setState({
      lastDate: this.calculateLastDay(),
      lastDay: this.calculateLastWeekDay(),
      firstDay: this.calculateFirstWeekDay(),
      prevLastDate: this.calsulatePrevLastDate(),
    });
  };

  componentDidMount() {
    this.updateState();
  }

  setNextMonth = () => {
    let nextMonth = new Date(this.state.date);
    nextMonth.setMonth(this.state.date.getMonth() + 1);
    this.setState({ date: new Date(nextMonth) }, () => {
      this.updateState();
    });
  };

  setPrevMonth = () => {
    let prevMonth = new Date(this.state.date);
    prevMonth.setMonth(this.state.date.getMonth() - 1);
    this.setState({ date: new Date(prevMonth) }, () => {
      this.updateState();
    });
  };

  render() {
    return (
      <div className="calendar-wrapper">
        <div>
          {this.state.months[this.state.date.getMonth()]},{" "}
          {this.state.date.getFullYear()}
        </div>
        <div className="week-days">
          {this.state.weekDays.map((item, index) => {
            return (
              <div className="week-day" key={index}>
                {item}
              </div>
            );
          })}
        </div>

        <div className="day-numbers">
          <Days
            firstDay={this.state.firstDay}
            prevLastDate={this.state.prevLastDate}
            lastDate={this.state.lastDate}
            lastDay={this.state.lastDay}
          />
        </div>
        <div>
          <Button value="Prev" onClick={this.setPrevMonth} />
          <Button value="Next" onClick={this.setNextMonth} />
        </div>
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
      <div key={j} className="day-item prev-days">
        {j}
      </div>
    );
  }

  let arr1 = arr.reverse();

  for (let i = 1; i <= props.lastDate; i++) {
    arr1.push(
      <div key={100 + i} className="day-item">
        {i}
      </div>
    );
  }

  for (let a = 1; a <= nextDays; a++) {
    arr1.push(
      <div key={200 + a} className="day-item next-days">
        {a}
      </div>
    );
  }

  return arr1;
}

function Button(props) {
  return <input type="button" value={props.value} onClick={props.onClick} />;
}

export default App;
