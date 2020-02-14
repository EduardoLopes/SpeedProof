import React from 'react';

import { AreaChart, Area, CartesianGrid, XAxis,YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Chart(props){

  return (
    <ResponsiveContainer width={"100%"} height={100}>
      <AreaChart data={props.data} >
        <defs>
          <linearGradient id={`id-${props.color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={props.color} stopOpacity={0.6}/>
            <stop offset="95%" stopColor={props.color} stopOpacity={1}/>
          </linearGradient>
        </defs>
        {props.domain && (<YAxis domain={props.domain} hide/>)}
        <Tooltip />
        <Area baseLine={80} type="monotone" dataKey={props.dataKey} stroke={props.color} fillOpacity={1} fill={`url(#id-${props.color})`} />
      </AreaChart>
    </ResponsiveContainer>
  );

}