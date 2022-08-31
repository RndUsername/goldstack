/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState } from 'react';

import styles from './$index.module.css';

import staticFileMapperStore from './../state/staticFiles.json';

import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';

import { renderDocument } from './../_document';
import { renderPage, hydrate } from '@goldstack/template-ssr';

import { excludeInBundle } from '@goldstack/utils-esbuild';

import Panel from './../components/Panel';

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

const Index = (props: { message: string }): JSX.Element => {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div
        onClick={() => {
          alert('hi');
          setClicked(true);
          throw new Error('Havent seen this');
        }}
        className={`${styles.message}`}
      >
        {props.message}
      </div>
      {clicked && <Panel />}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: ProxyHandler = async (event, context) => {
  return renderPage({
    component: Index,
    properties: {
      message: 'Hi there',
      dummy: 123,
    },
    entryPoint: __filename,
    event: event,
    staticFileMapperStore,
    renderDocument,
    buildConfig: () => {
      return require(excludeInBundle('./../build')).buildConfig();
    },
  });
};

hydrate(Index);

export default Index;
