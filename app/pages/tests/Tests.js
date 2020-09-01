import React, { useState, useEffect, useMemo } from 'react';
import { Container, Table, Icon, Segment, Pagination } from 'semantic-ui-react';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Tests.scss';
import Navbar from '../../components/Navbar';
import Search from './Search';
import Charts from './Charts';
import TableDataPlacehold from './TableDataPlacehold';
import Footer from '../../components/Footer/Footer';

const storage = window.localStorage;

export default function Tests() {
  const [testsData, setTestsData] = useState([]);
  const [testsDataChart, setTestsDataChart] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalPages, setTotalPages] = useState(10);
  const [sorted, setSorted] = useState(
    JSON.parse(storage.getItem('sorted')) || {
      column: 'id',
      direction: 'DESC',
    },
  );

  const [activePage, setActivePage] = useState(
    storage.getItem('activePage') || 1,
  );
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(15);
  const [offset, setOffset] = useState(
    parseInt(storage.getItem('offset'), 10) || 0,
  );
  const [mode, setMode] = useState(storage.getItem('mode') || 'normal'); // or search
  const [testsCount, setTestsCount] = useState(null);

  const { t } = useTranslation();

  function receiveData(event, data) {
    setTestsData(data);
    setMode('normal');
  }

  function receiveSearchData(event, data) {
    setTestsData(data);
  }

  function receiveChartData(event, data) {
    setTestsDataChart(data);
  }

  function handleSort(clickedColumn) {
    if (sorted.column !== clickedColumn) {
      setSorted({
        column: clickedColumn,
        direction: 'ASC',
      });

      return;
    }

    setSorted({
      column: clickedColumn,
      direction: sorted.direction === 'ASC' ? 'DESC' : 'ASC',
    });
  }

  function receiveTestsCount(event, data) {
    setTestsCount(data[0].count);
    setTotalPages(Math.ceil(data[0].count / limit));
  }

  function getSortDirection(direction) {
    return direction === 'ASC' ? 'descending' : 'ascending';
  }

  function handlePageChange(event, data) {
    setOffset((data.activePage - 1) * limit);
    setActivePage(data.activePage);
    storage.setItem('activePage', data.activePage);
  }

  useEffect(() => {
    const data = [];

    testsDataChart.forEach((test) => {
      data.push({
        name: moment(test.timestamp, moment.ISO_8601).format(
          'dddd, MMMM Do YYYY, h:mm:ss a',
        ),
        download: (test.download_bandwidth / 125000).toFixed(2),
        upload: (test.upload_bandwidth / 125000).toFixed(2),
        ping: test.ping_latency,
        milliseconds: test.timestamp_milliseconds,
      });
    });

    setChartData(data);
  }, [testsDataChart, sorted]);

  useEffect(() => {
    window.api.receive('tests-data', receiveData);
    window.api.receive('tests-search-data', receiveSearchData);
    window.api.receive('tests-count', receiveTestsCount);
    window.api.receive('tests-search-data-count', receiveTestsCount);
    window.api.receive('tests-data-chart', receiveChartData);
    window.api.receive('tests-search-data-chart', receiveChartData);

    const scrollTimeout = setTimeout(() => {
      window.scroll({
        top: parseInt(storage.getItem('scrollY'), 10),
        behavior: 'auto',
      });

      storage.setItem('scrollY', 0);
    }, 120);

    return () => {
      window.api.receiveOff('tests-data', receiveData);
      window.api.receiveOff(
        'tests-search-data',
        receiveSearchData,
      );
      window.api.receiveOff('tests-count', receiveTestsCount);
      window.api.receiveOff(
        'tests-search-data-count',
        receiveTestsCount,
      );
      window.api.receiveOff('tests-data-chart', receiveChartData);
      window.api.receiveOff(
        'tests-search-data-chart',
        receiveChartData,
      );

      window.scroll({
        top: 0,
        behavior: 'auto',
      });

      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (mode === 'normal') {
      window.api.send('request-tests-data', {
        offset,
        limit,
        sortDirection: sorted.direction,
        sortColumn: sorted.column,
      });
    }

    storage.setItem('offset', offset);
    storage.setItem('sorted', JSON.stringify(sorted));
  }, [limit, offset, sorted]);

  useEffect(() => {
    storage.setItem('mode', mode);
  }, [mode]);

  const tableRows = useMemo(() => {
    if (testsData.length > 0) {
      return testsData.map((test) => (
        <Table.Row key={test.id}>
          <Table.Cell>{test.id}</Table.Cell>
          <Table.Cell singleLine>
            {Math.floor(test.ping_latency)}{' '}
            <span className={styles.headerCellSecondaryText}>ms</span>
          </Table.Cell>
          <Table.Cell singleLine>
            {(test.download_bandwidth / 125000).toFixed(2)}{' '}
            <span className={styles.headerCellSecondaryText}>Mbps</span>
          </Table.Cell>
          <Table.Cell singleLine>
            {(test.upload_bandwidth / 125000).toFixed(2)}{' '}
            <span className={styles.headerCellSecondaryText}>Mbps</span>
          </Table.Cell>
          <Table.Cell>{test.isp}</Table.Cell>
          <Table.Cell>{test.server_name}</Table.Cell>
          <Table.Cell singleLine>
            {moment(test.timestamp, moment.ISO_8601).fromNow()}
          </Table.Cell>
          <Table.Cell selectable>
            <NavLink
              exact
              to={`/info/${test.id}`}
              onClick={() => {
                storage.setItem(
                  'scrollY',
                  document.body.scrollTop || document.documentElement.scrollTop,
                );
              }}
            >
              <Icon name="arrow right" fitted size="small" />
            </NavLink>
          </Table.Cell>
        </Table.Row>
      ));
    }

    return <TableDataPlacehold />;
  }, [testsData]);

  return (
    <Container style={{ marginTop: '1rem', marginBottom: '1rem' }}>
      <Navbar />
      <Search
        onSubmit={() => {
          setMode('search');
          setActivePage(1);
          setOffset(0);
          setSorted({ column: 'id', direction: 'DESC' });
        }}
        sortDirection={sorted.direction}
        sortColumn={sorted.column}
        noResult={testsCount === 0}
        mode={mode}
        offset={offset}
        limit={limit}
      />

      {(testsCount || mode === 'normal') && (
        <Charts mode={mode} data={chartData} />
      )}
      {(testsCount || mode === 'normal') && (
        <Table
          color={mode === 'search' ? 'blue' : null}
          sortable={testsData.length > 0}
          celled
          compact
          striped
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={
                  sorted.column === 'id'
                    ? getSortDirection(sorted.direction)
                    : null
                }
                onClick={() => handleSort('id')}
              >
                #
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorted.column === 'ping_latency'
                    ? getSortDirection(sorted.direction)
                    : null
                }
                onClick={() => handleSort('ping_latency')}
              >
                {t('ping')}
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorted.column === 'download_bandwidth'
                    ? getSortDirection(sorted.direction)
                    : null
                }
                onClick={() => handleSort('download_bandwidth')}
              >
                {t('download')}
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorted.column === 'upload_bandwidth'
                    ? getSortDirection(sorted.direction)
                    : null
                }
                onClick={() => handleSort('upload_bandwidth')}
              >
                {t('upload')}
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorted.column === 'isp'
                    ? getSortDirection(sorted.direction)
                    : null
                }
                onClick={() => handleSort('isp')}
              >
                {t('ISP')}
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorted.column === 'server_name'
                    ? getSortDirection(sorted.direction)
                    : null
                }
                onClick={() => handleSort('server_name')}
              >
                {t('server')}
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorted.column === 'timestamp_milliseconds'
                    ? getSortDirection(sorted.direction)
                    : null
                }
                onClick={() => handleSort('timestamp_milliseconds')}
              >
                {t('when')}
              </Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>{tableRows}</Table.Body>
        </Table>
      )}

      {chartData.length > 0 && (
        <Segment style={{ padding: 0 }} basic clearing>
          <Pagination
            color={mode === 'search' ? 'blue' : null}
            floated="right"
            inverted
            onPageChange={handlePageChange}
            activePage={activePage}
            totalPages={totalPages}
          />
        </Segment>
      )}

      <Footer />
    </Container>
  );
}
