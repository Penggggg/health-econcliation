import 'reflect-metadata';
import * as Koa from 'koa';
import * as path from 'path';
import * as KoaLog from 'koa-logs-full';
import * as KoaServer from 'koa-static2';
import controllers from './controllers';
import { ioc } from './inversify.config';
import { serverConfig } from './config/app.config';
import { useKoaServer, useContainer } from 'routing-controllers';

const app = new Koa( );

app
  .use( KoaServer( 'static', __dirname + '/static'))
  .use( KoaLog( app , {
    logdir: path.join( __dirname, 'logs')
  }));

useContainer( ioc );
useKoaServer( app, {
  controllers
});

if ( process.env.NODE_ENV === 'development' ) {
  app.listen( serverConfig.devPort );
  console.log(`running in ${serverConfig.devPort} with ${process.env.NODE_ENV}.`);
} else {
  app.listen( serverConfig.proPort );
  console.log(`running in ${serverConfig.proPort} with ${process.env.NODE_ENV}.`);
}