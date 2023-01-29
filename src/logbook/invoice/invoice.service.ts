import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogbookInvoice } from '../core/schemas/logbook-invoice.schema';
import { MailService } from '../../core/mail/mail.service';
import { CreateLogbookInvoiceDto } from '../core/dto/create-logbook-invoice.dto';
import { DriverParameter } from '../core/dto/parameters/driver.parameter';
import { Driver } from '../core/enums/driver.enum';
import { InvoiceParameter } from '../core/dto/parameters/invoice.parameter';
import * as SendGrid from '@sendgrid/mail';
import { convertToMonth } from '../../core/utils/date.util';
import { StatsService } from '../stats/stats.service';
import { LogbooksInvoiceRepository } from '../repositories/logbooksinvoice.repository';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly logbooksInvoiceRepository: LogbooksInvoiceRepository,
    private readonly _mailService: MailService,
    private readonly _statsService: StatsService,
  ) {}

  async executeInvoice(
    createLogbookInvoiceDto: CreateLogbookInvoiceDto,
    drivers: DriverParameter[],
    emailDrivers: DriverParameter[],
  ): Promise<boolean> {
    const lastLogbookInvoiceDate = await this.logbooksInvoiceRepository.findOne({}, { sort: { date: -1 } });
    const invoiceStats = await this._statsService.calculateDriverStats(
      drivers,
      lastLogbookInvoiceDate.date,
      createLogbookInvoiceDto.endDate,
    );
    const sumArrayThomas = invoiceStats.find((item) => item.driver === Driver.THOMAS);
    const sumArrayAndrea = invoiceStats.find((item) => item.driver === Driver.ANDREA);
    const sumThomas = (sumArrayThomas && sumArrayThomas.distanceCost) || 0;
    const sumAndrea = (sumArrayAndrea && sumArrayAndrea.distanceCost) || 0;

    const driverEmailStatsMap: Map<Driver, { email: string; sum: number }> = new Map<
      Driver,
      { email: string; sum: number }
    >();
    if (emailDrivers.includes(Driver.ANDREA as unknown as DriverParameter)) {
      driverEmailStatsMap.set(Driver.ANDREA, { email: 'andrea@nuerkler.de', sum: sumAndrea });
    }
    if (emailDrivers.includes(Driver.CLAUDIA as unknown as DriverParameter)) {
      driverEmailStatsMap.set(Driver.CLAUDIA, {
        email: 'claudia_dresden@icloud.com',
        sum: invoiceStats.find((item) => item.driver === Driver.CLAUDIA).distanceCost,
      });
    }
    if (emailDrivers.includes(Driver.OLIVER as unknown as DriverParameter)) {
      driverEmailStatsMap.set(Driver.OLIVER, {
        email: 'oliver_dresden@freenet.de',
        sum: invoiceStats.find((item) => item.driver === Driver.OLIVER).distanceCost,
      });
    }
    if (emailDrivers.includes(Driver.THOMAS as unknown as DriverParameter)) {
      driverEmailStatsMap.set(Driver.THOMAS, { email: 'thomas@nuerkler.de', sum: sumThomas });
    }

    await this.sendInvoiceSummary(
      {
        email: 'claudia_dresden@icloud.com',
        driver: Driver.CLAUDIA,
        startDate: lastLogbookInvoiceDate.date,
        endDate: new Date(createLogbookInvoiceDto.endDate),
      },
      sumThomas,
      sumAndrea,
      sumAndrea + sumThomas,
    );

    await this.sendInvoiceSummary(
      {
        email: 'thomas@nuerkler.de',
        driver: Driver.CLAUDIA,
        startDate: lastLogbookInvoiceDate.date,
        endDate: new Date(createLogbookInvoiceDto.endDate),
      },
      sumThomas,
      sumAndrea,
      sumAndrea + sumThomas,
    );

    driverEmailStatsMap.forEach((emailStats, driver) => {
      const invoiceParameter: InvoiceParameter = {
        email: emailStats.email,
        driver,
        startDate: lastLogbookInvoiceDate.date,
        endDate: new Date(createLogbookInvoiceDto.endDate),
      };
      this.sendInvoiceMail(invoiceParameter, emailStats.sum);
    });

    await this.logbooksInvoiceRepository.create({ date: createLogbookInvoiceDto.endDate });

    return true;
  }

  public async sendInvoiceSummary(
    invoiceParameter: InvoiceParameter,
    sumThomas: number,
    sumAndrea: number,
    sumAll: number,
  ) {
    const mail: SendGrid.MailDataRequired = {
      to: invoiceParameter.email,
      from: 'Fahrtenbuch Abrechnung <abrechnung@nuerk-solutions.de>',
      templateId: 'd-6caeb18ce41d497d87aaeb78d31aba3c',
      dynamicTemplateData: {
        startMonth: convertToMonth(invoiceParameter.startDate),
        endMonth: convertToMonth(invoiceParameter.endDate),
        person: invoiceParameter.driver,
        sumThomas: sumThomas.toLocaleString('de-DE', {
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'EUR',
        }),
        sumAndrea: sumAndrea.toLocaleString('de-DE', {
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'EUR',
        }),
        sumAll: sumAll.toLocaleString('de-DE', { maximumFractionDigits: 2, style: 'currency', currency: 'EUR' }),
        key: '1BF31DEB232411D1E3FABA4F911CA',
        startDate: invoiceParameter.startDate,
        endDate: invoiceParameter.endDate,
      },
    };
    await this._mailService.sendEmail(mail, true).catch((error) => {
      throw new InternalServerErrorException(error, 'Failed to send mail!');
    });
  }

  async getInvoiceHistory(): Promise<LogbookInvoice[]> {
    return await this.logbooksInvoiceRepository.find({});
  }

  private async sendInvoiceMail(invoiceParameter: InvoiceParameter, sum: number = 0) {
    const mail: SendGrid.MailDataRequired = {
      to: invoiceParameter.email,
      from: 'Fahrtenbuch Abrechnung <abrechnung@nuerk-solutions.de>',
      templateId: 'd-6348c3dcdc9a4514b88efc4401c0299e',
      dynamicTemplateData: {
        startMonth: convertToMonth(invoiceParameter.startDate),
        endMonth: convertToMonth(invoiceParameter.endDate),
        person: invoiceParameter.driver,
        sum: sum.toLocaleString('de-DE', { maximumFractionDigits: 2, style: 'currency', currency: 'EUR' }),
        key: '1BF31DEB232411D1E3FABA4F911CA',
        startDate: invoiceParameter.startDate,
        endDate: invoiceParameter.endDate,
      },
    };
    await this._mailService.sendEmail(mail, true).catch((error) => {
      throw new InternalServerErrorException(error, 'Failed to send mail!');
    });
  }
}
