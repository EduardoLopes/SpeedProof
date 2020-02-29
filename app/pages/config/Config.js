import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.js";
import { Container, Form, Select, Grid, Segment} from 'semantic-ui-react'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
const storage = window.localStorage;


const languages = [
  { key: 'en', value: 'en', text: 'English' },
  { key: 'pt-BR', value: 'pt-BR', text: 'Português (Brasil)' },
];

export default function Config(){

  const { t, i18n } = useTranslation();

  function handleLanguageChange(event, { name, value }){

    event.persist();

    i18n.changeLanguage(value);
    storage.setItem('language', value);
    moment.locale(value.toLowerCase());

  }

  return(
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      <Navbar />
      <Segment>
        <Form>
          <Form.Field inline value={i18n.language} onChange={handleLanguageChange} control={Select} label={t('language')} options={languages} placeholder={t('Select your language')} />
        </Form>
      </Segment>
    </Container>
  )

}