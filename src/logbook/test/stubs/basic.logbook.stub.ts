import {NewLogbook} from '../../core/schemas/logbook.schema';
import {Types} from 'mongoose';
import {Driver} from '../../core/enums/driver.enum';
import {Vehicle} from '../../core/enums/vehicle-typ.enum';
import {Unit} from "../../core/enums/unit.enum";

// Return a new instance every time
export const basicLogbookStub = (): NewLogbook => {
    return {
        _id: new Types.ObjectId('634ff77d18495f2dc3a8be80'),
        service: {
            message: 'Winterräder montiert. \n2 Winterreifen neu (Dunlop)',
            price: 308.9,
        },
        mileAge: {
            current: 168228,
            new: 168251,
            difference: 23,
            cost: 4.60,
            unit: Unit.KM,
        },
        date: new Date(1666192177399),
        reason: 'Stadtfahrt & Reifen/Räderwechsel',
        driver: Driver.OLIVER,
        details: {
            covered: false,
            driver: Driver.CLAUDIA,
        },
        vehicle: Vehicle.VW,
    };
};

export const basicLogbookStubTypeless = (): any => {
    return {
        _id: '634ff77d18495f2dc3a8be80',
        service: {
            message: 'Winterräder montiert. \n2 Winterreifen neu (Dunlop)',
            price: 308.9,
        },
        mileAge: {
            current: 168228,
            new: 168251,
            difference: 23,
            cost: 4.60,
            unit: Unit.KM,
        },
        date: '2022-10-19T15:09:37.399Z',
        reason: 'Stadtfahrt & Reifen/Räderwechsel',
        driver: Driver.OLIVER,
        details: {
            covered: false,
            driver: Driver.CLAUDIA,
        },
        vehicle: Vehicle.VW,
    };
};
