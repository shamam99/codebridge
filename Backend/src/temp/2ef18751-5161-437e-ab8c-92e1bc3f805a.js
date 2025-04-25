console.log(`Line 1: const nums = [1, 2, 3, 4];`);
const nums = [1, 2, 3, 4];
console.log(`Line 2: `);

console.log(`Line 3: function doubleAll(arr) {`);
function doubleAll(arr) {
console.log(`Line 4:     for (let i = 0; i < arr.length; i++) {`);
    for (let i = 0; i < arr.length; i++) {
console.log(`Line 5:         arr[i] *= 2;`);
        arr[i] *= 2;
console.log(`Line 6:     }`);
    }
console.log(`Line 7:     return arr;`);
    return arr;
console.log(`Line 8: }`);
}
console.log(`Line 9: `);

console.log(`Line 10: console.log(doubleAll(nums));`);
console.log(doubleAll(nums));
console.log(`Line 11: `);

console.log(`Line 12: `);
