import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {NewLogbook, NewLogbookDocument} from "../core/schemas/newLogbook.schema";
import {NewLogbookEntityRepository} from "../../database/newLogbook.entity.repository";

@Injectable()
export class NewLogbookRepository extends NewLogbookEntityRepository<NewLogbookDocument> {
    constructor(@InjectModel(NewLogbook.name, 'logbook') private readonly logbookModel: Model<NewLogbookDocument>) {
        super(logbookModel);
    }
}
