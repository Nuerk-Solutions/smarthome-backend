import { Logbook } from '../../core/schemas/logbook.schema';
import { AdditionalInformationTyp } from '../../core/enums/additional-information-typ.enum';
import { Driver } from '../../core/enums/driver.enum';
import { VehicleTyp } from '../../core/enums/vehicle-typ.enum';

/**
 * VW
 */
export const complexLogbookStub_VW_0_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '1',
    newMileAge: '2',
    date: new Date(1666192177399),
    distance: '1.00',
    distanceCost: '0.20',
    driveReason: 'complexLogbookStub_VW_0_0_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_1_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '2',
    newMileAge: '4',
    date: new Date(1666192177400),
    distance: '2.00',
    distanceCost: '0.40',
    driveReason: 'complexLogbookStub_VW_1_0_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_2_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '4',
    newMileAge: '10',
    date: new Date(1666192177401),
    distance: '6.00',
    distanceCost: '1.20',
    driveReason: 'complexLogbookStub_VW_2_0_F',
    driver: Driver.CLAUDIA,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_3_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '10',
    newMileAge: '11',
    date: new Date(1666192177402),
    distance: '1.00',
    distanceCost: '0.20',
    driveReason: 'complexLogbookStub_VW_3_0_T',
    driver: Driver.ANDREA,
    forFree: true,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_4_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '11',
    newMileAge: '16',
    date: new Date(1666192177403),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_VW_4_0_T',
    driver: Driver.THOMAS,
    forFree: true,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_5_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '16',
    newMileAge: '20',
    date: new Date(1666192177404),
    distance: '4.00',
    distanceCost: '0.80',
    driveReason: 'complexLogbookStub_VW_5_0_F',
    driver: Driver.OLIVER,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_6_1_F = (): Logbook => {
  return {
    additionalInformation: '43.1',
    additionalInformationCost: '62.9,',
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.GETANKT,
    currentMileAge: '20',
    newMileAge: '25',
    date: new Date(1666192177406),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_VW_6_1_F',
    driver: Driver.CLAUDIA,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_7_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '25',
    newMileAge: '30',
    date: new Date(1666192177407),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_VW_7_0_F',
    driver: Driver.THOMAS,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_8_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '30',
    newMileAge: '35',
    date: new Date(1666192177408),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_VW_8_0_F',
    driver: Driver.OLIVER,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_9_2_F = (): Logbook => {
  return {
    additionalInformation: 'Motor- & Unterbodenwäsche',
    additionalInformationCost: '119',
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.GEWARTET,
    currentMileAge: '35',
    newMileAge: '40',
    date: new Date(1666192177409),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_VW_9_2_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.VW,
  };
};

export const complexLogbookStub_VW_10_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '40',
    newMileAge: '50',
    date: new Date(1666192177410),
    distance: '10.00',
    distanceCost: '2.00',
    driveReason: 'complexLogbookStub_VW_10_0_T',
    driver: Driver.ANDREA,
    forFree: true,
    vehicleTyp: VehicleTyp.VW,
  };
};

/**
 * FERRARI
 */
