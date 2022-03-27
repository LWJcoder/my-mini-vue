import {isReadonly, shallowReadonly} from '../reactive';
describe('shallow readonly', () => {
  test('happy path', () => {
    const shallow = shallowReadonly({
      n: {foo: 1}
    });

    expect(isReadonly(shallow)).toBe(true);
    expect(isReadonly(shallow.n)).toBe(false);
    
  })


  it('readonly', () => {
    console.warn = jest.fn();
    const user = shallowReadonly({
      age: 1
    });

    user.age = 10;
    expect(console.warn).toHaveBeenCalled();
  })
})