import { transform, localhostRegex } from '../src/transform'

describe('localhostRegex', () => {
  const links = (() => {
    const schemas = ['http', 'https']
    const ports = [undefined, 3000]
    const paths = [undefined, '/foo/bar']
    const querystrings = [undefined, '?', '?foo=bar']
    const fragments = [undefined, '#', '#foo']
    return schemas.flatMap(schema =>
      ports.flatMap(port =>
        paths.flatMap(path =>
          querystrings.flatMap(querystring =>
            fragments.map(
              fragment =>
                `${schema}://localhost${port ? `:${port}` : ''}${path || ''}${querystring || ''}${fragment || ''}`
            )
          )
        )
      )
    )
  })()

  describe('test cases', () => {
    it('generates links', () => {
      expect(links.length).toBe(72)
      expect(links[links.length - 1]).toBe(
        'https://localhost:3000/foo/bar?foo=bar#foo'
      )
    })
  })

  it('matches localhost URLs', () => {
    for (const link of links) expect(link).toMatch(localhostRegex)
  })

  it('matches markdown localhost URLs', () => {
    for (const link of links)
      expect(`[My Cool Link](${link})`).toMatch(localhostRegex)
  })

  it('does not match invalid/incomplete URLs', () => {
    expect('localhost').not.toMatch(localhostRegex)
    expect('localhost:').not.toMatch(localhostRegex)
  })
})

describe('transform', () => {
  const test = (url: string, expected: string): void =>
    it(`transforms ${url} to ${expected}`, () =>
      expect(
        transform(
          {
            Staging: 'https://staging.example.com',
            Production: 'https://example.com'
          },
          url
        )
      ).toBe(expected))

  test(
    'http://localhost',
    'https://staging.example.com (Open in [Production](https://example.com), [Development](http://localhost))'
  )
  test(
    'http://localhost:3000/',
    'https://staging.example.com/ (Open in [Production](https://example.com/), [Development](http://localhost:3000/))'
  )
  test(
    'http://localhost?foo=bar',
    'https://staging.example.com?foo=bar (Open in [Production](https://example.com?foo=bar), [Development](http://localhost?foo=bar))'
  )
  test(
    'http://localhost#',
    'https://staging.example.com# (Open in [Production](https://example.com#), [Development](http://localhost#))'
  )
  test(
    'http://localhost?',
    'https://staging.example.com? (Open in [Production](https://example.com?), [Development](http://localhost?))'
  )
  test(
    'http://localhost#foo',
    'https://staging.example.com#foo (Open in [Production](https://example.com#foo), [Development](http://localhost#foo))'
  )
  test(
    'http://localhost?foo=bar#foo',
    'https://staging.example.com?foo=bar#foo (Open in [Production](https://example.com?foo=bar#foo), [Development](http://localhost?foo=bar#foo))'
  )
  test(
    'http://localhost:3000',
    'https://staging.example.com (Open in [Production](https://example.com), [Development](http://localhost:3000))'
  )
  test(
    'http://localhost:3000?foo=bar',
    'https://staging.example.com?foo=bar (Open in [Production](https://example.com?foo=bar), [Development](http://localhost:3000?foo=bar))'
  )
  test(
    'http://localhost:3000#foo',
    'https://staging.example.com#foo (Open in [Production](https://example.com#foo), [Development](http://localhost:3000#foo))'
  )
  test(
    'http://localhost:3000?foo=bar#baz',
    'https://staging.example.com?foo=bar#baz (Open in [Production](https://example.com?foo=bar#baz), [Development](http://localhost:3000?foo=bar#baz))'
  )
  test(
    'http://localhost/foo/bar',
    'https://staging.example.com/foo/bar (Open in [Production](https://example.com/foo/bar), [Development](http://localhost/foo/bar))'
  )
  test(
    'http://localhost:3000/foo/bar',
    'https://staging.example.com/foo/bar (Open in [Production](https://example.com/foo/bar), [Development](http://localhost:3000/foo/bar))'
  )
  test(
    'http://localhost/foo/bar?foo=bar',
    'https://staging.example.com/foo/bar?foo=bar (Open in [Production](https://example.com/foo/bar?foo=bar), [Development](http://localhost/foo/bar?foo=bar))'
  )
  test(
    'http://localhost:3000/foo/bar?foo=bar',
    'https://staging.example.com/foo/bar?foo=bar (Open in [Production](https://example.com/foo/bar?foo=bar), [Development](http://localhost:3000/foo/bar?foo=bar))'
  )
  test(
    'http://localhost/foo/bar?foo=bar#foo',
    'https://staging.example.com/foo/bar?foo=bar#foo (Open in [Production](https://example.com/foo/bar?foo=bar#foo), [Development](http://localhost/foo/bar?foo=bar#foo))'
  )
  test(
    'http://localhost:3000/foo/bar?foo=bar#foo',
    'https://staging.example.com/foo/bar?foo=bar#foo (Open in [Production](https://example.com/foo/bar?foo=bar#foo), [Development](http://localhost:3000/foo/bar?foo=bar#foo))'
  )
  test(
    'https://localhost',
    'https://staging.example.com (Open in [Production](https://example.com), [Development](https://localhost))'
  )

  test(
    '[My Cool Link](http://localhost)',
    '[My Cool Link (Staging)](https://staging.example.com) (Open in [Production](https://example.com), [Development](http://localhost))'
  )
  test(
    '[My Cool Link](http://localhost?foo=()#bar)',
    '[My Cool Link (Staging)](https://staging.example.com?foo=()#bar) (Open in [Production](https://example.com?foo=()#bar), [Development](http://localhost?foo=()#bar))'
  )
})
