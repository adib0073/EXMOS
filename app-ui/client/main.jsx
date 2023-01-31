import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
//import { App } from '/imports/ui/App';
import { LandingPage } from '../imports/ui/LandingPage';
import './main.css';

Meteor.startup(() => {
  //render(<App/>, document.getElementById('react-target'));
  render(<LandingPage/>, document.getElementById('react-target'));
});
