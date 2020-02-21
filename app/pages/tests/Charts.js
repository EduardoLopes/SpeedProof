import { Segment } from 'semantic-ui-react';
import { AreaChart, Area, CartesianGrid, XAxis,YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import React, { useState, useEffect, useMemo} from "react";

export default function Charts(props){

  return(
    <Segment>
      <ResponsiveContainer width={"100%"} height={200}>
        <AreaChart data={props.data} >
          <defs>
            <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#6435c9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6435c9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#00b5ad" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00b5ad" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis stroke="#ccc" type='number' width={ Math.floor(props.maxValueDownloadUpload).toString().length * 12}/>
          <XAxis dataKey="name" hide={true} />
          <Tooltip />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Legend />
          <Area type="monotone" dataKey="download" stroke="#6435c9" fillOpacity={1} fill="url(#colorDownload)" />
          <Area type="monotone" dataKey="upload" stroke="#00b5ad" fillOpacity={1} fill="url(#colorUpload)" />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={"100%"} height={100}>
        <AreaChart data={props.data} >
          <defs>
            <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2185d0" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2185d0" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis stroke="#ccc" type='number' width={ Math.floor(props.maxPing).toString().length * 12}/>
          <XAxis dataKey="name" hide={true} />
          <Tooltip />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Legend />
          <Area type="monotone" dataKey="ping" stroke="#2185d0" fillOpacity={1} fill="url(#colorPing)" />
        </AreaChart>
      </ResponsiveContainer>
    </Segment>
  );

}
