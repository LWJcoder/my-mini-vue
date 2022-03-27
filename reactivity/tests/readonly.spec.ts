import { isReactive, isReadonly, readonly } from "../reactive";
describe("readonly", () => {
  it("happy path", () => {
    let obj = {
      age: 1,
      screen: {
        b: 1,
      },
    };
    const user = readonly(obj);

    expect(user.age).toBe(1);
    expect(user).not.toBe(obj);
    expect(isReadonly(user)).toBe(true);
    // expect(isReadonly(user.screen)).toBe(true);

    expect(isReadonly(obj)).toBe(false);
    expect(isReadonly(user.screen)).toBe(true);
    expect(isReadonly(obj.screen)).toBe(false);


    // update
    // expect().toBe(3);
  });

  it('readonly', () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 1
    });

    user.age = 10;
    expect(console.warn).toHaveBeenCalled();
  })
});
