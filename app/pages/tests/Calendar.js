import React, { useState, useEffect } from 'react';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
// import 'rc-calendar/assets/index.css';
import { Input } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import enUS from 'rc-calendar/lib/locale/en_US';
import ptBR from 'rc-calendar/lib/locale/pt_BR';
import PropTypes from 'prop-types';
import moment from 'moment';

const storage = window.localStorage;

const now = moment();

const formatStr = 'L';
function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

export default function Calendar(props) {
  const storageDates = JSON.parse(storage.getItem('searchDates'));
  const [calendarValue, setCalendarValue] = useState(
    storageDates ? [moment(storageDates[0]), moment(storageDates[1])] : [],
  );
  const { t, i18n } = useTranslation();
  const { searchDates, onChange } = props;
  function handleOnChange(value) {
    if (onChange) {
      onChange(value);
    }

    setCalendarValue(value);
  }

  function defineLocale() {
    if (i18n.language === 'en') {
      return enUS;
    }

    if (i18n.language === 'pt-BR') {
      return ptBR;
    }

    return enUS;
  }

  useEffect(() => {
    if (searchDates.length === 0) {
      setCalendarValue([]);
    }
  }, [searchDates]);

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
      onChange={handleOnChange}
      animation="slide-up"
      calendar={calendar}
    >
      {({ value }) => (
        <span>
          <Input
            size="mini"
            icon="calendar alternate outline"
            iconPosition="left"
            placeholder={t('Select the dates')}
            style={{ width: 170, marginRight: 10 }}
            readOnly
            className="ant-calendar-picker-input ant-input"
            value={
              (isValidRange(value) &&
                `${format(value[0])} | ${format(value[1])}`) ||
              ''
            }
          />
        </span>
      )}
    </Picker>
  );
}

Calendar.propTypes = {
  onChange: PropTypes.func,
  searchDates: PropTypes.arrayOf(PropTypes.number),
};

Calendar.defaultProps = {
  onChange: null,
  searchDates: [null, null],
};
