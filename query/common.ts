/* Query Interfaces - Common */
/* https://rdf.js.org/query-spec/ */

import { EventEmitter } from "events";
import * as RDF from '../data-model';
import { Term } from '../data-model';

/**
 * Helper union type for quad term names.
 */
export type QuadTermName = 'subject' | 'predicate' | 'object' | 'graph';

/**
 * Custom typings for the RDF/JS ResultStream interface as the current
 * typings restrict the generic param Q to extensions of "BaseQuad",
 * meaning it cannot be used for Bindings.
 */
export interface ResultStream<Q> extends EventEmitter {
  read(): Q | null;
}

/**
 * QueryOperationCost represents the cost of a given query operation.
 */
export interface QueryOperationCost {
  /**
   * An estimation of how many iterations over items are executed.
   * This is used to determine the CPU cost.
   */
  iterations: number;
  /**
   * An estimation of how many items are stored in memory.
   * This is used to determine the memory cost.
   */
  persistedItems: number;
  /**
   * An estimation of how many items block the stream.
   * This is used to determine the time the stream is not progressing anymore.
   */
  blockingItems: number;
  /**
   * An estimation of the time to request items from sources.
   * This is used to determine the I/O cost.
   */
  requestTime: number;
  /**
   * Custom properties
   */
  [key: string]: any;
}

/**
 * QueryOperationOrder represents an ordering of the results of a given query operation.
 *
 * These objects can represent orderings of both quad and bindings streams,
 * respectively identified by quad term names and variables.
 */
export interface QueryOperationOrder<T extends QuadTermName | RDF.Variable> {
  cost: QueryOperationCost;
  terms: { term: T, direction: 'asc' | 'desc' }[];
}

/**
 * QueryResultCardinality represents the number of results, which can either be an estimate or exact value.
 */
export interface QueryResultCardinality {
  /**
   * indicates the type of counting that was done, and MUST either be "estimate" or "exact".
   */
  type: 'estimate' | 'exact';

  /**
   * Indicates an estimated of the number of results in the stream if type = "estimate",
   * or the exact number of quads in the stream if type = "exact".
   */
  value: number;
}

/**
 * A QueryResultMetadata is an object that contains metadata about a certain query result.
 */
export interface QueryResultMetadata<OrderItemsType extends QuadTermName | RDF.Variable> {
  /**
   * A callback field for obtaining the cardinality of the result stream.
   */
  cardinality(precision?:  'estimate' | 'exact'): Promise<QueryResultCardinality>;

  /**
   * A callback for obtaining the current result ordering of the result stream.
   */
  order(): Promise<QueryOperationOrder<OrderItemsType>[]>;

  /**
   * A callback for obtaining all available alternative result orderings for the current query.
   */
  availableOrders(): Promise<QueryOperationOrder<OrderItemsType>[]>;

  /**
   * Custom properties
   */
  [key: string]: any;
}

/**
 * Options that can be passed when executing a query.
 */
export interface QueryExecuteOptions<OrderItemsType extends QuadTermName | RDF.Variable> {
  /**
   * The required order for the result stream.
   */
  order?: QueryOperationOrder<OrderItemsType>;

  /**
   * Custom properties
   */
  [key: string]: any;
}

/**
 * Generic interface that defines query objects following the Future pattern.
 */
export interface BaseQuery {
  /**
   * Identifier for the type of result of tis query.
   */
  resultType: string;

  /**
   * Returns either a stream containing all the items that match the given query,
   * a boolean or void depending on the semantics of the given query.
   */
  execute(opts?: any): Promise<ResultStream<any> | boolean | void>;

  /**
   * Asynchronously metadata of the current result.
   */
  metadata?: QueryResultMetadata<any>;
}

/**
 * Query object that returns bindings.
 */
export interface QueryBindings extends BaseQuery {
  resultType: 'bindings';
  execute(opts?: QueryExecuteOptions<RDF.Variable>): Promise<ResultStream<Bindings>>;
  metadata: QueryResultMetadata<RDF.Variable> & { variables(): Promise<RDF.Variable[]>; };
}

/**
 * Query object that returns quads.
 */
export interface QueryQuads extends BaseQuery {
  resultType: 'quads';
  execute(opts?: QueryExecuteOptions<QuadTermName>): Promise<ResultStream<RDF.Quad>>;
  metadata: QueryResultMetadata<QuadTermName>;
}

/**
 * Query object that returns a boolean.
 */
