import React, { useState, useEffect, useMemo} from "react";
import { Table, Placeholder } from 'semantic-ui-react';

export default function TableDataPlacehold(){

  return (

    [1,2,3,4,5,6,7,8,9,10,11,12].map((test, index) => (
      <Table.Row key={index}>
        <Table.Cell>
          <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
        <Table.Cell>
        <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
        <Table.Cell>
        <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
        <Table.Cell>
        <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
        <Table.Cell>
          <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
        <Table.Cell>
          <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
        <Table.Cell>
          <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
        <Table.Cell>
          <Placeholder style={{height: 39}}>
            <Placeholder.Image />
          </Placeholder>
        </Table.Cell>
      </Table.Row>
    ))

  );

}