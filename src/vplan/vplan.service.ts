import { Header, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VplanService {
  get() {
    return axios
      .get('http://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf', {
        headers: {
          Authorization: 'Basic ' + Buffer.from('bsz-et-2021:it-system#20').toString('base64'),
        },
        responseType: 'stream',
      })
      .then((res) => {
        return new Promise((resolve, reject) => {
          res.data.pipe();
        });
      })
      .catch((err) => err);
  }
}
