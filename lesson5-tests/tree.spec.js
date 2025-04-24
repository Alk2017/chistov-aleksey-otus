const getFilesList = require('./tree')
const mock = require('mock-fs');



afterEach(() => {
    mock.restore();
});

beforeEach(() => {
    mock({
        'testSet1': {
            'test2': {
                'test12': {},
                'test10.js':''
            },
            'test11': {
                'test3': {
                    'test4': {
                        'test5.js': '',
                    },
                    'test7.js':''
                },
                'test8.js':''
            },
        }
    });
});

test('test1', () => {
    // arrange
    const expectedArray = [
        ['testSet1', 'test11'],
        ['testSet1', 'test11', 'test3'],
        ['testSet1', 'test11', 'test3', 'test4'],
        ['testSet1', 'test11', 'test3', 'test4', 'test5.js'],
        ['testSet1', 'test11', 'test3', 'test7.js'],
        ['testSet1', 'test11', 'test8.js'],
        ['testSet1', 'test2'],
        ['testSet1', 'test2', 'test10.js'],
        ['testSet1', 'test2', 'test12'],
    ]

    // act
    const result = getFilesList('testSet1', 4);

    // assert(expect)
    expect(result).toStrictEqual(expectedArray);
})

test('test2', () => {
    // arrange
    const expectedArray = [
        ['testSet1', 'test11'],
        ['testSet1', 'test11', 'test3'],
        ['testSet1', 'test11', 'test3', 'test4'],
        ['testSet1', 'test11', 'test3', 'test7.js'],
        ['testSet1', 'test11', 'test8.js'],
        ['testSet1', 'test2'],
        ['testSet1', 'test2', 'test10.js'],
        ['testSet1', 'test2', 'test12'],
    ]

    // act
    const result = getFilesList('testSet1', 3);

    // assert(expect)
    expect(result).toStrictEqual(expectedArray);
})

test('test3', () => {
    // arrange
    const expectedArray = [
        ['testSet1', 'test11'],
        ['testSet1', 'test11', 'test3'],
        ['testSet1', 'test11', 'test8.js'],
        ['testSet1', 'test2'],
        ['testSet1', 'test2', 'test10.js'],
        ['testSet1', 'test2', 'test12'],
    ]

    // act
    const result = getFilesList('testSet1', 2);

    // assert(expect)
    expect(result).toStrictEqual(expectedArray);
})

test('test4', () => {
    // arrange
    const expectedArray = [
        ['testSet1', 'test11'],
        ['testSet1', 'test2'],
    ]

    // act
    const result = getFilesList('testSet1', 1);

    // assert(expect)
    expect(result).toStrictEqual(expectedArray);
})

test('test5', () => {
    // arrange
    const expectedArray = []

    // act
    const result = getFilesList('testSet1', 0);

    // assert(expect)
    expect(result).toStrictEqual(expectedArray);
})