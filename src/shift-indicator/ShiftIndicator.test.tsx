import { ShiftIndicator } from './ShiftIndicator';

//date handling in here is strange
const shiftIndicator = new ShiftIndicator({});

const frsReferenceTimestamp = new Date(2018, 5, 24, 8);


test('24th June 2018 should be FRS R3', () => {
    expect(shiftIndicator.getFRSshift(new Date(frsReferenceTimestamp))).toBe(3);
})

test('FRS shift pattern should repeat 3,2,1 cycle', () => {
    expect(shiftIndicator.getFRSshift(new Date(2018, 5, 24, 8))).toBe(3);
    expect(shiftIndicator.getFRSshift(new Date(2018, 5, 25, 8))).toBe(2);
    expect(shiftIndicator.getFRSshift(new Date(2018, 5, 26, 8))).toBe(1);
})

test('FRS shift number changes from 0800hrs onwards', () => {
    const shiftBefore0800 = shiftIndicator.getFRSshift(new Date(2018, 5, 24, 7));
    expect(shiftIndicator.getFRSshift(new Date(2018, 5, 24, 8))).not.toBe(shiftBefore0800
    )
})

test('1 Jan 2019 0800hrs should be EMS R1', () => {
    const timestamp = new Date(2019, 0, 1, 8);
    expect(shiftIndicator.getEMSshift(new Date(timestamp))).toBe(1);
})

test('EMS shift pattern should follow pattern of [1 4 1 4 2 3 2 3 4 1 4 1 3 2 3 2]', () => {

    const shiftCycle = [1, 4, 2, 3, 2, 3, 4, 1, 4, 1, 3, 2, 3, 2, 1, 4];

    for (let i = 0; i < shiftCycle.length; i++) {
        let timestamp = new Date(2019,0,1).setHours(8 + i * 12);
        let date = new Date(timestamp);
        console.log(timestamp.toLocaleString() , 'has shift of ', shiftIndicator.getEMSshift(date));
        expect(shiftIndicator.getEMSshift(date)).toBe(shiftCycle[i])
    }

})