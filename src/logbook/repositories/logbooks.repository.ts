import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {NewLogbook, LogbookDocument} from "../core/schemas/logbook.schema";
import {LogbookEntityRepository} from "../../database/logbook.entity.repository";

@Injectable()
export class LogbooksRepository extends LogbookEntityRepository<LogbookDocument> {
    constructor(@InjectModel(NewLogbook.name, 'logbook') private readonly logbookModel: Model<LogbookDocument>) {
        super(logbookModel);
    }
}
