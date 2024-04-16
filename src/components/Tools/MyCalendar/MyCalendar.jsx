import Calendar from "react-calendar";
import "./MyCalendar.css";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { LuWaves } from "react-icons/lu";
import { useMyMainContext, useMyUser } from "@/storage";
import dayjs from "dayjs";
import { useMyRefs } from "../../../storage";

const MyCalendar = ({
  sunOrMon,
  setDate,
  maxPlus,
  valueDate,
  startDate,
  activeTask,
  activeStartDate,
  highlightDates,
  ...rest
}) => {
  const { taskArr } = useMyMainContext();

  const { userTz } = useMyUser();
  const { firstRef } = useMyRefs();

  const userLocalTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log('calendar rerendeeeeeeeeeeer')

  const finalTz = userLocalTz || userTz;

  const formatDate = (date) => {
    return dayjs(date).tz(finalTz).format("YYYY-MM-DD");
  };

  const renderTileClass = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = formatDate(date);
      if (
        highlightDates &&
        highlightDates.some((d) => {
          // Use dayjs to parse and format the highlight date in the user's timezone
          const highlightDate = dayjs(d).tz(finalTz).format("YYYY-MM-DD");
          return highlightDate === formattedDate;
        })
      ) {
        return "highlighted-date"; // Using CSS module style
      }
    }
  };

  // Function to check if a date has tasks
  const dateHasTasks = (date) => {
    const formattedDate = formatDate(date);
    return taskArr.some((task) =>
      task.dates.some(
        (taskDate) => formatDate(new Date(taskDate)) === formattedDate
      )
    );
  };

  const handleDateChange = (date) => {
    activeTask(date);
    // console.log('handleDateChange', date)
    setDate(date);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === "month" && dateHasTasks(date)) {
      return (
        <span className="waves">
          <LuWaves />
        </span>
      );
    }
  };

  return (
    <Calendar
      nextLabel={<MdKeyboardArrowRight />}
      next2Label={null}
      prevLabel={<MdKeyboardArrowLeft />}
      prev2Label={null}
      minDetail="year"
      defaultView="month"
      locale="en-US"
      maxDetail="month"
      ref={firstRef}
      defaultValue={valueDate}
      defaultActiveStartDate={activeStartDate}
      tileContent={renderTileContent}
      minDate={startDate || null}
      maxDate={maxPlus || null}
      onChange={handleDateChange}
      value={valueDate}
      calendarType={sunOrMon}
      tileClassName={renderTileClass}
      navigationLabel={({ label }) => `${label.split(" ")[0]}`}
      {...rest}
    />
  );
};

export default MyCalendar;
