/**
 * Manual test script to verify calculations match Excel formulas
 */

import {
  calculateAttributeCost,
  calculateTraditionCost,
  calculateSkillCost,
} from './src/utils/calculations';

console.log('Testing Attribute Costs:');
console.log('Attribute 1:', calculateAttributeCost(1), '(expected: 0)');
console.log('Attribute 2:', calculateAttributeCost(2), '(expected: 5)');
console.log('Attribute 3:', calculateAttributeCost(3), '(expected: 15)');
console.log('Attribute 4:', calculateAttributeCost(4), '(expected: 30)');
console.log('Attribute 5:', calculateAttributeCost(5), '(expected: 50)');
console.log('Attribute 10:', calculateAttributeCost(10), '(expected: 225)');

console.log('\nTesting Tradition Costs:');
console.log('Tradition 1:', calculateTraditionCost(1), '(expected: 0)');
console.log('Tradition 2:', calculateTraditionCost(2), '(expected: 25)');
console.log('Tradition 3:', calculateTraditionCost(3), '(expected: 60)');
console.log('Tradition 5:', calculateTraditionCost(5), '(expected: 175)');
console.log('Tradition 10:', calculateTraditionCost(10), '(expected: 475)');

console.log('\nTesting Skill Costs:');
console.log('Rank 1, Individual (1x):', calculateSkillCost(1, 1), '(expected: 4)');
console.log('Rank 2, Individual (1x):', calculateSkillCost(2, 1), '(expected: 8)');
console.log('Rank 3, Individual (1x):', calculateSkillCost(3, 1), '(expected: 14)');
console.log('Rank 1, Parent (2.5x):', calculateSkillCost(1, 2.5), '(expected: 10)');
console.log('Rank 2, Parent (2.5x):', calculateSkillCost(2, 2.5), '(expected: 20)');
console.log('Rank 1, Knowledge (0.5x):', calculateSkillCost(1, 0.5), '(expected: 2)');
console.log('Rank 2, Knowledge (0.5x):', calculateSkillCost(2, 0.5), '(expected: 4)');

console.log('\nAll tests completed! Check values against expected results.');
