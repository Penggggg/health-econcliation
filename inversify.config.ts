import controllers from './controllers';
import { Container } from 'inversify';

export const ioc = new Container( );

/** controllers bind */
controllers.map( ctrl => ioc.bind( ctrl ).toSelf( ));