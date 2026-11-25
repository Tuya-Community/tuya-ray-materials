import { location } from "@ray-js/ray-next";
import React, { Fragment } from 'react';

import { COMPONENTS } from '@/api/index.config';
import { API_ACTIONS } from '@/api/actions';

import Header from '@/common/Header';
import NavPanel from '@/common/NavPanel';

class My extends React.Component {
  onShow() {
    console.info('my onShow', location);
  }

  onHide() {
    console.info('my onHide');
  }

  handleAction = (actionName: string) => {
    const action = API_ACTIONS[actionName];
    if (action) {
      action();
    }
  };

  render() {
    return (
      <Fragment>
        <Header title='API' description={I18n.t('apiDescription')} variant='catalog' />
        {COMPONENTS.map(({ title, list }) => {
          return <NavPanel layout='list' key={title} title={title} list={list} onAction={this.handleAction} />;
        })}
      </Fragment>
    );
  }
}

export default My;
