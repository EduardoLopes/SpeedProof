import React, {useState, useEffect} from 'react';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import 'rc-calendar/assets/index.css';
import { Input } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import en_US from 'rc-calendar/lib/locale/en_US';
import pt_BR from 'rc-calendar/lib/locale/pt_BR';

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
  const { t, i18n } = useTranslation();

  function onChange(value) {

    if(props.onChange){
      props.onChange(value);
    }

    setCalendarValue(value);

  }

  function onClear(){

    setCalendarValue([]);

  }

  function defineLocale(){

    if(i18n.language === 'en'){
      return en_US;
    }

    if(i18n.language === 'pt-BR'){
      return pt_BR;
    }

  };

  useEffect(() => {

    if(props.searchDates.length === 0){
      setCalendarValue([]);
    }

  }, [props.searchDates]);

  const calendar = (
    <RangeCalendar
      showWeekNumber={false}
      dateInputPlaceholder={[t('Start'), t('End')]}
      defaultValue={[now, now.clone().add(1, 'months')]}
      locale={defineLocale()}
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
                placeholder={t('Select the dates')}
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