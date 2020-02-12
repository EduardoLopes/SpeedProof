import React, {useState, useEffect} from "react";
const electron = window.require("electron");
import { Segment, Label, Divider, Grid, Form} from 'semantic-ui-react'
import styles from "./Tags.scss";

export default function Tags(props){

  const [tags, setTags] = useState([]);
  const [tagsOnDB, setTagsOnDB] = useState([]);
  const [tagsInputValue, setTagsInputValue] = useState([]);

  function tagColor(tag){

    let color = "grey";

    color = tagsOnDB.includes(tag) ? 'green' : 'grey';

    if(tagsOnDB.includes(tag) && tags.includes(tag)){
      color = "green";
    }

    if(tagsOnDB.includes(tag) && tags.includes(tag) == false){
      color = "red";
    }

    return color;

  }

  useEffect(() => {


    return () => {


    }

  }, []);

  return (
    <div>
      { props.id && (<Segment>

        <Form onSubmit={(event) => {

          setTagsOnDB(tags);
          setTagsInputValue(tags.toString());

          electron.ipcRenderer.send('update-tags', {
            id: props.id,
            tags: tags.toString()
          });

        }}>
            <Grid>
            <Grid.Column width={12}>
                <Form.Input
                  placeholder='Tags'
                  name='name'
                  value={tagsInputValue}
                  onChange={(event) => {

                    setTagsInputValue(event.target.value);

                    let splitedTags = event.target.value.split(",");

                    splitedTags = splitedTags.map((tag) => tag.trim());

                    splitedTags = splitedTags.filter((tag) => !(/^\s*$/.test(tag)));

                    splitedTags = [...new Set(splitedTags)];

                    setTags(splitedTags);


                  }}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <Form.Button style={{width: '100%'}} color="green" content={tagsOnDB.length === 0 ? 'Add tags' : 'Update tags'} />
              </Grid.Column>
            </Grid>
        </Form>
        {tags.length !== 0 || tagsOnDB.length !== 0 ? (<Divider/>) : ""}
        {[...new Set([...tags, ...tagsOnDB])].map((tag, index) => {
          return (<Label color={tagColor(tag)} className={ styles.tagsLable } key={index}>
            {tag}
          </Label>)
        })}

      </Segment>)}
    </div>

  );

}