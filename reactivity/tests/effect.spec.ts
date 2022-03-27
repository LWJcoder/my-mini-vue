import { reactive } from "../reactive";
import {effect } from "../effect";

describe("effect", () => {
  it('test effect', () => {
    const user = reactive({
      age: 1
    })

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    })
    expect(nextAge).toBe(2);

    // update
    user.age++;
    expect(nextAge).toBe(3);

  });

  it('should return runner', () => {
    // effect(fn) -> function(runner) -> fn -> return val;
    let f = 1;

    let run = effect(() => {
      f++;
      return 'foo';
    });

    expect(f).toBe(2);
    let r = run();
    expect(f).toBe(3);

    expect(r).toBe('foo');
  })

  });