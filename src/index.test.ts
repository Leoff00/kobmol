import { describe, test, expect } from "bun:test";
import { Getter, WithGetter } from ".";

describe("Kobmol decorators suite", () => {
  test("Getter test", () => {
    @Getter
    @WithGetter
    class Foo {
      bar: string;
      constructor(bar: string) {
        this.bar = bar;
      }
    }
    const Nfoo = WithGetter(Foo);
    const foo = new Nfoo("bar");

    expect(foo.getBar()).toBe("bar");
  });
});
