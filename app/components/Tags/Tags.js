import React, {useState, useEffect} from "react";
const electron = window.require("electron");
import { Segment, Label, Divider, Grid, Form, Message, Icon} from 'semantic-ui-react'
import styles from "./Tags.scss";
import { useTranslation } from 'react-i18next';

const storage = window.localStorage;

export default function Tags(props){

  const [tags, setTags] = useState([]);
  const [tagsOnDB, setTagsOnDB] = useState([]);
  const [tagsInputValue, setTagsInputValue] = useState('');
  const [messageVisible, setMessageVisible] = useState(JSON.parse(storage.getItem('messageVisible')) === false ? false : true);
  const { t, i18n } = useTranslation();

  function tagColor(tag){

    let color = 'grey';

    if(tagsOnDB.includes(tag) && tags.includes(tag)){
      color = "green";
    }

    if(tagsOnDB.includes(tag) && tags.includes(tag) == false){
      color = "red";
    }

    return color;

  }

  function handleOnSubmit(event){

    setTagsOnDB(tags);
    setTagsInputValue(tags.toString());

    electron.ipcRenderer.send('update-tags', {
      id: props.id,
      tags: tags.toString()
    });

  }

  function splitTags(string){

    if(string){

      let splitedTags = string.split(",");
      splitedTags = splitedTags.map((tag) => tag.trim());
      return splitedTags.filter((tag) => !(/^\s*$/.test(tag)));

    }

  }

  function handleOnChange(){

    setTagsInputValue(event.target.value);

    let splitedTags = splitTags(event.target.value);
    splitedTags = [...new Set(splitedTags)];

    setTags(splitedTags);

  }

  function receiveTagsData(event, data){

    if(data.tags){

      const t = splitTags(data.tags);
      setTagsOnDB(t);
      setTags(t);
      setTagsInputValue(data.tags);

    }

  }

  function handleCloseMessage(){

    setMessageVisible(false);
    storage.setItem('messageVisible', false);

  }

   useEffect(() => {

    electron.ipcRenderer.send('request-tags-data', props.id);
    electron.ipcRenderer.on('tags-data', receiveTagsData);

    return () => {

      electron.ipcRenderer.removeListener('tags-data', receiveTagsData);

    }

  }, []);

  const allTags = [...new Set([...tags, ...tagsOnDB])];

  return (
    <div>
      { props.id && (<Segment>

        <Form onSubmit={handleOnSubmit}>
            <Grid>
              <Grid.Column width={12}>
                <Form.Input placeholder='Tags' name='name' value={tagsInputValue} onChange={handleOnChange} />
              </Grid.Column>
              <Grid.Column width={4}>
                <Form.Button style={{width: '100%'}} color="green" content={tagsOnDB.length === 0 ? t('Add tags') : t('Update tags')} />
              </Grid.Column>
            </Grid>
        </Form>

        {tags.length !== 0 || tagsOnDB.length !== 0 ? (<Divider/>) : ""}
        {allTags.map((tag, index) => {
          return (<Label color={tagColor(tag)} className={ styles.tagsLable } key={index}> {tag} </Label>)
        })}

        {messageVisible && (
          <div>
            <Divider/>
            <Message icon onDismiss={handleCloseMessage}>
              <Icon name='help' />
              <Message.Content>
                <Message.Header>{t('Tags should be separated by comma ( , )')}</Message.Header>
                <Message.List>
                  <Message.Item>{t('tags.example')}</Message.Item>
                  <Message.Item>{t('To update or delete a tag just edit the text inside the input and press Update Tags or Enter')}</Message.Item>
                </Message.List>
              </Message.Content>
            </Message>
          </div>
        )}

      </Segment>
      )}
    </div>

  );

}