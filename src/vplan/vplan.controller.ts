import { Controller, Get, Res } from '@nestjs/common';
import { VplanService } from './vplan.service';
import axios from 'axios';
import { Readable } from 'stream';

@Controller('vplan')
export class VplanController {
  constructor(private readonly vplanService: VplanService) {}

  @Get()
  // @HttpCode(HttpStatus.OK)
  // @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment;filename=Test.pdf')
  async get(@Res() response) {
    return await axios
      .get('http://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf', {
        headers: {
          Authorization: 'Basic ' + Buffer.from('bsz-et-2021:it-system#20').toString('base64'),
        },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const buffer: Buffer = res.data;
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        response.req.res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': buffer.length,
        });
        stream.pipe(response.req.res);
        // response.set("Content-Type",res.headers['content-type']);
        // response.set("Content-Disposition",res.headers['content-disposition']);
        // res.data.pipe(response);
        // // return res.data;
        // return new Promise((resolve, reject) => {
        //   response.on('finish', resolve);
        //   response.on('error', reject);
        // });
      })
      .catch((err) => err);
  }
}
