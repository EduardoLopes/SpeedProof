import React, {useState, useEffect} from 'react';
import { Grid, Form, Button, Segment} from 'semantic-ui-react';
import _lang from 'lodash/lang';
import Calendar from './Calendar.js';

const electron = window.require("electron");

export default function Search(props){

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchByTag, setSearchByTag] = useState(true);
  const [searchByISP, setSearchByISP] = useState(true);
  const [searchByServerName, setSearchByServerName] = useState(true);
  const [searchDates, setSearchDates] = useState([]);
  const [lastSearch, setLastSearch] = useState({
    keyword: '',
    byTag: true,
    byISP: true,
    byServerName: true,
    dates: []
  });

  
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
      dates: []
    });

  }

  function handleOnSubmit(){

    if(props.onSubmit){
      props.onSubmit();
    }

    requestSearchData();

    if(searchKeyword.length === 0 && searchDates.length === 0){
      electron.ipcRenderer.send('request-tests-data', "data");
    }

  }

  function getSearchConfig(){

    return {
      keyword: searchKeyword,
      byTag: searchByTag,
      byISP: searchByISP,
      byServerName: searchByServerName,
      dates: searchDates
    };

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
        parseInt(value[0].format("x")),
        parseInt(value[1].format("x"))
      ]);

    }

  }
  
  return(
    <Segment>
      <Form onSubmit={handleOnSubmit}>
        <Grid>
          <Grid.Column width={12}>
            <Form.Input placeholder='Search' onChange={handleSearchOnChange} name='name' />
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
  );

}