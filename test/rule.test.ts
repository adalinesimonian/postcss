import { Rule, parse } from '../lib/postcss.js'

it('initializes with properties', () => {
  let rule = new Rule({ selector: 'a' })
  expect(rule.selector).toBe('a')
})

it('returns array in selectors', () => {
  let rule = new Rule({ selector: 'a,b' })
  expect(rule.selectors).toEqual(['a', 'b'])
})

it('trims selectors', () => {
  let rule = new Rule({ selector: '.a\n, .b  , .c' })
  expect(rule.selectors).toEqual(['.a', '.b', '.c'])
})

it('is smart about selectors commas', () => {
  let rule = new Rule({
    selector: "[foo='a, b'], a:-moz-any(:focus, [href*=','])"
  })
  expect(rule.selectors).toEqual([
    "[foo='a, b']",
    "a:-moz-any(:focus, [href*=','])"
  ])
})

it('receive array in selectors', () => {
  let rule = new Rule({ selector: 'i, b' })
  rule.selectors = ['em', 'strong']
  expect(rule.selector).toBe('em, strong')
})

it('saves separator in selectors', () => {
  let rule = new Rule({ selector: 'i,\nb' })
  rule.selectors = ['em', 'strong']
  expect(rule.selector).toBe('em,\nstrong')
})

it('uses between to detect separator in selectors', () => {
  let rule = new Rule({ selector: 'b', raws: { between: '' } })
  rule.selectors = ['b', 'strong']
  expect(rule.selector).toBe('b,strong')
})

it('uses space in separator be default in selectors', () => {
  let rule = new Rule({ selector: 'b' })
  rule.selectors = ['b', 'strong']
  expect(rule.selector).toBe('b, strong')
})

it('selectors works in constructor', () => {
  let rule = new Rule({ selectors: ['a', 'b'] })
  expect(rule.selector).toBe('a, b')
})

it('inserts default spaces', () => {
  let rule = new Rule({ selector: 'a' })
  expect(rule.toString()).toBe('a {}')
  rule.append({ prop: 'color', value: 'black' })
  expect(rule.toString()).toBe('a {\n    color: black\n}')
})

it('clones spaces from another rule', () => {
  let root = parse('b{\n  }')
  let rule = new Rule({ selector: 'em' })
  root.append(rule)
  expect(root.toString()).toBe('b{\n  }\nem{\n  }')
})

it('uses different spaces for empty rules', () => {
  let root = parse('a{}\nb{\n a:1\n}')
  let rule = new Rule({ selector: 'em' })
  root.append(rule)
  expect(root.toString()).toBe('a{}\nb{\n a:1\n}\nem{}')

  rule.append({ prop: 'top', value: '0' })
  expect(root.toString()).toBe('a{}\nb{\n a:1\n}\nem{\n top:0\n}')
})
