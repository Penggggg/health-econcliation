import 'reflect-metadata';
import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'node-xlsx';
import { injectable } from 'inversify';
import * as asyncBusboy from 'async-busboy';
import { JsonController, Post, Ctx, Get } from 'routing-controllers';

const DEBUG = process.env.NODE_ENV === 'development';

@JsonController('/files')
@injectable( )
export class UploadCtrl {

  @Post('/upload')
  async upload (
    @Ctx( ) ctx ) {
    try {
      const { files, fields } = await asyncBusboy( ctx.req );
      const filePosition = path.join( __dirname, '../../upload/files' );

      // 1. 把excel表格存起来
      files.map( x => {
        console.log(`正在存储: ${x.filename}`);
        x.pipe( fs.createWriteStream(`${filePosition}/${x.filename}`));
      });

      // 2. 读取内容
      
      return 1;
    } catch ( e ) {
      console.log( e );
      return 1;
    }
  }

  @Get('/delete-all')
  async deleteAll( ) {
    try {
      const filePosition = path.join( __dirname, '../../upload/files' );
      // 0. 清空文件夹内容
      const deleteFolder = path => {
        if ( fs.existsSync( path )) {
          const files = fs.readdirSync( path );
          files.forEach( file => {
            if ( fs.statSync(`${path}/${file}`).isDirectory( )) {
              deleteFolder(`${path}/${file}`);
            } else {
              fs.unlinkSync(`${path}/${file}`);
              console.log(`成功删除文件：${path}/${file}`);
            }
          })
        }
      }
      deleteFolder( filePosition );
      return {
        msg: '重置成功',
        statusCode: 200
      }
    } catch ( e ) {
      return {
        msg: '重置失败，请联系男朋友',
        statusCode: 500
      }
    }
  }

}