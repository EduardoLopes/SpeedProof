import React, { useState, useEffect} from "react";
import { Icon, Button, Segment, Header } from 'semantic-ui-react'

export default function NoResultSearch(props){

  function onClear(event){
    
    if(props.onClear){
      props.onClear(event);
    }    

  }

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        We don't have any test matching your query.
      </Header>
      <Segment.Inline>
        <Button onClick={onClear} primary>Clear Query</Button>
      </Segment.Inline>
    </Segment>
  );

}