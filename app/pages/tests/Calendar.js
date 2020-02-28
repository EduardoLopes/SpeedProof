import React, {useState, useEffect} from 'react';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import 'rc-calendar/assets/index.css';
import { Input } from 'semantic-ui-react';

import moment from 'moment';

const now = moment();

const formatStr = 'YYYY-MM-DD';
function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

export default function Calendar(props) {

  const [calendarValue, setCalendarValue] = useState([]);

  function onChange(value) {

    if(props.onChange){
      props.onChange(value);
    }

    setCalendarValue(value);

  }

  function onClear(){

    setCalendarValue([]);

  }

  useEffect(() => {

    if(props.searchDates.length === 0){
      setCalendarValue([]);
    }

  }, [props.searchDates]);

  const calendar = (
    <RangeCalendar
      showWeekNumber={false}
      dateInputPlaceholder={['start', 'end']}
      defaultValue={[now, now.clone().add(1, 'months')]}
    />
  );

  return (
    <Picker
      value={calendarValue}
      onChange={onChange}
      animation="slide-up"
      calendar={calendar}
    >
      {
        ({ value }) => {
          return (<span>
              <Input
                size='mini'
                icon='calendar alternate outline' iconPosition='left'
                placeholder="Select the date..."
                style={{ width: 170, marginRight: 10 }}
                readOnly
                className="ant-calendar-picker-input ant-input"
                value={isValidRange(value) && `${format(value[0])} | ${format(value[1])}` || ''}
              />
              </span>);
        }
      }
    </Picker>
  );

}