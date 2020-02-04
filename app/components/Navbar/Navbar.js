import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Icon } from 'semantic-ui-react'


export default function Navbar(){

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
      <Menu.Item
        as={NavLink}
        exact
        to="/tests"
        name='tests'
      >
        <Icon name='line graph' />
        Days
      </Menu.Item>
    </Menu>
  );

};