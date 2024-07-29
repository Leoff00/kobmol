type Getter<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Constructor<T = {}> = new (...args: any[]) => T;

export function WithGetter<T extends Constructor>(
  Base: T
): Constructor<InstanceType<T> & Getter<InstanceType<T>>> {
  return Base as unknown as Constructor<
    InstanceType<T> & Getter<InstanceType<T>>
  >;
}
function capitalize(str: string | symbol): string {
  return typeof str === "symbol"
    ? str.toString()
    : str.charAt(0).toUpperCase() + str.slice(1);
}

export function Getter<T extends Constructor>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      const props = Reflect.ownKeys(this);
      for (let prop of props) {
        if (typeof prop === "string" || typeof prop === "symbol") {
          const capitalizedKey = capitalize(prop);
          const methodName = `get${capitalizedKey}`;
          Reflect.defineProperty(this, methodName, {
            value: () => {
              return (this as any)[prop];
            },
            writable: true,
            configurable: true,
            enumerable: false,
          });
        }
      }
    }
  };
}

// export function Getter<T extends Constructor>(constructor: T) {
//   return class extends constructor {
//     constructor(...args: any[]) {
//       super(...args);
//       const props = Reflect.ownKeys(this);
//       for (let prop of props) {
//         if (typeof prop === "string" || typeof prop === "symbol") {
//           const capitalizedKey = capitalize(prop);
//           const methodName = `get${capitalizedKey}`;
//           Reflect.defineProperty(this, methodName, {
//             value: () => {
//               return (this as any)[prop];
//             },
//             writable: true,
//             configurable: true,
//             enumerable: false,
//           });
//         }
//       }
//     }
//   };
// }

// export function Setter() {
//   return function <T extends Constructor>(constructor: T) {
//     return class extends constructor {
//       constructor(...args: any[]) {
//         super(...args);
//         const props = Reflect.ownKeys(this);
//         props.forEach((prop: string | symbol) => {
//           if (typeof prop === "string") {
//             const capitalizedKey = capitalize(prop);
//             const methodName = `set${capitalizedKey}`;
//             Object.defineProperty(this, methodName, {
//               value: (newValue: any) => {
//                 (this as any)[prop] = newValue;
//               },
//               writable: true,
//               configurable: true,
//               enumerable: false,
//             });
//           }
//         });
//       }
//     };
//   };
// }
