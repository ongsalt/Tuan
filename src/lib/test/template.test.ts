import { parse } from "../template"

test('', () => {

    const html = ''
    expect(parse(html)).tobe(0)
})