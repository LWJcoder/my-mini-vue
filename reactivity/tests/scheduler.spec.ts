import { effect, stop } from "../effect";
import { reactive } from "../reactive";

it('scheduler', () => {
  let dummy;
  let run: any;
  const scheduler: any = jest.fn(() => {
    run = runner;
  })

  const obj = reactive({
    foo: 1
  })
  const runner = effect(() => [
    dummy = obj.foo
  ], { scheduler });

  expect(scheduler).not.toHaveBeenCalled();
  expect(dummy).toBe(1);

  obj.foo++;
  expect(scheduler).toHaveBeenCalledTimes(1);
  expect(dummy).toBe(1);
  run();
  expect(dummy).toBe(2);




});


it('stop', () => {
  let dummy;

  const obj = reactive({
    foo: 1
  })
  const runner = effect(() => [
    dummy = obj.foo
  ]);

  obj.foo = 2;
  expect(dummy).toBe(2);
  // 
  stop(runner);
  
  // obj.foo = 3;
  obj.foo++;

  expect(dummy).toBe(2);
  runner();
  expect(dummy).toBe(3);

});