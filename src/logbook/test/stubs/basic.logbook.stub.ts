import { Logbook } from '../../core/schemas/logbook.schema';
import { Types } from 'mongoose';
import { Driver } from '../../core/enums/driver.enum';
import { VehicleTyp } from '../../core/enums/vehicle-typ.enum';
import { AdditionalInformationTyp } from '../../core/enums/additional-information-typ.enum';

// Return a new instance every time
export const basicLogbookStub = (): Logbook => {
  return {
    _id: new Types.ObjectId('634ff77d18495f2dc3a8be80'),
    additionalInformation: 'Winterräder montiert. \n2 Winterreifen neu (Dunlop)',
    additionalInformationCost: '308.90',
    additionalInformationTyp: AdditionalInformationTyp.GEWARTET,
    currentMileAge: '168228',
    newMileAge: '168251',
    date: new Date(1666192177399),
    distance: '23',
    distanceCost: '4.60',
    distanceSinceLastAdditionalInformation: '23.00',
    driveReason: 'Stadtfahrt & Reifen/Räderwechsel',
    driver: Driver.OLIVER,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const basicLogbookStubTypeless = (): any => {
  return {
    _id: '634ff77d18495f2dc3a8be80',
    additionalInformation: 'Winterräder montiert. \n2 Winterreifen neu (Dunlop)',
    additionalInformationCost: '308.90',
    additionalInformationTyp: 'Gewartet',
    currentMileAge: '168228',
    date: '2022-10-19T15:09:37.399Z',
    distance: '23',
    distanceCost: '4.60',
    distanceSinceLastAdditionalInformation: '23.00',
    driveReason: 'Stadtfahrt & Reifen/Räderwechsel',
    driver: 'Oliver',
    forFree: false,
    newMileAge: '168251',
    vehicleTyp: 'VW',
  };
};
