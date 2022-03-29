import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe('ref test', () => {
  it('happy path', () => {
    const user = ref(1);
    expect(user.value).toBe(1)
  })

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it('object ref', () => {
    const user = ref({
      foo: 1
    });
    let dummy;
    effect(() => {
      dummy = user.value.foo;
    })
    expect(dummy).toBe(1);
    user.value.foo = 2;
    expect(dummy).toBe(2);
  });

  it('isRef', () => {
    const refFoo = ref(1);
    expect(isRef(refFoo)).toBe(true);
    expect(isRef(ref(true))).toBe(true);
    expect(isRef(reactive({foo: 1}))).toBe(false);

    expect(unRef(refFoo)).toBe(1);
    expect(unRef(2)).toBe(2);
  })

  it('proxy refs', () => {
    const user = {
      age: ref(1),
      name: 'dfsd'
    }
    const proxyUser = proxyRefs(user);
    //get
    expect(user.age.value).toBe(1);
    expect(proxyUser.age).toBe(1);
    expect(proxyUser.name).toBe('dfsd');

    //set
    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);


  })
});