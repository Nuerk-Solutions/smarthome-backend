import { Header, Injectable, Res } from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';

@Injectable()
export class VplanService {

  async get(@Res() response) {
    await axios
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
      })
      .catch((err) => err)
  }
}
