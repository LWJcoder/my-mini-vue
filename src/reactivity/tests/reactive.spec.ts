import { isProxy, isReactive, reactive } from "../reactive";

describe("happy path", () => {

  it("reactive", () => {
    const obj = { foo: 1 };
    const observed = reactive(obj);
    expect(observed).not.toBe(obj);

    
  });

  it('isReactive test', () => {
    const obj = { foo: 1 };
    const observed = reactive(obj);
    expect(isReactive(observed)).toBe(true);
  });

  test('nested reactive', () => {
    const origin = {
      netsted: {
        foo: 1
      },
      array: [{bar: 2}]
    }

    const wrap = reactive(origin);
    expect(isReactive(wrap.netsted)).toBe(true);
    expect(isReactive(wrap.array)).toBe(true);
    expect(isReactive(wrap.array[0])).toBe(true);

    expect(isProxy(wrap)).toBe(true);
    expect(isProxy(wrap.array[0])).toBe(true);
  });
  


})

