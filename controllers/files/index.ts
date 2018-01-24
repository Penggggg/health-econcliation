import 'reflect-metadata';
import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as KoaSend from 'koa-send';
import * as xlsx from 'node-xlsx';
import { injectable } from 'inversify';
import * as asyncBusboy from 'async-busboy';
import { JsonController, Post, Ctx, Get, Params } from 'routing-controllers';

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

      files.map( x => {
        console.log(`正在存储: ${x.filename}`);
        x.pipe( fs.createWriteStream(`${filePosition}/${x.filename}`));
      });  
    
      return 1;
    } catch ( e ) {

      return 1;
    }
  }

  @Get('/delete-all')
  async deleteAll( ) {
    try {
      const filePosition = path.join( __dirname, '../../upload/files' );
      const downloadPosition = path.join( __dirname, '../../static/download' );
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
      deleteFolder( downloadPosition );
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

  @Get('/download/:file')
  async download(
      @Ctx( ) ctx,
      @Params( ) params
    ) {
    try {
      const filename = params.file;
      ctx.attachment( filename );
      return await KoaSend( ctx, `/upload/files/${filename}` );
    } catch ( e ) {
      console.log( e );
      return;
    }
  }
}