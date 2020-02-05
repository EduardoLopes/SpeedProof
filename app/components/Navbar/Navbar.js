import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Icon } from 'semantic-ui-react'


export default function Navbar(props){

  return (
    <Menu inverted pointing size='huge'>
      <Menu.Item
        as={NavLink}
        exact
        to="/"
        name='home'
      >
        <Icon name='home' />
        Home
      </Menu.Item>
      {!props.testsItemDisabled &&
      (<Menu.Item
        as={NavLink}
        exact
        to={"/tests"}
        name='tests'
      >
        <Icon name='line graph' />
        Tests
      </Menu.Item>)}
    </Menu>
  );

};