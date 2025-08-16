/* eslint-disable @typescript-eslint/no-explicit-any */

// ------------------------
// Utilidades
// ------------------------
function isPlainObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

type PathSegment = string | "*";

/**
 * Converte "a.b[].c" -> ["a","*","c"]
 * Converte "password" -> ["password"]
 */
function parsePath(path: string): PathSegment[] {
  const parts = path.split(".");
  const segments: PathSegment[] = [];
  for (const p of parts) {
    if (p.endsWith("[]")) {
      const key = p.slice(0, -2);
      if (key) segments.push(key);
      segments.push("*");
    } else {
      segments.push(p);
    }
  }
  return segments;
}

/**
 * Remove UMA rota/propriedade por vez, retornando uma NOVA estrutura (imutável).
 * Suporta objetos e arrays, com "*" para iterar arrays.
 */
function omitOnePath<T>(value: T, segments: PathSegment[]): T {
  if (value == null || segments.length === 0) return value;

  const [head, ...tail] = segments;

  // Se o alvo atual for array:
  if (Array.isArray(value)) {
    if (head === "*") {
      // Aplique o restante a cada item
      return value.map((v) => omitOnePath(v, tail)) as unknown as T;
    }
    // Quando não for "*", aplicamos o mesmo segmento em cada item do array
    return value.map((v) =>
      omitOnePath(v as any, [head, ...tail])
    ) as unknown as T;
  }

  // Se o alvo atual for objeto:
  if (isPlainObject(value)) {
    if (head === "*") {
      // "*" num objeto não faz sentido; apenas ignore.
      return value;
    }

    // Caso seja a folha (último segmento): deletar a chave
    if (tail.length === 0) {
      if (Object.prototype.hasOwnProperty.call(value, head)) {
        // remove a chave via desestruturação (gera novo objeto)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [head]: _deleted, ...rest } = value as Record<string, any>;
        return rest as T;
      }
      return value;
    }

    // Ainda há caminho pela frente: descer recursivamente na chave
    if (Object.prototype.hasOwnProperty.call(value, head)) {
      const currentChild = (value as any)[head];
      const newChild = omitOnePath(currentChild, tail);
      if (newChild === currentChild) return value; // nada mudou
      return { ...(value as any), [head]: newChild } as T;
    }
    return value;
  }

  // Primitivos: não há o que remover
  return value;
}

/**
 * Remove MÚLTIPLAS rotas/propriedades.
 */
export function deepOmit<T>(value: T, paths: string[]): T {
  const parsed = paths.map(parsePath);
  return parsed.reduce<T>((acc, segs) => omitOnePath(acc, segs), value);
}

// ------------------------
// Decorator
// ------------------------

/**
 * Decorator de método que remove propriedades do VALOR RETORNADO.
 *
 * @example
 * class UserService {
 *   @OmitProps(["password", "profile.ssn", "addresses[].geo"])
 *   async list(): Promise<User[]> {
 *     // ... retorna usuários com vários campos
 *   }
 * }
 */

// ... mantenha isPlainObject, deepOmit, etc.

/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyFn = (...args: any[]) => any;

export function Omit(paths: string[]) {
  return function <
    // método original (...args) => R
    R,
    TArgs extends any[] = any[]
  >(
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: TArgs) => R>
  ): void {
    const original = descriptor.value as AnyFn;

    descriptor.value = function (this: any, ...args: TArgs): R {
      const retval = original.apply(this, args);
      const apply = (data: any) => deepOmit(data, paths);

      // suporta sync/async sem mudar a assinatura
      if (retval && typeof (retval as Promise<unknown>)?.then === "function") {
        return (retval as Promise<any>).then(apply) as R;
      }
      return apply(retval) as R;
    } as unknown as (...args: TArgs) => R;
  };
}
