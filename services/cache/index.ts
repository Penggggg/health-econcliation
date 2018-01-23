import * as LRU from 'lru-cache';
import { injectable } from 'inversify';

@injectable( )
export class Cache {

  private DuiZhangCache: LRU.Cache< any, any >;

  private cacheOptions = {
    maxAge: 365 * 24 * 60 * 60 * 1000
  };

  constructor( ) {
    this.DuiZhangCache = LRU( this.cacheOptions );
  }

  public getDuiZhang = key => {
    return this.DuiZhangCache.get( key );
  }

  public setDuiZhang = ( key, value ) => {
    return this.DuiZhangCache.set( key, value, 1000000 );
  }

}