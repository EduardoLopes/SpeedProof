import React, { useState, useEffect } from 'react';
import {
  Grid, Button, Segment, Input,
} from 'semantic-ui-react';
import _lang from 'lodash/lang';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Calendar from './Calendar';
import NoResultSearch from './NoResultSearch';

const electron = window.require('electron');
const storage = window.localStorage;

export default function Search(props) {
  const [searchKeyword, setSearchKeyword] = useState(
    storage.getItem('searchKeyword') || '',
  );
  const [searchByTag, setSearchByTag] = useState(
    JSON.parse(storage.getItem('searchByTag')) !== false,
  );
  const [searchByISP, setSearchByISP] = useState(
    JSON.parse(storage.getItem('searchByISP')) !== false,
  );
  const [searchByServerName, setSearchByServerName] = useState(
    JSON.parse(storage.getItem('searchByServerName')) !== false,
  );
  const [searchDates, setSearchDates] = useState(
    JSON.parse(storage.getItem('searchDates')) || [],
  );

  const {
    mode,
    offset,
    limit,
    sortDirection,
    sortColumn,
    onSubmit,
    noResult,
  } = props;

  const [lastSearch, setLastSearch] = useState({
    keyword: searchKeyword,
    byTag: searchByTag,
    byISP: searchByISP,
    byServerName: searchByServerName,
    dates: searchDates,
    offset: mode === 'search' ? offset : 0,
    limit,
    sortDirection,
    sortColumn,
  });

  const { t } = useTranslation();

  function updateLocalStorage() {
    storage.setItem('searchKeyword', searchKeyword);
    storage.setItem('searchByTag', searchByTag);
    storage.setItem('searchByISP', searchByISP);
    storage.setItem('searchByServerName', searchByServerName);
    storage.setItem('searchDates', JSON.stringify(searchDates));
  }

  function resetSearch() {
    setSearchKeyword('');
    setSearchByTag(true);
    setSearchByISP(true);
    setSearchByServerName(true);
    setSearchDates([]);
    setLastSearch({
      keyword: '',
      byTag: true,
      byISP: true,
      byServerName: true,
      dates: [],
      offset: 0,
      limit,
      sortDirection: 'DESC',
      sortColumn: 'id',
    });

    electron.ipcRenderer.send('request-tests-data', {
      offset: 0,
      limit,
      sortDirection: 'DESC',
      sortColumn: 'id',
    });
  }

  function getSearchConfig() {
    const config = {
      keyword: searchKeyword,
      byTag: searchByTag,
      byISP: searchByISP,
      byServerName: searchByServerName,
      dates: searchDates,
      offset: mode === 'search' ? offset : 0,
      limit,
      sortDirection,
      sortColumn,
    };

    return config;
  }

  function requestSearchData() {
    const search = getSearchConfig();

    if (!_lang.isEqual(search, lastSearch)) {
      electron.ipcRenderer.send('request-test-search-data', search);
      setLastSearch(search);
    }
  }

  function handleOnSubmit(event) {
    if (
      (event.type === 'keydown' && event.key !== 'Enter')
      || (event.type !== 'keydown' && event.type !== 'click')
      || _lang.isEqual(getSearchConfig(), lastSearch)
    ) return;

    if (searchKeyword.length === 0 && searchDates.length === 0) {
      resetSearch();
      // eslint-disable-next-line consistent-return
      return null;
    }

    if (onSubmit) {
      onSubmit();
    }

    requestSearchData();
    updateLocalStorage();
  }

  function handleSearchOnChange(event) {
    setSearchKeyword(event.target.value);
  }

  function handleCalendarChange(value) {
    if (value && value[0] && value[1]) {
      value[0].hour(0);
      value[0].minute(0);
      value[0].second(0);
      value[1].hour(23);
      value[1].minute(59);
      value[1].second(59);

      setSearchDates([
        parseInt(value[0].format('x'), 10),
        parseInt(value[1].format('x'), 10),
      ]);
    }
  }

  useEffect(() => {
    updateLocalStorage();
  }, [searchKeyword, searchByTag, searchByISP, searchByServerName, searchDates]);

  useEffect(() => {
    if (mode === 'search') {
      requestSearchData();
    }
  }, [limit, offset, sortDirection, sortColumn]);

  useEffect(() => {
    if (mode === 'search') {
      electron.ipcRenderer.send('request-test-search-data', lastSearch);
    }
  }, []);

  function handleClearButtonDisabled() {
    return _lang.isEqual(getSearchConfig(), {
      keyword: '',
      byTag: true,
      byISP: true,
      byServerName: true,
      dates: [],
      offset: 0,
      limit,
      sortDirection: 'DESC',
      sortColumn: 'id',
    });
  }

  return (
    <div>
      <Segment color={mode === 'search' ? 'blue' : null}>
        <Grid>
          <Grid.Column style={{ paddingBottom: 0 }} width={16}>
            <Input
              onKeyDown={handleOnSubmit}
              onChange={handleSearchOnChange}
              value={searchKeyword}
              style={{ width: '100%' }}
              type="text"
              placeholder={`${t('Search')}...`}
              action
            >
              <input />
              <Button
                color="blue"
                disabled={_lang.isEqual(getSearchConfig(), lastSearch)}
                onClick={handleOnSubmit}
              >
                {t('Search')}
              </Button>
              <Button
                color="blue"
                disabled={handleClearButtonDisabled()}
                basic
                as="div"
                icon="delete"
                onClick={resetSearch}
              />
            </Input>
          </Grid.Column>
          <Grid.Column width={16} textAlign="right">
            <Calendar
              onChange={handleCalendarChange}
              searchDates={searchDates}
            />
            <Button.Group size="tiny">
              <Button
                color={searchByTag ? 'green' : 'grey'}
                onClick={() => {
                  setSearchByTag(!searchByTag);
                }}
              >
                {t('By Tags')}
              </Button>
              <Button
                color={searchByISP ? 'green' : 'grey'}
                onClick={() => {
                  setSearchByISP(!searchByISP);
                }}
              >
                {t('By ISP')}
              </Button>
              <Button
                color={searchByServerName ? 'green' : 'grey'}
                onClick={() => {
                  setSearchByServerName(!searchByServerName);
                }}
              >
                {t('By Server Name')}
              </Button>
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Segment>

      {noResult && lastSearch.keyword.length !== 0 && (
        <NoResultSearch onClear={resetSearch} />
      )}
    </div>
  );
}

Search.propTypes = {
  mode: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  sortDirection: PropTypes.string.isRequired,
  sortColumn: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  noResult: PropTypes.bool.isRequired,
};

Search.defaultProps = {
  onSubmit: null,
};
