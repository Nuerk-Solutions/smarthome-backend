import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {Logbook, LogbookDocument} from "../core/schemas/logbook.schema";
import {LogbookEntityRepository} from "../../database/logbook.entity.repository";

@Injectable()
export class LogbookRepository extends LogbookEntityRepository<LogbookDocument> {
    constructor(@InjectModel(Logbook.name, 'logbook') private readonly logbookModel: Model<LogbookDocument>) {
        super(logbookModel);
    }
}
