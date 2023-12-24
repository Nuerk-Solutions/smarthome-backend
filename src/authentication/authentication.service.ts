import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {

  public validateApiKey(apiKey: string) {
    const apiKeys: string[] = [
      'ca03na188ame03u1d78620de67282882a84',
      'd2e621a6646a4211768cd68e26f21228a81',
      'E1BB22EF78C616558EAC71E972B4A',
      '1BF31DEB232411D1E3FABA4F911CA',
    ];

    return apiKeys.includes(apiKey);
  }
}
