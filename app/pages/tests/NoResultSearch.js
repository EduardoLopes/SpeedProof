import React, { useState, useEffect} from "react";
import { Icon, Button, Segment, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next';

export default function NoResultSearch(props){

  const { t } = useTranslation();

  function onClear(event){

    if(props.onClear){
      props.onClear(event);
    }

  }

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        {t('noResult')}
      </Header>
      <Segment.Inline>
        <Button onClick={onClear} primary>{t('Clear Query')}</Button>
      </Segment.Inline>
    </Segment>
  );

}