import {NewLogbook} from '../../core/schemas/logbook.schema';
import {Driver} from '../../core/enums/driver.enum';
import {Vehicle} from '../../core/enums/vehicle-typ.enum';
import {Unit} from "../../core/enums/unit.enum";

/**
 * VW
 */
export const complexLogbookStub_VW_0_0_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.VW,
        date: new Date(1666192177399),
        reason: 'complexLogbookStub_VW_0_0_F',
        mileAge: {
            current: 1,
            new: 2,
            unit: Unit.KM,
            difference: 1,
            cost: 0.2,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_VW_1_0_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.VW,
        date: new Date(1666192177400),
        reason: 'complexLogbookStub_VW_1_0_F',
        mileAge: {
            current: 2,
            new: 4,
            unit: Unit.KM,
            difference: 2,
            cost: 0.4,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_VW_2_0_F = (): NewLogbook => {
    return {
        driver: Driver.CLAUDIA,
        vehicle: Vehicle.VW,
        date: new Date(1666192177401),
        reason: 'complexLogbookStub_VW_2_0_F',
        mileAge: {
            current: 4,
            new: 10,
            unit: Unit.KM,
            difference: 6,
            cost: 1.2,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_VW_3_0_T = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.VW,
        date: new Date(1666192177402),
        reason: 'complexLogbookStub_VW_3_0_T',
        mileAge: {
            current: 10,
            new: 11,
            unit: Unit.KM,
            difference: 1,
            cost: 0.2,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 2,
            price: 4,
            distanceDifference: 0, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: false,
        },
    };
};

export const complexLogbookStub_VW_4_0_T = (): NewLogbook => {
    return {
        driver: Driver.THOMAS,
        vehicle: Vehicle.VW,
        date: new Date(1666192177403),
        reason: 'complexLogbookStub_VW_4_0_T',
        mileAge: {
            current: 11,
            new: 16,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 5, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: false,
        },
    };
};

export const complexLogbookStub_VW_5_0_F = (): NewLogbook => {
    return {
        driver: Driver.OLIVER,
        vehicle: Vehicle.VW,
        date: new Date(1666192177404),
        reason: 'complexLogbookStub_VW_5_0_F',
        mileAge: {
            current: 16,
            new: 20,
            unit: Unit.KM,
            difference: 4,
            cost: 0.80,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_VW_6_1_F = (): NewLogbook => {
    return {
        driver: Driver.CLAUDIA,
        vehicle: Vehicle.VW,
        date: new Date(1666192177406),
        reason: 'complexLogbookStub_VW_6_1_F',
        mileAge: {
            current: 20,
            new: 25,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 43.1, // Update with actual refuel data
            price: 62.9, // Update with actual refuel data
            distanceDifference: 9, // Update with actual refuel data
            consumption: 478.89, // Update with actual refuel data
            isSpecial: false,
        },
    };
};

export const complexLogbookStub_VW_7_0_F = (): NewLogbook => {
    return {
        driver: Driver.THOMAS,
        vehicle: Vehicle.VW,
        date: new Date(1666192177407),
        reason: 'complexLogbookStub_VW_7_0_F',
        mileAge: {
            current: 25,
            new: 30,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_VW_8_0_F = (): NewLogbook => {
    return {
        driver: Driver.OLIVER,
        vehicle: Vehicle.VW,
        date: new Date(1666192177408),
        reason: 'complexLogbookStub_VW_8_0_F',
        mileAge: {
            current: 30,
            new: 35,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_VW_9_2_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.VW,
        date: new Date(1666192177409),
        reason: 'complexLogbookStub_VW_9_2_F',
        mileAge: {
            current: 35,
            new: 40,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        service: {
            message: 'Motor- & Unterbodenwäsche',
            price: 119,
        },
    };
};

export const complexLogbookStub_VW_10_0_T = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.VW,
        date: new Date(1666192177410),
        reason: 'complexLogbookStub_VW_10_0_T',
        mileAge: {
            current: 40,
            new: 50,
            unit: Unit.KM,
            difference: 10,
            cost: 2.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 25, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: true,
        },
    };
};
/**
 * FERRARI
 */
export const complexLogbookStub_Ferrari_0_0_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177399),
        reason: 'complexLogbookStub_Ferrari_0_0_F',
        mileAge: {
            current: 1,
            new: 2,
            unit: Unit.KM,
            difference: 1,
            cost: 0.20,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Ferrari_1_0_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177400),
        reason: 'complexLogbookStub_Ferrari_1_0_F',
        mileAge: {
            current: 2,
            new: 4,
            unit: Unit.KM,
            difference: 2,
            cost: 0.40,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Ferrari_2_0_F = (): NewLogbook => {
    return {
        driver: Driver.CLAUDIA,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177401),
        reason: 'complexLogbookStub_Ferrari_2_0_F',
        mileAge: {
            current: 4,
            new: 10,
            unit: Unit.KM,
            difference: 6,
            cost: 1.20,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Ferrari_3_0_T = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177402),
        reason: 'complexLogbookStub_Ferrari_3_0_T',
        mileAge: {
            current: 10,
            new: 11,
            unit: Unit.KM,
            difference: 1,
            cost: 0.20,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 0, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: true,
        },
    };
};

export const complexLogbookStub_Ferrari_4_0_T = (): NewLogbook => {
    return {
        driver: Driver.THOMAS,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177403),
        reason: 'complexLogbookStub_Ferrari_4_0_T',
        mileAge: {
            current: 11,
            new: 16,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 5, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: true,
        },
    };
};

export const complexLogbookStub_Ferrari_5_0_F = (): NewLogbook => {
    return {
        driver: Driver.OLIVER,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177404),
        reason: 'complexLogbookStub_Ferrari_5_0_F',
        mileAge: {
            current: 16,
            new: 20,
            unit: Unit.KM,
            difference: 4,
            cost: 0.80,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Ferrari_6_1_F = (): NewLogbook => {
    return {
        driver: Driver.CLAUDIA,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177406),
        reason: 'complexLogbookStub_Ferrari_6_1_F',
        mileAge: {
            current: 20,
            new: 25,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 43.1, // Update with actual refuel data
            price: 62.9, // Update with actual refuel data
            distanceDifference: 9, // Update with actual refuel data
            consumption: 478.89, // Update with actual refuel data
            isSpecial: false,
        },
    };
};

export const complexLogbookStub_Ferrari_7_0_F = (): NewLogbook => {
    return {
        driver: Driver.THOMAS,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177407),
        reason: 'complexLogbookStub_Ferrari_7_0_F',
        mileAge: {
            current: 25,
            new: 30,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Ferrari_8_0_F = (): NewLogbook => {
    return {
        driver: Driver.OLIVER,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177408),
        reason: 'complexLogbookStub_Ferrari_8_0_F',
        mileAge: {
            current: 30,
            new: 35,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Ferrari_9_2_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177409),
        reason: 'complexLogbookStub_Ferrari_9_2_F',
        mileAge: {
            current: 35,
            new: 40,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        service: {
            message: 'Motor- & Unterbodenwäsche',
            price: 119,
        },
    };
};

export const complexLogbookStub_Ferrari_10_0_T = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.FERRARI,
        date: new Date(1666192177410),
        reason: 'complexLogbookStub_Ferrari_10_0_T',
        mileAge: {
            current: 40,
            new: 50,
            unit: Unit.KM,
            difference: 10,
            cost: 2.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 25, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: true,
        },
    };
};
/**
 * PORSCHE
 */
export const complexLogbookStub_Porsche_0_0_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177399),
        reason: 'complexLogbookStub_Porsche_0_0_F',
        mileAge: {
            current: 1,
            new: 2,
            unit: Unit.KM,
            difference: 1,
            cost: 0.20,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Porsche_1_0_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177400),
        reason: 'complexLogbookStub_Porsche_1_0_F',
        mileAge: {
            current: 2,
            new: 4,
            unit: Unit.KM,
            difference: 2,
            cost: 0.40,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Porsche_2_0_F = (): NewLogbook => {
    return {
        driver: Driver.CLAUDIA,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177401),
        reason: 'complexLogbookStub_Porsche_2_0_F',
        mileAge: {
            current: 4,
            new: 10,
            unit: Unit.KM,
            difference: 6,
            cost: 1.20,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Porsche_3_0_T = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177402),
        reason: 'complexLogbookStub_Porsche_3_0_T',
        mileAge: {
            current: 10,
            new: 11,
            unit: Unit.KM,
            difference: 1,
            cost: 0.20,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 0, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: true,
        },
    };
};

export const complexLogbookStub_Porsche_4_0_T = (): NewLogbook => {
    return {
        driver: Driver.THOMAS,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177403),
        reason: 'complexLogbookStub_Porsche_4_0_T',
        mileAge: {
            current: 11,
            new: 16,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 5, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: true,
        },
    };
};

export const complexLogbookStub_Porsche_5_0_F = (): NewLogbook => {
    return {
        driver: Driver.OLIVER,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177404),
        reason: 'complexLogbookStub_Porsche_5_0_F',
        mileAge: {
            current: 16,
            new: 20,
            unit: Unit.KM,
            difference: 4,
            cost: 0.80,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Porsche_6_1_F = (): NewLogbook => {
    return {
        driver: Driver.CLAUDIA,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177406),
        reason: 'complexLogbookStub_Porsche_6_1_F',
        mileAge: {
            current: 20,
            new: 25,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 43.1, // Update with actual refuel data
            price: 62.9, // Update with actual refuel data
            distanceDifference: 9, // Update with actual refuel data
            consumption: 478.89, // Update with actual refuel data
            isSpecial: false,
        },
    };
};

export const complexLogbookStub_Porsche_7_0_F = (): NewLogbook => {
    return {
        driver: Driver.THOMAS,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177407),
        reason: 'complexLogbookStub_Porsche_7_0_F',
        mileAge: {
            current: 25,
            new: 30,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Porsche_8_0_F = (): NewLogbook => {
    return {
        driver: Driver.OLIVER,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177408),
        reason: 'complexLogbookStub_Porsche_8_0_F',
        mileAge: {
            current: 30,
            new: 35,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
    };
};

export const complexLogbookStub_Porsche_9_2_F = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177409),
        reason: 'complexLogbookStub_Porsche_9_2_F',
        mileAge: {
            current: 35,
            new: 40,
            unit: Unit.KM,
            difference: 5,
            cost: 1.00,
        },
        details: {
            covered: false,
        },
        service: {
            message: 'Motor- & Unterbodenwäsche',
            price: 119,
        },
    };
};

export const complexLogbookStub_Porsche_10_0_T = (): NewLogbook => {
    return {
        driver: Driver.ANDREA,
        vehicle: Vehicle.PORSCHE,
        date: new Date(1666192177410),
        reason: 'complexLogbookStub_Porsche_10_0_T',
        mileAge: {
            current: 40,
            new: 50,
            unit: Unit.KM,
            difference: 10,
            cost: 2.00,
        },
        details: {
            covered: false,
        },
        refuel: {
            liters: 0, // Update with actual refuel data
            price: 0, // Update with actual refuel data
            distanceDifference: 25, // Update with actual refuel data
            consumption: 0, // Update with actual refuel data
            isSpecial: true,
        },
    };
};


export const convertComplexLogbookStubToNoType = (logbook: NewLogbook, id?: any, date?: any) => {
    return {
        ...(id && {_id: id}),
        ...logbook,
        date: logbook.date.toISOString(),
    };
};

export const convertComplexLogbookStubToNoId = (logbook: NewLogbook) => {
    delete logbook._id;
    if (logbook.refuel)
        if (logbook.refuel.previousRecordId)
            delete logbook.refuel.previousRecordId;
    return {
        ...logbook,
    };
};
