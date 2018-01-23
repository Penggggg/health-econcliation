import controllers from './controllers';
import { Container } from 'inversify';
import { Cache } from './services/cache';

export const ioc = new Container( );

/** controllers bind */
controllers.map( ctrl => ioc.bind( ctrl ).toSelf( ));

/** unique services bind */
ioc.bind( Cache ).toConstantValue( new Cache( ));