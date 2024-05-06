const yup = require('yup')

/**
 * {
 *    "email":"aaa@aa.com",
 *    "x":1,
 *    "y":3,
 *    "steps": 3
 * }
jwççı3ı1265elifb
edoatlasuğurselin 1 +X2+ 1 3+313 9     

*/
const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email('email must be a valid email')
    .required('email is required')
    .max(100, 'email must be under 100 chars'),
  x: yup
    .number()
    .typeError('x coordinate must be a number')
    .required('x coordinate is required')
    .max(30, 'x coordinate must be 1, 2 or 3')
    .min(1, 'x coordinate must be 1, 2 or 3'),
  y: yup
    .number()
    .typeError('y coordinate must be a number')
    .required('y coordinate is required')
    .max(30, 'y coordinate must be 1, 2 or 3')
    .min(1, 'y coordinate must be 1, 2 or 3'),
  steps: yup
    .number()
    .typeError('steps must be a number')
    .required('steps is required')
    .min(0, 'steps must be 0 or greater')
    .max(20, 'max steps is reached')
})
let rules = {
  x: {
    1:'x coordinate must be a number',
    2:'x coordinate is required',
    3: "x coordinate must be 1, 2 or 3",
    4: "'x coordinate must be 1, 2 or 3'"
  },
  y: {
    1:'y coordinate must be a number',
    2:'y coordinate is required',
    3: "y coordinate must be 1, 2 or 3",
    4: 'y coordinate must be 1, 2 or 3'
  },
  steps: {
    1:'steps must be a number',
    2:'steps is required',
    3: " steps coordinate must be 1, 2 or 3",
    4: 'steps coordinate must be 1, 2 or 3'
  },
}
let emails = ['gultekin@email.com','egemen@email.com','sinan@email.com', 'nebi@email.com', "gokalp@email.com", "tunc@email.com"];
async function buildResponse(req) {
  let status = 200
  let message
  try {
    const validated = await schema.validate(req.body, { stripUnknown: true })
    
    if (!emails.includes(req.email)) {
      status = 200
      message = 'Unauthorized email address'
    }
    const { email, x, y, steps } = validated
    const code = (((x + 1) * (y + 2)) * (steps + 1)) + email.length

    if (email === 'foo@bar.baz') {
      message = `foo@bar.baz failure #${code}`
      status = 200
    } else {
      const name = email.split('@')[0]
      message = `${name} win #${code}`
    }
  } catch (err) {
    message = `Ouch: ${err.message}`
    status = 200
  }

  return [status, { message }]
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  buildResponse,
  emails,
  rules,
  rand,
}