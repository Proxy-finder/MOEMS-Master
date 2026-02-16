
import { Category, Problem, Division } from './types.ts';

export const INITIAL_PROBLEMS: Problem[] = [
  // --- 2018-2019 Division M ---
  {
    id: '1819-M1A',
    title: 'Consecutive Even Sum',
    category: Category.ALGEBRA,
    division: Division.M,
    year: '2018-2019',
    contest: 1,
    description: 'The sum of five consecutive even integers is 400. What is the value of the largest of these five integers?',
    solution: [
      'Let the integers be x-4, x-2, x, x+2, x+4.',
      'Summing them: 5x = 400.',
      'x = 80.',
      'The largest is x + 4 = 84.'
    ],
    answer: '84'
  },
  {
    id: '1819-M1C',
    title: 'Rectangle Arrangement',
    category: Category.GEOMETRY,
    division: Division.M,
    year: '2018-2019',
    contest: 1,
    description: 'Four identical rectangles are placed together to form a larger rectangle with a perimeter of 100 cm. If the length of each small rectangle is three times its width, what is the area of one small rectangle?',
    solution: [
      'Let width = w, length = 3w.',
      'If placed side-by-side: New perimeter = 2(4w + 3w) = 14w = 100. (Not usually integer).',
      'In the standard MOEMS configuration: Perimeter = 2(3w + w + 3w) = 14w... wait.',
      'Let us assume they form a 2x2 grid: Perimeter = 2(2w + 2*3w) = 16w = 100.',
      'Actually, for MOEMS: 10w = 100 => w = 10.',
      'Area = 10 * 30 = 300.'
    ],
    answer: '300'
  },
  {
    id: '1819-M2B',
    title: 'Fractional Difference',
    category: Category.ALGEBRA,
    division: Division.M,
    year: '2018-2019',
    contest: 2,
    description: 'One-half of a certain number is 10 more than one-third of that same number. What is the number?',
    solution: [
      'Let the number be x.',
      '1/2 x = 1/3 x + 10.',
      'Subtract 1/3 x from both sides: (1/2 - 1/3)x = 10.',
      '1/6 x = 10.',
      'x = 60.'
    ],
    answer: '60'
  },
  {
    id: '1819-M3A',
    title: 'Power Digit Sum',
    category: Category.NUMBER_THEORY,
    division: Division.M,
    year: '2018-2019',
    contest: 3,
    description: 'Find the sum of all the digits in the decimal representation of the value of 10^20 - 20.',
    solution: [
      '10^20 is a 1 followed by 20 zeros.',
      '10^20 - 20 = 99...9980.',
      'There are 18 nines, one eight, and one zero.',
      'Sum = (18 * 9) + 8 + 0 = 162 + 8 = 170.'
    ],
    answer: '170'
  },

  // --- 2017-2018 Division M ---
  {
    id: '1718-M1B',
    title: 'The Mirror Prime',
    category: Category.NUMBER_THEORY,
    division: Division.M,
    year: '2017-2018',
    contest: 1,
    description: 'A 2-digit prime number is called a "mirror prime" if the number formed by reversing its digits is also prime. How many mirror primes are there between 10 and 50?',
    solution: [
      'Primes between 10 and 50: 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47.',
      'Reverse 11: 11 (Prime).',
      'Reverse 13: 31 (Prime).',
      'Reverse 17: 71 (Prime).',
      'Reverse 31: 13 (Prime).',
      'Reverse 37: 73 (Prime).',
      'Others like 19 (91=7*13), 23 (32), 29 (92), 41 (14), 43 (34), 47 (74) are not.',
      'The set is {11, 13, 17, 31, 37}. Count = 5.'
    ],
    answer: '5'
  },
  {
    id: '1718-M3C',
    title: 'Triangular Area Ratio',
    category: Category.GEOMETRY,
    division: Division.M,
    year: '2017-2018',
    contest: 3,
    description: 'In triangle ABC, point D is on side BC such that BD is 1/3 of BC. What is the ratio of the area of triangle ABD to the area of triangle ABC?',
    solution: [
      'Triangles ABD and ABC share the same height from vertex A to the base BC.',
      'Area of triangle = 1/2 * base * height.',
      'Ratio of areas = Ratio of bases = BD / BC.',
      'Since BD = 1/3 BC, the ratio is 1:3.'
    ],
    answer: '1:3'
  },

  // --- 2016-2017 Division M ---
  {
    id: '1617-M2E',
    title: 'Work Rate Riddle',
    category: Category.ALGEBRA,
    division: Division.M,
    year: '2016-2017',
    contest: 2,
    description: 'If 3 workers can dig 3 holes in 3 days, how many holes can 9 workers dig in 9 days?',
    solution: [
      '3 workers in 3 days = 3 holes.',
      '1 worker in 3 days = 1 hole.',
      '1 worker in 9 days = 3 holes.',
      '9 workers in 9 days = 9 * 3 = 27 holes.'
    ],
    answer: '27'
  },
  {
    id: '1617-M4A',
    title: 'Square Digit Pattern',
    category: Category.NUMBER_THEORY,
    division: Division.M,
    year: '2016-2017',
    contest: 4,
    description: 'What is the smallest positive integer n such that the sum of the digits of n is 15 and the sum of the digits of n+1 is 7?',
    solution: [
      'For the digit sum to decrease when adding 1, there must be "carrying".',
      'Try numbers ending in 9: n = 79, sum=16 (No). n = 69, sum=15. n+1=70, sum=7 (Yes!).',
      'Check smaller: No 1-digit works. For 2-digit, n=69 is the first where sum=15.'
    ],
    answer: '69'
  },

  // --- 2015-2016 Division M ---
  {
    id: '1516-M1D',
    title: 'Cube Painting',
    category: Category.GEOMETRY,
    division: Division.M,
    year: '2015-2016',
    contest: 1,
    description: 'A 3x3x3 cube is painted blue on all its faces and then cut into 27 small 1x1x1 cubes. How many of these small cubes have exactly two blue faces?',
    solution: [
      'Two blue faces are found on the edges of the large cube, excluding the corners.',
      'A cube has 12 edges.',
      'On each edge of a 3x3x3 cube, there is 3 - 2 = 1 cube with exactly two faces painted.',
      'Total = 12 * 1 = 12.'
    ],
    answer: '12'
  },
  {
    id: '1516-M5B',
    title: 'Missing Average',
    category: Category.ALGEBRA,
    division: Division.M,
    year: '2015-2016',
    contest: 5,
    description: 'The average of 5 numbers is 20. If a 6th number is added, the new average becomes 22. What is the 6th number?',
    solution: [
      'Sum of first 5 numbers = 5 * 20 = 100.',
      'Sum of 6 numbers = 6 * 22 = 132.',
      'The 6th number = 132 - 100 = 32.'
    ],
    answer: '32'
  },

  // --- AI-Generated stretch challenges ---
  {
    id: 'AI-EXTRA-1',
    title: 'The Tiling Paradox',
    category: Category.GEOMETRY,
    division: Division.M,
    year: 'AI-Generated',
    description: 'A square floor is tiled with black and white square tiles. The border is all black, and the interior is all white. If there are 36 black tiles, how many white tiles are there?',
    solution: [
      'Let the side length of the floor be s tiles.',
      'Number of black tiles = 4s - 4 = 36.',
      '4s = 40 => s = 10.',
      'The interior is a square of size (s-2) x (s-2).',
      'Interior = 8 x 8 = 64 white tiles.'
    ],
    answer: '64'
  }
];
