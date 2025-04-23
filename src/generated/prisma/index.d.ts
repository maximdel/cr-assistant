
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Opponent
 * 
 */
export type Opponent = $Result.DefaultSelection<Prisma.$OpponentPayload>
/**
 * Model Encounter
 * 
 */
export type Encounter = $Result.DefaultSelection<Prisma.$EncounterPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Opponents
 * const opponents = await prisma.opponent.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Opponents
   * const opponents = await prisma.opponent.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.opponent`: Exposes CRUD operations for the **Opponent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Opponents
    * const opponents = await prisma.opponent.findMany()
    * ```
    */
  get opponent(): Prisma.OpponentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.encounter`: Exposes CRUD operations for the **Encounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Encounters
    * const encounters = await prisma.encounter.findMany()
    * ```
    */
  get encounter(): Prisma.EncounterDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Opponent: 'Opponent',
    Encounter: 'Encounter'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "opponent" | "encounter"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Opponent: {
        payload: Prisma.$OpponentPayload<ExtArgs>
        fields: Prisma.OpponentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OpponentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OpponentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>
          }
          findFirst: {
            args: Prisma.OpponentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OpponentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>
          }
          findMany: {
            args: Prisma.OpponentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>[]
          }
          create: {
            args: Prisma.OpponentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>
          }
          createMany: {
            args: Prisma.OpponentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OpponentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>[]
          }
          delete: {
            args: Prisma.OpponentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>
          }
          update: {
            args: Prisma.OpponentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>
          }
          deleteMany: {
            args: Prisma.OpponentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OpponentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OpponentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>[]
          }
          upsert: {
            args: Prisma.OpponentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpponentPayload>
          }
          aggregate: {
            args: Prisma.OpponentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOpponent>
          }
          groupBy: {
            args: Prisma.OpponentGroupByArgs<ExtArgs>
            result: $Utils.Optional<OpponentGroupByOutputType>[]
          }
          count: {
            args: Prisma.OpponentCountArgs<ExtArgs>
            result: $Utils.Optional<OpponentCountAggregateOutputType> | number
          }
        }
      }
      Encounter: {
        payload: Prisma.$EncounterPayload<ExtArgs>
        fields: Prisma.EncounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EncounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EncounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findFirst: {
            args: Prisma.EncounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EncounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findMany: {
            args: Prisma.EncounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          create: {
            args: Prisma.EncounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          createMany: {
            args: Prisma.EncounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EncounterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          delete: {
            args: Prisma.EncounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          update: {
            args: Prisma.EncounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          deleteMany: {
            args: Prisma.EncounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EncounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EncounterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          upsert: {
            args: Prisma.EncounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          aggregate: {
            args: Prisma.EncounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEncounter>
          }
          groupBy: {
            args: Prisma.EncounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<EncounterGroupByOutputType>[]
          }
          count: {
            args: Prisma.EncounterCountArgs<ExtArgs>
            result: $Utils.Optional<EncounterCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    opponent?: OpponentOmit
    encounter?: EncounterOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OpponentCountOutputType
   */

  export type OpponentCountOutputType = {
    encounters: number
  }

  export type OpponentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounters?: boolean | OpponentCountOutputTypeCountEncountersArgs
  }

  // Custom InputTypes
  /**
   * OpponentCountOutputType without action
   */
  export type OpponentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpponentCountOutputType
     */
    select?: OpponentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OpponentCountOutputType without action
   */
  export type OpponentCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Opponent
   */

  export type AggregateOpponent = {
    _count: OpponentCountAggregateOutputType | null
    _avg: OpponentAvgAggregateOutputType | null
    _sum: OpponentSumAggregateOutputType | null
    _min: OpponentMinAggregateOutputType | null
    _max: OpponentMaxAggregateOutputType | null
  }

  export type OpponentAvgAggregateOutputType = {
    id: number | null
  }

  export type OpponentSumAggregateOutputType = {
    id: number | null
  }

  export type OpponentMinAggregateOutputType = {
    id: number | null
    tag: string | null
    name: string | null
    lastSeen: Date | null
  }

  export type OpponentMaxAggregateOutputType = {
    id: number | null
    tag: string | null
    name: string | null
    lastSeen: Date | null
  }

  export type OpponentCountAggregateOutputType = {
    id: number
    tag: number
    name: number
    lastSeen: number
    _all: number
  }


  export type OpponentAvgAggregateInputType = {
    id?: true
  }

  export type OpponentSumAggregateInputType = {
    id?: true
  }

  export type OpponentMinAggregateInputType = {
    id?: true
    tag?: true
    name?: true
    lastSeen?: true
  }

  export type OpponentMaxAggregateInputType = {
    id?: true
    tag?: true
    name?: true
    lastSeen?: true
  }

  export type OpponentCountAggregateInputType = {
    id?: true
    tag?: true
    name?: true
    lastSeen?: true
    _all?: true
  }

  export type OpponentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Opponent to aggregate.
     */
    where?: OpponentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Opponents to fetch.
     */
    orderBy?: OpponentOrderByWithRelationInput | OpponentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OpponentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Opponents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Opponents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Opponents
    **/
    _count?: true | OpponentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OpponentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OpponentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OpponentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OpponentMaxAggregateInputType
  }

  export type GetOpponentAggregateType<T extends OpponentAggregateArgs> = {
        [P in keyof T & keyof AggregateOpponent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOpponent[P]>
      : GetScalarType<T[P], AggregateOpponent[P]>
  }




  export type OpponentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OpponentWhereInput
    orderBy?: OpponentOrderByWithAggregationInput | OpponentOrderByWithAggregationInput[]
    by: OpponentScalarFieldEnum[] | OpponentScalarFieldEnum
    having?: OpponentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OpponentCountAggregateInputType | true
    _avg?: OpponentAvgAggregateInputType
    _sum?: OpponentSumAggregateInputType
    _min?: OpponentMinAggregateInputType
    _max?: OpponentMaxAggregateInputType
  }

  export type OpponentGroupByOutputType = {
    id: number
    tag: string
    name: string
    lastSeen: Date
    _count: OpponentCountAggregateOutputType | null
    _avg: OpponentAvgAggregateOutputType | null
    _sum: OpponentSumAggregateOutputType | null
    _min: OpponentMinAggregateOutputType | null
    _max: OpponentMaxAggregateOutputType | null
  }

  type GetOpponentGroupByPayload<T extends OpponentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OpponentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OpponentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OpponentGroupByOutputType[P]>
            : GetScalarType<T[P], OpponentGroupByOutputType[P]>
        }
      >
    >


  export type OpponentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tag?: boolean
    name?: boolean
    lastSeen?: boolean
    encounters?: boolean | Opponent$encountersArgs<ExtArgs>
    _count?: boolean | OpponentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["opponent"]>

  export type OpponentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tag?: boolean
    name?: boolean
    lastSeen?: boolean
  }, ExtArgs["result"]["opponent"]>

  export type OpponentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tag?: boolean
    name?: boolean
    lastSeen?: boolean
  }, ExtArgs["result"]["opponent"]>

  export type OpponentSelectScalar = {
    id?: boolean
    tag?: boolean
    name?: boolean
    lastSeen?: boolean
  }

  export type OpponentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tag" | "name" | "lastSeen", ExtArgs["result"]["opponent"]>
  export type OpponentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounters?: boolean | Opponent$encountersArgs<ExtArgs>
    _count?: boolean | OpponentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OpponentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OpponentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OpponentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Opponent"
    objects: {
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tag: string
      name: string
      lastSeen: Date
    }, ExtArgs["result"]["opponent"]>
    composites: {}
  }

  type OpponentGetPayload<S extends boolean | null | undefined | OpponentDefaultArgs> = $Result.GetResult<Prisma.$OpponentPayload, S>

  type OpponentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OpponentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OpponentCountAggregateInputType | true
    }

  export interface OpponentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Opponent'], meta: { name: 'Opponent' } }
    /**
     * Find zero or one Opponent that matches the filter.
     * @param {OpponentFindUniqueArgs} args - Arguments to find a Opponent
     * @example
     * // Get one Opponent
     * const opponent = await prisma.opponent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OpponentFindUniqueArgs>(args: SelectSubset<T, OpponentFindUniqueArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Opponent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OpponentFindUniqueOrThrowArgs} args - Arguments to find a Opponent
     * @example
     * // Get one Opponent
     * const opponent = await prisma.opponent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OpponentFindUniqueOrThrowArgs>(args: SelectSubset<T, OpponentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Opponent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpponentFindFirstArgs} args - Arguments to find a Opponent
     * @example
     * // Get one Opponent
     * const opponent = await prisma.opponent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OpponentFindFirstArgs>(args?: SelectSubset<T, OpponentFindFirstArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Opponent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpponentFindFirstOrThrowArgs} args - Arguments to find a Opponent
     * @example
     * // Get one Opponent
     * const opponent = await prisma.opponent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OpponentFindFirstOrThrowArgs>(args?: SelectSubset<T, OpponentFindFirstOrThrowArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Opponents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpponentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Opponents
     * const opponents = await prisma.opponent.findMany()
     * 
     * // Get first 10 Opponents
     * const opponents = await prisma.opponent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const opponentWithIdOnly = await prisma.opponent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OpponentFindManyArgs>(args?: SelectSubset<T, OpponentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Opponent.
     * @param {OpponentCreateArgs} args - Arguments to create a Opponent.
     * @example
     * // Create one Opponent
     * const Opponent = await prisma.opponent.create({
     *   data: {
     *     // ... data to create a Opponent
     *   }
     * })
     * 
     */
    create<T extends OpponentCreateArgs>(args: SelectSubset<T, OpponentCreateArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Opponents.
     * @param {OpponentCreateManyArgs} args - Arguments to create many Opponents.
     * @example
     * // Create many Opponents
     * const opponent = await prisma.opponent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OpponentCreateManyArgs>(args?: SelectSubset<T, OpponentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Opponents and returns the data saved in the database.
     * @param {OpponentCreateManyAndReturnArgs} args - Arguments to create many Opponents.
     * @example
     * // Create many Opponents
     * const opponent = await prisma.opponent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Opponents and only return the `id`
     * const opponentWithIdOnly = await prisma.opponent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OpponentCreateManyAndReturnArgs>(args?: SelectSubset<T, OpponentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Opponent.
     * @param {OpponentDeleteArgs} args - Arguments to delete one Opponent.
     * @example
     * // Delete one Opponent
     * const Opponent = await prisma.opponent.delete({
     *   where: {
     *     // ... filter to delete one Opponent
     *   }
     * })
     * 
     */
    delete<T extends OpponentDeleteArgs>(args: SelectSubset<T, OpponentDeleteArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Opponent.
     * @param {OpponentUpdateArgs} args - Arguments to update one Opponent.
     * @example
     * // Update one Opponent
     * const opponent = await prisma.opponent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OpponentUpdateArgs>(args: SelectSubset<T, OpponentUpdateArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Opponents.
     * @param {OpponentDeleteManyArgs} args - Arguments to filter Opponents to delete.
     * @example
     * // Delete a few Opponents
     * const { count } = await prisma.opponent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OpponentDeleteManyArgs>(args?: SelectSubset<T, OpponentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Opponents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpponentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Opponents
     * const opponent = await prisma.opponent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OpponentUpdateManyArgs>(args: SelectSubset<T, OpponentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Opponents and returns the data updated in the database.
     * @param {OpponentUpdateManyAndReturnArgs} args - Arguments to update many Opponents.
     * @example
     * // Update many Opponents
     * const opponent = await prisma.opponent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Opponents and only return the `id`
     * const opponentWithIdOnly = await prisma.opponent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OpponentUpdateManyAndReturnArgs>(args: SelectSubset<T, OpponentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Opponent.
     * @param {OpponentUpsertArgs} args - Arguments to update or create a Opponent.
     * @example
     * // Update or create a Opponent
     * const opponent = await prisma.opponent.upsert({
     *   create: {
     *     // ... data to create a Opponent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Opponent we want to update
     *   }
     * })
     */
    upsert<T extends OpponentUpsertArgs>(args: SelectSubset<T, OpponentUpsertArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Opponents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpponentCountArgs} args - Arguments to filter Opponents to count.
     * @example
     * // Count the number of Opponents
     * const count = await prisma.opponent.count({
     *   where: {
     *     // ... the filter for the Opponents we want to count
     *   }
     * })
    **/
    count<T extends OpponentCountArgs>(
      args?: Subset<T, OpponentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OpponentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Opponent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpponentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OpponentAggregateArgs>(args: Subset<T, OpponentAggregateArgs>): Prisma.PrismaPromise<GetOpponentAggregateType<T>>

    /**
     * Group by Opponent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpponentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OpponentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OpponentGroupByArgs['orderBy'] }
        : { orderBy?: OpponentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OpponentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOpponentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Opponent model
   */
  readonly fields: OpponentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Opponent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OpponentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    encounters<T extends Opponent$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Opponent$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Opponent model
   */
  interface OpponentFieldRefs {
    readonly id: FieldRef<"Opponent", 'Int'>
    readonly tag: FieldRef<"Opponent", 'String'>
    readonly name: FieldRef<"Opponent", 'String'>
    readonly lastSeen: FieldRef<"Opponent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Opponent findUnique
   */
  export type OpponentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * Filter, which Opponent to fetch.
     */
    where: OpponentWhereUniqueInput
  }

  /**
   * Opponent findUniqueOrThrow
   */
  export type OpponentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * Filter, which Opponent to fetch.
     */
    where: OpponentWhereUniqueInput
  }

  /**
   * Opponent findFirst
   */
  export type OpponentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * Filter, which Opponent to fetch.
     */
    where?: OpponentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Opponents to fetch.
     */
    orderBy?: OpponentOrderByWithRelationInput | OpponentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Opponents.
     */
    cursor?: OpponentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Opponents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Opponents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Opponents.
     */
    distinct?: OpponentScalarFieldEnum | OpponentScalarFieldEnum[]
  }

  /**
   * Opponent findFirstOrThrow
   */
  export type OpponentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * Filter, which Opponent to fetch.
     */
    where?: OpponentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Opponents to fetch.
     */
    orderBy?: OpponentOrderByWithRelationInput | OpponentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Opponents.
     */
    cursor?: OpponentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Opponents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Opponents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Opponents.
     */
    distinct?: OpponentScalarFieldEnum | OpponentScalarFieldEnum[]
  }

  /**
   * Opponent findMany
   */
  export type OpponentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * Filter, which Opponents to fetch.
     */
    where?: OpponentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Opponents to fetch.
     */
    orderBy?: OpponentOrderByWithRelationInput | OpponentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Opponents.
     */
    cursor?: OpponentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Opponents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Opponents.
     */
    skip?: number
    distinct?: OpponentScalarFieldEnum | OpponentScalarFieldEnum[]
  }

  /**
   * Opponent create
   */
  export type OpponentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * The data needed to create a Opponent.
     */
    data: XOR<OpponentCreateInput, OpponentUncheckedCreateInput>
  }

  /**
   * Opponent createMany
   */
  export type OpponentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Opponents.
     */
    data: OpponentCreateManyInput | OpponentCreateManyInput[]
  }

  /**
   * Opponent createManyAndReturn
   */
  export type OpponentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * The data used to create many Opponents.
     */
    data: OpponentCreateManyInput | OpponentCreateManyInput[]
  }

  /**
   * Opponent update
   */
  export type OpponentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * The data needed to update a Opponent.
     */
    data: XOR<OpponentUpdateInput, OpponentUncheckedUpdateInput>
    /**
     * Choose, which Opponent to update.
     */
    where: OpponentWhereUniqueInput
  }

  /**
   * Opponent updateMany
   */
  export type OpponentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Opponents.
     */
    data: XOR<OpponentUpdateManyMutationInput, OpponentUncheckedUpdateManyInput>
    /**
     * Filter which Opponents to update
     */
    where?: OpponentWhereInput
    /**
     * Limit how many Opponents to update.
     */
    limit?: number
  }

  /**
   * Opponent updateManyAndReturn
   */
  export type OpponentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * The data used to update Opponents.
     */
    data: XOR<OpponentUpdateManyMutationInput, OpponentUncheckedUpdateManyInput>
    /**
     * Filter which Opponents to update
     */
    where?: OpponentWhereInput
    /**
     * Limit how many Opponents to update.
     */
    limit?: number
  }

  /**
   * Opponent upsert
   */
  export type OpponentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * The filter to search for the Opponent to update in case it exists.
     */
    where: OpponentWhereUniqueInput
    /**
     * In case the Opponent found by the `where` argument doesn't exist, create a new Opponent with this data.
     */
    create: XOR<OpponentCreateInput, OpponentUncheckedCreateInput>
    /**
     * In case the Opponent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OpponentUpdateInput, OpponentUncheckedUpdateInput>
  }

  /**
   * Opponent delete
   */
  export type OpponentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
    /**
     * Filter which Opponent to delete.
     */
    where: OpponentWhereUniqueInput
  }

  /**
   * Opponent deleteMany
   */
  export type OpponentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Opponents to delete
     */
    where?: OpponentWhereInput
    /**
     * Limit how many Opponents to delete.
     */
    limit?: number
  }

  /**
   * Opponent.encounters
   */
  export type Opponent$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Opponent without action
   */
  export type OpponentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Opponent
     */
    select?: OpponentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Opponent
     */
    omit?: OpponentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpponentInclude<ExtArgs> | null
  }


  /**
   * Model Encounter
   */

  export type AggregateEncounter = {
    _count: EncounterCountAggregateOutputType | null
    _avg: EncounterAvgAggregateOutputType | null
    _sum: EncounterSumAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  export type EncounterAvgAggregateOutputType = {
    id: number | null
    opponentId: number | null
  }

  export type EncounterSumAggregateOutputType = {
    id: number | null
    opponentId: number | null
  }

  export type EncounterMinAggregateOutputType = {
    id: number | null
    opponentId: number | null
    playedAt: Date | null
  }

  export type EncounterMaxAggregateOutputType = {
    id: number | null
    opponentId: number | null
    playedAt: Date | null
  }

  export type EncounterCountAggregateOutputType = {
    id: number
    opponentId: number
    deck: number
    playedAt: number
    _all: number
  }


  export type EncounterAvgAggregateInputType = {
    id?: true
    opponentId?: true
  }

  export type EncounterSumAggregateInputType = {
    id?: true
    opponentId?: true
  }

  export type EncounterMinAggregateInputType = {
    id?: true
    opponentId?: true
    playedAt?: true
  }

  export type EncounterMaxAggregateInputType = {
    id?: true
    opponentId?: true
    playedAt?: true
  }

  export type EncounterCountAggregateInputType = {
    id?: true
    opponentId?: true
    deck?: true
    playedAt?: true
    _all?: true
  }

  export type EncounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounter to aggregate.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Encounters
    **/
    _count?: true | EncounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EncounterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EncounterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EncounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EncounterMaxAggregateInputType
  }

  export type GetEncounterAggregateType<T extends EncounterAggregateArgs> = {
        [P in keyof T & keyof AggregateEncounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEncounter[P]>
      : GetScalarType<T[P], AggregateEncounter[P]>
  }




  export type EncounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithAggregationInput | EncounterOrderByWithAggregationInput[]
    by: EncounterScalarFieldEnum[] | EncounterScalarFieldEnum
    having?: EncounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EncounterCountAggregateInputType | true
    _avg?: EncounterAvgAggregateInputType
    _sum?: EncounterSumAggregateInputType
    _min?: EncounterMinAggregateInputType
    _max?: EncounterMaxAggregateInputType
  }

  export type EncounterGroupByOutputType = {
    id: number
    opponentId: number
    deck: JsonValue
    playedAt: Date
    _count: EncounterCountAggregateOutputType | null
    _avg: EncounterAvgAggregateOutputType | null
    _sum: EncounterSumAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  type GetEncounterGroupByPayload<T extends EncounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EncounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EncounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EncounterGroupByOutputType[P]>
            : GetScalarType<T[P], EncounterGroupByOutputType[P]>
        }
      >
    >


  export type EncounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    opponentId?: boolean
    deck?: boolean
    playedAt?: boolean
    opponent?: boolean | OpponentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    opponentId?: boolean
    deck?: boolean
    playedAt?: boolean
    opponent?: boolean | OpponentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    opponentId?: boolean
    deck?: boolean
    playedAt?: boolean
    opponent?: boolean | OpponentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectScalar = {
    id?: boolean
    opponentId?: boolean
    deck?: boolean
    playedAt?: boolean
  }

  export type EncounterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "opponentId" | "deck" | "playedAt", ExtArgs["result"]["encounter"]>
  export type EncounterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    opponent?: boolean | OpponentDefaultArgs<ExtArgs>
  }
  export type EncounterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    opponent?: boolean | OpponentDefaultArgs<ExtArgs>
  }
  export type EncounterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    opponent?: boolean | OpponentDefaultArgs<ExtArgs>
  }

  export type $EncounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Encounter"
    objects: {
      opponent: Prisma.$OpponentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      opponentId: number
      deck: Prisma.JsonValue
      playedAt: Date
    }, ExtArgs["result"]["encounter"]>
    composites: {}
  }

  type EncounterGetPayload<S extends boolean | null | undefined | EncounterDefaultArgs> = $Result.GetResult<Prisma.$EncounterPayload, S>

  type EncounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EncounterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EncounterCountAggregateInputType | true
    }

  export interface EncounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Encounter'], meta: { name: 'Encounter' } }
    /**
     * Find zero or one Encounter that matches the filter.
     * @param {EncounterFindUniqueArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EncounterFindUniqueArgs>(args: SelectSubset<T, EncounterFindUniqueArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Encounter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EncounterFindUniqueOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EncounterFindUniqueOrThrowArgs>(args: SelectSubset<T, EncounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Encounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EncounterFindFirstArgs>(args?: SelectSubset<T, EncounterFindFirstArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Encounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EncounterFindFirstOrThrowArgs>(args?: SelectSubset<T, EncounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Encounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Encounters
     * const encounters = await prisma.encounter.findMany()
     * 
     * // Get first 10 Encounters
     * const encounters = await prisma.encounter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const encounterWithIdOnly = await prisma.encounter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EncounterFindManyArgs>(args?: SelectSubset<T, EncounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Encounter.
     * @param {EncounterCreateArgs} args - Arguments to create a Encounter.
     * @example
     * // Create one Encounter
     * const Encounter = await prisma.encounter.create({
     *   data: {
     *     // ... data to create a Encounter
     *   }
     * })
     * 
     */
    create<T extends EncounterCreateArgs>(args: SelectSubset<T, EncounterCreateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Encounters.
     * @param {EncounterCreateManyArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EncounterCreateManyArgs>(args?: SelectSubset<T, EncounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Encounters and returns the data saved in the database.
     * @param {EncounterCreateManyAndReturnArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Encounters and only return the `id`
     * const encounterWithIdOnly = await prisma.encounter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EncounterCreateManyAndReturnArgs>(args?: SelectSubset<T, EncounterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Encounter.
     * @param {EncounterDeleteArgs} args - Arguments to delete one Encounter.
     * @example
     * // Delete one Encounter
     * const Encounter = await prisma.encounter.delete({
     *   where: {
     *     // ... filter to delete one Encounter
     *   }
     * })
     * 
     */
    delete<T extends EncounterDeleteArgs>(args: SelectSubset<T, EncounterDeleteArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Encounter.
     * @param {EncounterUpdateArgs} args - Arguments to update one Encounter.
     * @example
     * // Update one Encounter
     * const encounter = await prisma.encounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EncounterUpdateArgs>(args: SelectSubset<T, EncounterUpdateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Encounters.
     * @param {EncounterDeleteManyArgs} args - Arguments to filter Encounters to delete.
     * @example
     * // Delete a few Encounters
     * const { count } = await prisma.encounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EncounterDeleteManyArgs>(args?: SelectSubset<T, EncounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Encounters
     * const encounter = await prisma.encounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EncounterUpdateManyArgs>(args: SelectSubset<T, EncounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Encounters and returns the data updated in the database.
     * @param {EncounterUpdateManyAndReturnArgs} args - Arguments to update many Encounters.
     * @example
     * // Update many Encounters
     * const encounter = await prisma.encounter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Encounters and only return the `id`
     * const encounterWithIdOnly = await prisma.encounter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EncounterUpdateManyAndReturnArgs>(args: SelectSubset<T, EncounterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Encounter.
     * @param {EncounterUpsertArgs} args - Arguments to update or create a Encounter.
     * @example
     * // Update or create a Encounter
     * const encounter = await prisma.encounter.upsert({
     *   create: {
     *     // ... data to create a Encounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Encounter we want to update
     *   }
     * })
     */
    upsert<T extends EncounterUpsertArgs>(args: SelectSubset<T, EncounterUpsertArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCountArgs} args - Arguments to filter Encounters to count.
     * @example
     * // Count the number of Encounters
     * const count = await prisma.encounter.count({
     *   where: {
     *     // ... the filter for the Encounters we want to count
     *   }
     * })
    **/
    count<T extends EncounterCountArgs>(
      args?: Subset<T, EncounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EncounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EncounterAggregateArgs>(args: Subset<T, EncounterAggregateArgs>): Prisma.PrismaPromise<GetEncounterAggregateType<T>>

    /**
     * Group by Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EncounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EncounterGroupByArgs['orderBy'] }
        : { orderBy?: EncounterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EncounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEncounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Encounter model
   */
  readonly fields: EncounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Encounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EncounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    opponent<T extends OpponentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OpponentDefaultArgs<ExtArgs>>): Prisma__OpponentClient<$Result.GetResult<Prisma.$OpponentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Encounter model
   */
  interface EncounterFieldRefs {
    readonly id: FieldRef<"Encounter", 'Int'>
    readonly opponentId: FieldRef<"Encounter", 'Int'>
    readonly deck: FieldRef<"Encounter", 'Json'>
    readonly playedAt: FieldRef<"Encounter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Encounter findUnique
   */
  export type EncounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findUniqueOrThrow
   */
  export type EncounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findFirst
   */
  export type EncounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findFirstOrThrow
   */
  export type EncounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findMany
   */
  export type EncounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounters to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter create
   */
  export type EncounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to create a Encounter.
     */
    data: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
  }

  /**
   * Encounter createMany
   */
  export type EncounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
  }

  /**
   * Encounter createManyAndReturn
   */
  export type EncounterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Encounter update
   */
  export type EncounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to update a Encounter.
     */
    data: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
    /**
     * Choose, which Encounter to update.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter updateMany
   */
  export type EncounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Encounters.
     */
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyInput>
    /**
     * Filter which Encounters to update
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to update.
     */
    limit?: number
  }

  /**
   * Encounter updateManyAndReturn
   */
  export type EncounterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * The data used to update Encounters.
     */
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyInput>
    /**
     * Filter which Encounters to update
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Encounter upsert
   */
  export type EncounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The filter to search for the Encounter to update in case it exists.
     */
    where: EncounterWhereUniqueInput
    /**
     * In case the Encounter found by the `where` argument doesn't exist, create a new Encounter with this data.
     */
    create: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
    /**
     * In case the Encounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
  }

  /**
   * Encounter delete
   */
  export type EncounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter which Encounter to delete.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter deleteMany
   */
  export type EncounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounters to delete
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to delete.
     */
    limit?: number
  }

  /**
   * Encounter without action
   */
  export type EncounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OpponentScalarFieldEnum: {
    id: 'id',
    tag: 'tag',
    name: 'name',
    lastSeen: 'lastSeen'
  };

  export type OpponentScalarFieldEnum = (typeof OpponentScalarFieldEnum)[keyof typeof OpponentScalarFieldEnum]


  export const EncounterScalarFieldEnum: {
    id: 'id',
    opponentId: 'opponentId',
    deck: 'deck',
    playedAt: 'playedAt'
  };

  export type EncounterScalarFieldEnum = (typeof EncounterScalarFieldEnum)[keyof typeof EncounterScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type OpponentWhereInput = {
    AND?: OpponentWhereInput | OpponentWhereInput[]
    OR?: OpponentWhereInput[]
    NOT?: OpponentWhereInput | OpponentWhereInput[]
    id?: IntFilter<"Opponent"> | number
    tag?: StringFilter<"Opponent"> | string
    name?: StringFilter<"Opponent"> | string
    lastSeen?: DateTimeFilter<"Opponent"> | Date | string
    encounters?: EncounterListRelationFilter
  }

  export type OpponentOrderByWithRelationInput = {
    id?: SortOrder
    tag?: SortOrder
    name?: SortOrder
    lastSeen?: SortOrder
    encounters?: EncounterOrderByRelationAggregateInput
  }

  export type OpponentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    tag?: string
    AND?: OpponentWhereInput | OpponentWhereInput[]
    OR?: OpponentWhereInput[]
    NOT?: OpponentWhereInput | OpponentWhereInput[]
    name?: StringFilter<"Opponent"> | string
    lastSeen?: DateTimeFilter<"Opponent"> | Date | string
    encounters?: EncounterListRelationFilter
  }, "id" | "tag">

  export type OpponentOrderByWithAggregationInput = {
    id?: SortOrder
    tag?: SortOrder
    name?: SortOrder
    lastSeen?: SortOrder
    _count?: OpponentCountOrderByAggregateInput
    _avg?: OpponentAvgOrderByAggregateInput
    _max?: OpponentMaxOrderByAggregateInput
    _min?: OpponentMinOrderByAggregateInput
    _sum?: OpponentSumOrderByAggregateInput
  }

  export type OpponentScalarWhereWithAggregatesInput = {
    AND?: OpponentScalarWhereWithAggregatesInput | OpponentScalarWhereWithAggregatesInput[]
    OR?: OpponentScalarWhereWithAggregatesInput[]
    NOT?: OpponentScalarWhereWithAggregatesInput | OpponentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Opponent"> | number
    tag?: StringWithAggregatesFilter<"Opponent"> | string
    name?: StringWithAggregatesFilter<"Opponent"> | string
    lastSeen?: DateTimeWithAggregatesFilter<"Opponent"> | Date | string
  }

  export type EncounterWhereInput = {
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    id?: IntFilter<"Encounter"> | number
    opponentId?: IntFilter<"Encounter"> | number
    deck?: JsonFilter<"Encounter">
    playedAt?: DateTimeFilter<"Encounter"> | Date | string
    opponent?: XOR<OpponentScalarRelationFilter, OpponentWhereInput>
  }

  export type EncounterOrderByWithRelationInput = {
    id?: SortOrder
    opponentId?: SortOrder
    deck?: SortOrder
    playedAt?: SortOrder
    opponent?: OpponentOrderByWithRelationInput
  }

  export type EncounterWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    opponentId?: IntFilter<"Encounter"> | number
    deck?: JsonFilter<"Encounter">
    playedAt?: DateTimeFilter<"Encounter"> | Date | string
    opponent?: XOR<OpponentScalarRelationFilter, OpponentWhereInput>
  }, "id">

  export type EncounterOrderByWithAggregationInput = {
    id?: SortOrder
    opponentId?: SortOrder
    deck?: SortOrder
    playedAt?: SortOrder
    _count?: EncounterCountOrderByAggregateInput
    _avg?: EncounterAvgOrderByAggregateInput
    _max?: EncounterMaxOrderByAggregateInput
    _min?: EncounterMinOrderByAggregateInput
    _sum?: EncounterSumOrderByAggregateInput
  }

  export type EncounterScalarWhereWithAggregatesInput = {
    AND?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    OR?: EncounterScalarWhereWithAggregatesInput[]
    NOT?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Encounter"> | number
    opponentId?: IntWithAggregatesFilter<"Encounter"> | number
    deck?: JsonWithAggregatesFilter<"Encounter">
    playedAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
  }

  export type OpponentCreateInput = {
    tag: string
    name: string
    lastSeen?: Date | string
    encounters?: EncounterCreateNestedManyWithoutOpponentInput
  }

  export type OpponentUncheckedCreateInput = {
    id?: number
    tag: string
    name: string
    lastSeen?: Date | string
    encounters?: EncounterUncheckedCreateNestedManyWithoutOpponentInput
  }

  export type OpponentUpdateInput = {
    tag?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUpdateManyWithoutOpponentNestedInput
  }

  export type OpponentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tag?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUncheckedUpdateManyWithoutOpponentNestedInput
  }

  export type OpponentCreateManyInput = {
    id?: number
    tag: string
    name: string
    lastSeen?: Date | string
  }

  export type OpponentUpdateManyMutationInput = {
    tag?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpponentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tag?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateInput = {
    deck: JsonNullValueInput | InputJsonValue
    playedAt?: Date | string
    opponent: OpponentCreateNestedOneWithoutEncountersInput
  }

  export type EncounterUncheckedCreateInput = {
    id?: number
    opponentId: number
    deck: JsonNullValueInput | InputJsonValue
    playedAt?: Date | string
  }

  export type EncounterUpdateInput = {
    deck?: JsonNullValueInput | InputJsonValue
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    opponent?: OpponentUpdateOneRequiredWithoutEncountersNestedInput
  }

  export type EncounterUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    opponentId?: IntFieldUpdateOperationsInput | number
    deck?: JsonNullValueInput | InputJsonValue
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateManyInput = {
    id?: number
    opponentId: number
    deck: JsonNullValueInput | InputJsonValue
    playedAt?: Date | string
  }

  export type EncounterUpdateManyMutationInput = {
    deck?: JsonNullValueInput | InputJsonValue
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    opponentId?: IntFieldUpdateOperationsInput | number
    deck?: JsonNullValueInput | InputJsonValue
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EncounterListRelationFilter = {
    every?: EncounterWhereInput
    some?: EncounterWhereInput
    none?: EncounterWhereInput
  }

  export type EncounterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OpponentCountOrderByAggregateInput = {
    id?: SortOrder
    tag?: SortOrder
    name?: SortOrder
    lastSeen?: SortOrder
  }

  export type OpponentAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type OpponentMaxOrderByAggregateInput = {
    id?: SortOrder
    tag?: SortOrder
    name?: SortOrder
    lastSeen?: SortOrder
  }

  export type OpponentMinOrderByAggregateInput = {
    id?: SortOrder
    tag?: SortOrder
    name?: SortOrder
    lastSeen?: SortOrder
  }

  export type OpponentSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type OpponentScalarRelationFilter = {
    is?: OpponentWhereInput
    isNot?: OpponentWhereInput
  }

  export type EncounterCountOrderByAggregateInput = {
    id?: SortOrder
    opponentId?: SortOrder
    deck?: SortOrder
    playedAt?: SortOrder
  }

  export type EncounterAvgOrderByAggregateInput = {
    id?: SortOrder
    opponentId?: SortOrder
  }

  export type EncounterMaxOrderByAggregateInput = {
    id?: SortOrder
    opponentId?: SortOrder
    playedAt?: SortOrder
  }

  export type EncounterMinOrderByAggregateInput = {
    id?: SortOrder
    opponentId?: SortOrder
    playedAt?: SortOrder
  }

  export type EncounterSumOrderByAggregateInput = {
    id?: SortOrder
    opponentId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EncounterCreateNestedManyWithoutOpponentInput = {
    create?: XOR<EncounterCreateWithoutOpponentInput, EncounterUncheckedCreateWithoutOpponentInput> | EncounterCreateWithoutOpponentInput[] | EncounterUncheckedCreateWithoutOpponentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutOpponentInput | EncounterCreateOrConnectWithoutOpponentInput[]
    createMany?: EncounterCreateManyOpponentInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutOpponentInput = {
    create?: XOR<EncounterCreateWithoutOpponentInput, EncounterUncheckedCreateWithoutOpponentInput> | EncounterCreateWithoutOpponentInput[] | EncounterUncheckedCreateWithoutOpponentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutOpponentInput | EncounterCreateOrConnectWithoutOpponentInput[]
    createMany?: EncounterCreateManyOpponentInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EncounterUpdateManyWithoutOpponentNestedInput = {
    create?: XOR<EncounterCreateWithoutOpponentInput, EncounterUncheckedCreateWithoutOpponentInput> | EncounterCreateWithoutOpponentInput[] | EncounterUncheckedCreateWithoutOpponentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutOpponentInput | EncounterCreateOrConnectWithoutOpponentInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutOpponentInput | EncounterUpsertWithWhereUniqueWithoutOpponentInput[]
    createMany?: EncounterCreateManyOpponentInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutOpponentInput | EncounterUpdateWithWhereUniqueWithoutOpponentInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutOpponentInput | EncounterUpdateManyWithWhereWithoutOpponentInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EncounterUncheckedUpdateManyWithoutOpponentNestedInput = {
    create?: XOR<EncounterCreateWithoutOpponentInput, EncounterUncheckedCreateWithoutOpponentInput> | EncounterCreateWithoutOpponentInput[] | EncounterUncheckedCreateWithoutOpponentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutOpponentInput | EncounterCreateOrConnectWithoutOpponentInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutOpponentInput | EncounterUpsertWithWhereUniqueWithoutOpponentInput[]
    createMany?: EncounterCreateManyOpponentInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutOpponentInput | EncounterUpdateWithWhereUniqueWithoutOpponentInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutOpponentInput | EncounterUpdateManyWithWhereWithoutOpponentInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type OpponentCreateNestedOneWithoutEncountersInput = {
    create?: XOR<OpponentCreateWithoutEncountersInput, OpponentUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: OpponentCreateOrConnectWithoutEncountersInput
    connect?: OpponentWhereUniqueInput
  }

  export type OpponentUpdateOneRequiredWithoutEncountersNestedInput = {
    create?: XOR<OpponentCreateWithoutEncountersInput, OpponentUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: OpponentCreateOrConnectWithoutEncountersInput
    upsert?: OpponentUpsertWithoutEncountersInput
    connect?: OpponentWhereUniqueInput
    update?: XOR<XOR<OpponentUpdateToOneWithWhereWithoutEncountersInput, OpponentUpdateWithoutEncountersInput>, OpponentUncheckedUpdateWithoutEncountersInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EncounterCreateWithoutOpponentInput = {
    deck: JsonNullValueInput | InputJsonValue
    playedAt?: Date | string
  }

  export type EncounterUncheckedCreateWithoutOpponentInput = {
    id?: number
    deck: JsonNullValueInput | InputJsonValue
    playedAt?: Date | string
  }

  export type EncounterCreateOrConnectWithoutOpponentInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutOpponentInput, EncounterUncheckedCreateWithoutOpponentInput>
  }

  export type EncounterCreateManyOpponentInputEnvelope = {
    data: EncounterCreateManyOpponentInput | EncounterCreateManyOpponentInput[]
  }

  export type EncounterUpsertWithWhereUniqueWithoutOpponentInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutOpponentInput, EncounterUncheckedUpdateWithoutOpponentInput>
    create: XOR<EncounterCreateWithoutOpponentInput, EncounterUncheckedCreateWithoutOpponentInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutOpponentInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutOpponentInput, EncounterUncheckedUpdateWithoutOpponentInput>
  }

  export type EncounterUpdateManyWithWhereWithoutOpponentInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutOpponentInput>
  }

  export type EncounterScalarWhereInput = {
    AND?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    OR?: EncounterScalarWhereInput[]
    NOT?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    id?: IntFilter<"Encounter"> | number
    opponentId?: IntFilter<"Encounter"> | number
    deck?: JsonFilter<"Encounter">
    playedAt?: DateTimeFilter<"Encounter"> | Date | string
  }

  export type OpponentCreateWithoutEncountersInput = {
    tag: string
    name: string
    lastSeen?: Date | string
  }

  export type OpponentUncheckedCreateWithoutEncountersInput = {
    id?: number
    tag: string
    name: string
    lastSeen?: Date | string
  }

  export type OpponentCreateOrConnectWithoutEncountersInput = {
    where: OpponentWhereUniqueInput
    create: XOR<OpponentCreateWithoutEncountersInput, OpponentUncheckedCreateWithoutEncountersInput>
  }

  export type OpponentUpsertWithoutEncountersInput = {
    update: XOR<OpponentUpdateWithoutEncountersInput, OpponentUncheckedUpdateWithoutEncountersInput>
    create: XOR<OpponentCreateWithoutEncountersInput, OpponentUncheckedCreateWithoutEncountersInput>
    where?: OpponentWhereInput
  }

  export type OpponentUpdateToOneWithWhereWithoutEncountersInput = {
    where?: OpponentWhereInput
    data: XOR<OpponentUpdateWithoutEncountersInput, OpponentUncheckedUpdateWithoutEncountersInput>
  }

  export type OpponentUpdateWithoutEncountersInput = {
    tag?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpponentUncheckedUpdateWithoutEncountersInput = {
    id?: IntFieldUpdateOperationsInput | number
    tag?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateManyOpponentInput = {
    id?: number
    deck: JsonNullValueInput | InputJsonValue
    playedAt?: Date | string
  }

  export type EncounterUpdateWithoutOpponentInput = {
    deck?: JsonNullValueInput | InputJsonValue
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateWithoutOpponentInput = {
    id?: IntFieldUpdateOperationsInput | number
    deck?: JsonNullValueInput | InputJsonValue
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateManyWithoutOpponentInput = {
    id?: IntFieldUpdateOperationsInput | number
    deck?: JsonNullValueInput | InputJsonValue
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}