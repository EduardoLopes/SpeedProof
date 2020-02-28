import React, {useState, useEffect} from 'react';
import { Grid, Form, Button, Segment} from 'semantic-ui-react';
import _lang from 'lodash/lang';
import Calendar from './Calendar.js';
import NoResultSearch from './NoResultSearch.js';

const electron = window.require("electron");
const storage = window.localStorage;

export default function Search(props){

  const [searchKeyword, setSearchKeyword] = useState(storage.getItem('searchKeyword') || '');
  const [searchByTag, setSearchByTag] = useState(JSON.parse(storage.getItem('searchByTag')) || true);
  const [searchByISP, setSearchByISP] = useState(JSON.parse(storage.getItem('searchByISP')) || true);
  const [searchByServerName, setSearchByServerName] = useState(JSON.parse(storage.getItem('searchByServerName')) || true);
  const [searchDates, setSearchDates] = useState(JSON.parse(storage.getItem('searchDates')) || []);
  const [lastSearch, setLastSearch] = useState({
    keyword: searchKeyword,
    byTag: searchByTag,
    byISP: searchByISP,
    byServerName: searchByServerName,
    dates: searchDates,
    offset: (props.mode === 'search') ? props.offset : 0,
    limit: props.limit,
    sortDirection: props.sortDirection,
    sortColumn: props.sortColumn
  });

  function updateLocalStorage(){

    storage.setItem('searchKeyword', searchKeyword);
    storage.setItem('searchByTag', searchByTag);
    storage.setItem('searchByISP', searchByISP);
    storage.setItem('searchByServerName', searchByServerName);
    storage.setItem('searchDates', JSON.stringify(searchDates));

  }

  function resetSearch(){

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
      limit: props.limit,
      sortDirection: 'DESC',
      sortColumn: 'id'
    });

    updateLocalStorage();

    electron.ipcRenderer.send('request-tests-data', {offset: 0, limit: props.limit, sortDirection: 'DESC', sortColumn: 'id'});

  }

  function handleOnSubmit(){

    if(props.onSubmit){
      props.onSubmit();
    }

    requestSearchData();

    if(searchKeyword.length === 0 && searchDates.length === 0){
      electron.ipcRenderer.send('request-tests-data', {offset: 0, limit: 15, sortDirection: 'DESC', sortColumn: 'id'});
    }

  }

  function getSearchConfig(){

    const config = {
      keyword: searchKeyword,
      byTag: searchByTag,
      byISP: searchByISP,
      byServerName: searchByServerName,
      dates: searchDates,
      offset: (props.mode === 'search') ? props.offset : 0,
      limit: props.limit,
      sortDirection: props.sortDirection,
      sortColumn: props.sortColumn
    };

    updateLocalStorage();

    return config;

  }

  function requestSearchData(){

    const search = getSearchConfig();

    if(!_lang.isEqual(search, lastSearch)){

      electron.ipcRenderer.send('request-test-search-data', search);
      setLastSearch(search);

    }

  }

  function handleSearchOnChange(event){

    setSearchKeyword(event.target.value);

  }

  function handleCalendarChange(value){

    if(value && value[0] && value[1]){

      value[0].hour(0);
      value[0].minute(0);
      value[0].second(0);
      value[1].hour(23);
      value[1].minute(59);
      value[1].second(59);

      setSearchDates([
        parseInt(value[0].format("x"))                                           ,
        parseInt(value[1].format("x"))
      ]);

    }

  }

  useEffect(() => {

    if(props.mode === 'search'){
      requestSearchData();
    }

  }, [props.limit, props.offset, props.sortDirection, props.sortColumn]);

  useEffect(() => {

    if(props.mode === 'search'){
      requestSearchData();
    }

  }, []);

  return(
    <div>
      <Segment color={props.mode === 'search' ? 'blue' : null}>
        <Form onSubmit={handleOnSubmit}>
          <Grid>
            <Grid.Column width={12}>
              <Form.Input placeholder='Search' value={searchKeyword} onChange={handleSearchOnChange} name='name' />
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Button style={{width: '100%'}} color="blue" content='Search' disabled={_lang.isEqual(getSearchConfig(), lastSearch)} />
            </Grid.Column>
          </Grid>
        </Form>

        <Grid>
          <Grid.Column width={16} textAlign="right">
            <Calendar onChange={handleCalendarChange}/>
            <Button.Group size={'tiny'}>
              <Button color={searchByTag ? 'green' : 'grey'} onClick={()=>{

                setSearchByTag(!searchByTag);

                }}>By Tags</Button>
              <Button color={searchByISP ? 'green' : 'grey'} onClick={()=>{

                setSearchByISP(!searchByISP);

                }}>By ISP</Button>
              <Button color={searchByServerName ? 'green' : 'grey'} onClick={()=>{

                setSearchByServerName(!searchByServerName);

                }}>By Server Name</Button>
            </Button.Group>
          </Grid.Column>

        </Grid>

      </Segment>

      {(props.noResult && lastSearch.keyword.length !== 0) && (<NoResultSearch onClear={resetSearch} />)}

    </div>
  );

}