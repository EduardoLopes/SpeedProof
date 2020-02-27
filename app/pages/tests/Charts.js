import { Segment, Placeholder } from 'semantic-ui-react';
import { AreaChart, Area, CartesianGrid, XAxis,YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import React, { useState, useEffect, useMemo} from "react";

export default function Charts(props){

  return(
    <Segment color={props.mode === 'search' ? 'blue' : null}>
      {props.data.length > 0 ? (
      <div style={{width: "100%", height: 300}}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={props.data} >
            <defs>
              <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6435c9" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#6435c9" stopOpacity={1}/>
              </linearGradient>
              <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b5ad" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#00b5ad" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <YAxis stroke="#ccc" hide type='number' width={ Math.floor(props.maxValueDownloadUpload).toString().length * 12}/>
            <XAxis dataKey="name" hide={true} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="download" stroke="#6435c9" fillOpacity={1} fill="url(#colorDownload)" />
            <Area type="monotone" dataKey="upload" stroke="#00b5ad" fillOpacity={1} fill="url(#colorUpload)" />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer width={"100%"} height={100}>
          <AreaChart data={props.data} >
            <defs>
              <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2185d0" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#2185d0" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <YAxis stroke="#ccc" type='number' width={ Math.floor(props.maxPing).toString().length * 12} hide/>
            <XAxis dataKey="name" hide={true} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="ping" stroke="#2185d0" fillOpacity={1} fill="url(#colorPing)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      ) : (<div style={{width: "100%", height: 300, overflow: 'hidden'}}><Placeholder fluid><Placeholder.Image rectangular /></Placeholder></div>)}
    </Segment>
  );

}