export const complexLogbookStub_Ferrari_0_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '1',
    newMileAge: '2',
    date: new Date(1666192177399),
    distance: '1.00',
    distanceCost: '0.20',
    driveReason: 'complexLogbookStub_Ferrari_0_0_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_1_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '2',
    newMileAge: '4',
    date: new Date(1666192177400),
    distance: '2.00',
    distanceCost: '0.40',
    driveReason: 'complexLogbookStub_Ferrari_1_0_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_2_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '4',
    newMileAge: '10',
    date: new Date(1666192177401),
    distance: '6.00',
    distanceCost: '1.20',
    driveReason: 'complexLogbookStub_Ferrari_2_0_F',
    driver: Driver.CLAUDIA,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_3_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '10',
    newMileAge: '11',
    date: new Date(1666192177402),
    distance: '1.00',
    distanceCost: '0.20',
    driveReason: 'complexLogbookStub_Ferrari_3_0_T',
    driver: Driver.ANDREA,
    forFree: true,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_4_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '11',
    newMileAge: '16',
    date: new Date(1666192177403),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Ferrari_4_0_T',
    driver: Driver.THOMAS,
    forFree: true,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_5_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '16',
    newMileAge: '20',
    date: new Date(1666192177404),
    distance: '4.00',
    distanceCost: '0.80',
    driveReason: 'complexLogbookStub_Ferrari_5_0_F',
    driver: Driver.OLIVER,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_6_1_F = (): Logbook => {
  return {
    additionalInformation: '43.1',
    additionalInformationCost: '62.9,',
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.GETANKT,
    currentMileAge: '20',
    newMileAge: '25',
    date: new Date(1666192177406),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Ferrari_6_1_F',
    driver: Driver.CLAUDIA,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_7_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '25',
    newMileAge: '30',
    date: new Date(1666192177407),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Ferrari_7_0_F',
    driver: Driver.THOMAS,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_8_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '30',
    newMileAge: '35',
    date: new Date(1666192177408),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Ferrari_8_0_F',
    driver: Driver.OLIVER,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_9_2_F = (): Logbook => {
  return {
    additionalInformation: 'Motor- & Unterbodenwäsche',
    additionalInformationCost: '119',
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.GEWARTET,
    currentMileAge: '35',
    newMileAge: '40',
    date: new Date(1666192177409),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Ferrari_9_2_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

export const complexLogbookStub_Ferrari_10_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '40',
    newMileAge: '50',
    date: new Date(1666192177410),
    distance: '10.00',
    distanceCost: '2.00',
    driveReason: 'complexLogbookStub_Ferrari_10_0_T',
    driver: Driver.ANDREA,
    forFree: true,
    vehicleTyp: VehicleTyp.FERRARI,
  };
};

/**
 * PORSCHE
 */
export const complexLogbookStub_Porsche_0_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '1',
    newMileAge: '2',
    date: new Date(1666192177399),
    distance: '1.00',
    distanceCost: '0.20',
    driveReason: 'complexLogbookStub_Porsche_0_0_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_1_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '2',
    newMileAge: '4',
    date: new Date(1666192177400),
    distance: '2.00',
    distanceCost: '0.40',
    driveReason: 'complexLogbookStub_Porsche_1_0_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_2_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '4',
    newMileAge: '10',
    date: new Date(1666192177401),
    distance: '6.00',
    distanceCost: '1.20',
    driveReason: 'complexLogbookStub_Porsche_2_0_F',
    driver: Driver.CLAUDIA,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_3_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '10',
    newMileAge: '11',
    date: new Date(1666192177402),
    distance: '1.00',
    distanceCost: '0.20',
    driveReason: 'complexLogbookStub_Porsche_3_0_T',
    driver: Driver.ANDREA,
    forFree: true,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_4_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '11',
    newMileAge: '16',
    date: new Date(1666192177403),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Porsche_4_0_T',
    driver: Driver.THOMAS,
    forFree: true,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_5_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '16',
    newMileAge: '20',
    date: new Date(1666192177404),
    distance: '4.00',
    distanceCost: '0.80',
    driveReason: 'complexLogbookStub_Porsche_5_0_F',
    driver: Driver.OLIVER,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_6_1_F = (): Logbook => {
  return {
    additionalInformation: '43.1',
    additionalInformationCost: '62.9,',
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.GETANKT,
    currentMileAge: '20',
    newMileAge: '25',
    date: new Date(1666192177406),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Porsche_6_1_F',
    driver: Driver.CLAUDIA,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_7_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '25',
    newMileAge: '30',
    date: new Date(1666192177407),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Porsche_7_0_F',
    driver: Driver.THOMAS,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_8_0_F = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '30',
    newMileAge: '35',
    date: new Date(1666192177408),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Porsche_8_0_F',
    driver: Driver.OLIVER,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_9_2_F = (): Logbook => {
  return {
    additionalInformation: 'Motor- & Unterbodenwäsche',
    additionalInformationCost: '119',
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.GEWARTET,
    currentMileAge: '35',
    newMileAge: '40',
    date: new Date(1666192177409),
    distance: '5.00',
    distanceCost: '1.00',
    driveReason: 'complexLogbookStub_Porsche_9_2_F',
    driver: Driver.ANDREA,
    forFree: false,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const complexLogbookStub_Porsche_10_0_T = (): Logbook => {
  return {
    additionalInformation: null,
    additionalInformationCost: null,
    distanceSinceLastAdditionalInformation: '',
    additionalInformationTyp: AdditionalInformationTyp.KEINE,
    currentMileAge: '40',
    newMileAge: '50',
    date: new Date(1666192177410),
    distance: '10.00',
    distanceCost: '2.00',
    driveReason: 'complexLogbookStub_Porsche_10_0_T',
    driver: Driver.ANDREA,
    forFree: true,
    vehicleTyp: VehicleTyp.PORSCHE,
  };
};

export const convertComplexLogbookStubToNoType = (logbook: Logbook, id?: any) => {
  return {
    ...(id && { _id: id }),
    additionalInformation: logbook.additionalInformation,
    additionalInformationCost: logbook.additionalInformationCost,
    distanceSinceLastAdditionalInformation: logbook.distanceSinceLastAdditionalInformation,
    additionalInformationTyp: logbook.additionalInformationTyp,
    currentMileAge: logbook.currentMileAge,
    newMileAge: logbook.newMileAge,
    date: logbook.date.toISOString(),
    distance: logbook.distance,
    distanceCost: logbook.distanceCost,
    driveReason: logbook.driveReason,
    driver: logbook.driver,
    forFree: logbook.forFree,
    vehicleTyp: logbook.vehicleTyp,
  };
};

export const convertComplexLogbookStubToNoId = (logbook: Logbook) => {
  return {
    additionalInformation: logbook.additionalInformation,
    additionalInformationCost: logbook.additionalInformationCost,
    distanceSinceLastAdditionalInformation: logbook.distanceSinceLastAdditionalInformation,
    additionalInformationTyp: logbook.additionalInformationTyp,
    currentMileAge: logbook.currentMileAge,
    newMileAge: logbook.newMileAge,
    date: logbook.date,
    distance: logbook.distance,
    distanceCost: logbook.distanceCost,
    driveReason: logbook.driveReason,
    driver: logbook.driver,
    forFree: logbook.forFree,
    vehicleTyp: logbook.vehicleTyp,
  };
};
