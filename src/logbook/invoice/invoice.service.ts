import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogbookInvoice } from '../core/schemas/logbook-invoice.schema';
import { MailService } from '../../core/mail/mail.service';
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
  ) {
  }


  async findNewInvoiceDate(): Promise<Date> {
    const lastLogbookInvoiceDate = await this.logbooksInvoiceRepository.findOne({}, { sort: { date: -1 } });
    return new Date(Date.UTC(lastLogbookInvoiceDate.date.getUTCFullYear(), lastLogbookInvoiceDate.date.getUTCMonth() + 2, 0));
  }

  async executeInvoice(): Promise<boolean> {
    const newInvoiceDate = await this.findNewInvoiceDate();
    const lastInvoiceDate = (await this.logbooksInvoiceRepository.findOne({}, { sort: { date: -1 } })).date;

    const invoiceStats = await this._statsService.getDriverStats(
      [Driver.THOMAS, Driver.ANDREA],
      lastInvoiceDate,
      newInvoiceDate,
    );

    // Hard coded email addresses
    const driverMailMap: Map<Driver, string> = new Map([
      [Driver.ANDREA, 'andrea@nuerkler.de'],
      [Driver.CLAUDIA, 'claudia_dresden@icloud.com'],
      [Driver.THOMAS, 'thomas@nuerkler.de'],
    ]);

    invoiceStats.forEach(item => {
      const driver = item.driver as Driver;

      if (driver === Driver.CLAUDIA) {
        return;
      }

      const mail = driverMailMap.get(driver);
      const invoiceParameter: InvoiceParameter = {
        email: mail,
        driver,
        startDate: lastInvoiceDate,
        endDate: newInvoiceDate,
      };
      this.sendInvoiceMail(invoiceParameter, item.totalCost);
    });


    await this.sendInvoiceSummary(
      {
        email: 'thomas@nuerkler.de',
        driver: Driver.THOMAS,
        startDate: lastInvoiceDate,
        endDate: newInvoiceDate,
      },
      invoiceStats[1]?.totalCost ?? 0.0, // works because of the prev sort | Thomas
      invoiceStats[0]?.totalCost ?? 0.0, // Andrea
      invoiceStats[0]?.totalCost ?? 0.0 + invoiceStats[1]?.totalCost ?? 0.0,
    );

    await this.sendInvoiceSummary(
      {
        email: 'claudia_dresden@icloud.com',
        driver: Driver.THOMAS,
        startDate: lastInvoiceDate,
        endDate: newInvoiceDate,
      },
      invoiceStats[1]?.totalCost ?? 0.0, // works because of the prev sort | Thomas
      invoiceStats[0]?.totalCost ?? 0.0, // Andrea
      invoiceStats[0]?.totalCost ?? 0.0 + invoiceStats[1]?.totalCost ?? 0.0,
    );

    await this.logbooksInvoiceRepository.create({ date: newInvoiceDate });

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