export interface QueryBoolean extends BaseQuery {
  resultType: 'boolean';
  execute(): Promise<boolean>;
}

/**
 * Query object that returns void.
 */
export interface QueryVoid extends BaseQuery {
  resultType: 'void';
  execute(): Promise<void>;
}

/**
 * Union type for the different query types.
 */
export type Query = QueryBindings | QueryBoolean | QueryQuads | QueryVoid;

/**
 * Bindings represents the mapping of variables to RDF values using an immutable Map-like representation.
 *
 * Bindings instances are created using a BindingsFactory.
 *
 * The internal order of variable-value entries is undefined.
 */
export interface Bindings extends Iterable<[RDF.Variable, RDF.Term]> {
  type: 'bindings';
  /**
   * Check if a binding exist for the given variable.
   * @param key A variable
   */
  has: (key: RDF.Variable) => boolean;
  /**
   * Obtain the binding value for the given variable.
   * @param key A variable
   */
  get: (key: RDF.Variable) => RDF.Term | undefined;
  /**
   * Obtain all variables for which mappings exist.
   */
  keys: () => Iterator<RDF.Variable>;
  /**
   * Obtain all values that are mapped to.
   */
  values: () => Iterator<RDF.Term>;
  /**
   * Iterate over all variable-value pairs.
   * @param fn A callback that is called for each variable-value pair
   *           with value as first argument, and variable as second argument.
   */
  forEach: (fn: (value: RDF.Term, key: RDF.Variable) => any) => void;
  /**
   * The number of variable-value pairs.
   */
  size: number;
  /**
   * Iterator over all variable-value pairs.
   */
  [Symbol.iterator]: () => Iterator<[RDF.Variable, RDF.Term]>;
  /**
   * Check if all entries contained in this Bindings object are equal to all entries in the other Bindings object.
   * @param other A Bindings object.
   */
  equals(other: Bindings | null | undefined): boolean;
}

/**
 * BindingsFactory can create new instances of Bindings.
 */
export interface BindingsFactory {
  /**
   * Create a new Bindings object from the given variable-value entries.
   * @param entries An array of entries, where each entry is a tuple containing a variable and a term.
   */
  bindings: (entries?: [RDF.Variable, RDF.Term][]) => Bindings;
  /**
   * Create a new Bindings object by adding the given variable and value mapping.
   *
   * If the variable already exists in the binding, then the existing mapping is overwritten.
   *
   * @param bindings A Bindings object.
   * @param key The variable key.
   * @param value The value.
   */
  set: (bindings: Bindings, key: RDF.Variable, value: RDF.Term) => Bindings;
  /**
   * Create a new Bindings object by removing the given variable.
   *
   * If the variable does not exist in the binding, a copy of the Bindings object is returned.
   *
   * @param bindings A Bindings object.
   * @param key The variable key.
   */
  delete: (bindings: Bindings, key: RDF.Variable) => Bindings;
  /**
   * Create a new Bindings object from the given Bindings object by filtering entries using a callback.
   * @param bindings The Bindings to filter.
   * @param fn A callback that is applied on each entry.
   *           Returning true indicates that this entry must be contained in the resulting Bindings object.
   */
  filter: (bindings: Bindings, fn: (value: RDF.Term, key: RDF.Variable) => boolean) => Bindings;
  /**
   * Create a new Bindings object from the given Bindings object by mapping entries using a callback.
   * @param bindings The Bindings to map.
   * @param fn A callback that is applied on each entry, in which the original value is replaced by the returned value.
   */
  map: (bindings: Bindings, fn: (value: RDF.Term, key: RDF.Variable) => RDF.Term) => Bindings;
  /**
   * Merge two bindings together.
   *
   * If a merge conflict occurs (left and right have an equal variable with unequal value),
   * then undefined is returned.
   *
   * @param left A Bindings object.
   * @param right A Bindings object.
   */
  merge: (left: Bindings, right: Bindings) => Bindings | undefined;
  /**
   * Merge two bindings together, where merge conflicts can be resolved using a callback function.
   * @param merger A function that is invoked when a merge conflict occurs,
   *               for which the returned value is considered the merged value.
   * @param left A Bindings object.
   * @param right A Bindings object.
   */
  mergeWith: (
    merger: (left: RDF.Term, right: RDF.Term, key: RDF.Variable) => RDF.Term,
    left: Bindings,
    right: Bindings,
  ) => Bindings;
}
