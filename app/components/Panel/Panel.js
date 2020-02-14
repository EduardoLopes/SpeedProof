import React, { useState, useEffect } from 'react';
import { Segment, Label, Icon, Statistic, Progress, Grid} from 'semantic-ui-react'
import { AreaChart, Area, CartesianGrid, XAxis,YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from "./Panel.scss";

export default function Panel(props){

  function formatSpeed(speed){

    return (
      <Statistic size='small'>
        <Statistic.Value>{(speed / 125000).toFixed(2)}</Statistic.Value>
        <Statistic.Label>Mbps</Statistic.Label>
      </Statistic>
    );

  }

  function formatPing(time){

    return (
      <Statistic size='small'>
        <Statistic.Value>{Math.floor(time)}</Statistic.Value>
        <Statistic.Label>ms</Statistic.Label>
      </Statistic>
    );

  }

  const {
    pingProgress,
    downloadProgress,
    uploadProgress,
    downloadSpeed,
    uploadSpeed,
    ping } = props;

  return (
    <Grid columns='equal' padded="vertically">
      <Grid.Row stretched>
      <Grid.Column>
      <Segment size="massive" textAlign="center">
        {pingProgress >= 0 && (<Progress percent={pingProgress} attached='bottom' indicating />)}
        <Label color='blue' size="large" attached='top' style={{textAlign: "left"}}>
        <Icon name='sync'/> Ping
        </Label>
        {formatPing(ping)}
      </Segment>
      </Grid.Column>
      <Grid.Column>
      <Segment size="massive" textAlign="center">
        {downloadProgress >= 0 && (<Progress percent={downloadProgress} attached='bottom' indicating />)}
        <Label color='violet' size="large" attached='top' style={{textAlign: "left"}}>
        <Icon name='download'/> Download
        </Label>
        {formatSpeed(downloadSpeed)}
      </Segment>
      </Grid.Column>
      <Grid.Column>
      <Segment size="massive" textAlign="center">
        {uploadProgress >= 0 && (<Progress percent={uploadProgress} attached='bottom' indicating />)}
        <Label color='teal' size="large" attached='top' style={{textAlign: "left"}}>
        <Icon name='upload'/> Upload
        </Label>
        {formatSpeed(uploadSpeed)}
      </Segment>
      </Grid.Column>
      </Grid.Row>
    </Grid>
  );

}