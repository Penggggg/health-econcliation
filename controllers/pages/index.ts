import 'reflect-metadata';
import * as fs from 'fs';
import * as Koa from 'koa';
import * as path from 'path';
import { injectable } from 'inversify';
import { JsonController, Get, Ctx } from 'routing-controllers';

const DEBUG = process.env.NODE_ENV === 'development';

@JsonController('/')
@injectable( )
export class PageCtrl {

  @Get('')
  async page( ) {
    const data = fs.readFileSync(
      path.join( __dirname, DEBUG ?
        '../../static/html/index.dev.html' :
        '../../static/html/index.pro.html'
      ),
      'utf8'
    );
    return data;
  }

}