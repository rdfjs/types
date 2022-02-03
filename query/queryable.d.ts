/* Query Interfaces - Queryable */
/* https://rdf.js.org/query-spec/ */

import * as RDF from '../data-model';
import { Bindings, Query, ResultStream } from './common';

/**
 * Context objects provide a way to pass additional bits information to the query engine when executing a query.
 */
export interface QueryContext<SourceType> {
  /**
   * An array of data sources the query engine must use.
   */
  sources?: [SourceType, ...SourceType[]];
  /**
   * The date that should be used by SPARQL operations such as NOW().
   */
  queryTimestamp?: Date;
  /**
   * Other options
   */
  [key: string]: any;
}

/**
 * Context object in the case the passed query is a string.
 */
export interface QueryStringContext<SourceType> extends QueryContext<SourceType> {
  /**
   * The format in which the query string is defined.
   * Defaults to { language: 'sparql', version: '1.1' }
   */
  queryFormat?: QueryFormat;
  /**
   * The baseIRI for parsing the query.
   */
  baseIRI?: string;
}

/**
 * Context object in the case the passed query is an algebra object.
 */
export type QueryAlgebraContext<SourceType> = QueryContext<SourceType>;

/**
 * Represents a specific query format
 */
export interface QueryFormat {
  /**
   * The query language, e.g. 'sparql'.
   */
  language: string;
  /**
   * The version of the query language, e.g. '1.1'.
   */
  version: string;
  /**
   * An optional array of extensions on the query language.
   * The representation of these extensions is undefined.
   */
  extensions?: string[];
}

/**
 * Placeholder to represent SPARQL Algebra trees.
 * Algebra typings are TBD. Reference implementations include:
 * - https://www.npmjs.com/package/sparqlalgebrajs
 */
export type Algebra = any;

/**
 * Generic query engine interfaces.
 * It allow engines to return any type of result object for any type of query.
 * @param QueryFormatType The format of the query, either string or algebra object.
 * @param SourceType The allowed sources over which queries can be executed.
 * @param QueryType The allowed query types.
 */
export interface Queryable<
  QueryFormatTypesAvailable extends string | Algebra,
  SourceType,
  QueryType extends Query,
  QueryStringContextType extends QueryStringContext<SourceType>,
  QueryAlgebraContextType extends QueryAlgebraContext<SourceType>,
> {
  /**
   * Initiate a given query.
   *
   * This will produce a future to a query result, which has to be executed to obtain the query results.
   *
   * This can reject given an unsupported or invalid query.
   *
   * @see Query
   */
  query<QueryFormatType extends QueryFormatTypesAvailable>(
    query: QueryFormatType,
    context?: QueryFormatType extends string ? QueryStringContextType : QueryAlgebraContextType,
  ): Promise<QueryType>;
}

/**
 * SPARQL-constrainted query interface.
 *
 * This interface guarantees that result objects are of the expected type as defined by the SPARQL spec.
 */
export type SparqlQueryable<
  QueryFormatTypesAvailable extends string | Algebra,
  SourceType,
  QueryStringContextType extends QueryStringContext<SourceType>,
  QueryAlgebraContextType extends QueryAlgebraContext<SourceType>,
  SupportedResultType,
> = unknown
  & (SupportedResultType extends BindingsResultSupport ? {
  queryBindings<QueryFormatType extends QueryFormatTypesAvailable>(
    query: QueryFormatType,
    context?: QueryFormatType extends string ? QueryStringContextType : QueryAlgebraContextType,
  ): Promise<ResultStream<Bindings>>;
} : unknown)
  & (SupportedResultType extends BooleanResultSupport ? {
  queryBoolean<QueryFormatType extends QueryFormatTypesAvailable>(
    query: QueryFormatType,
    context?: QueryFormatType extends string ? QueryStringContextType : QueryAlgebraContextType,
  ): Promise<boolean>;
} : unknown)
  & (SupportedResultType extends QuadsResultSupport ? {
  queryQuads<QueryFormatType extends QueryFormatTypesAvailable>(
    query: QueryFormatType,
    context?: QueryFormatType extends string ? QueryStringContextType : QueryAlgebraContextType,
  ): Promise<ResultStream<RDF.Quad>>;
} : unknown)
  & (SupportedResultType extends VoidResultSupport ? {
  queryVoid<QueryFormatType extends QueryFormatTypesAvailable>(
    query: QueryFormatType,
    context?: QueryFormatType extends string ? QueryStringContextType : QueryAlgebraContextType,
  ): Promise<void>;
} : unknown)
  ;

export type SparqlResultSupport = BindingsResultSupport & VoidResultSupport & QuadsResultSupport & BooleanResultSupport;
export type BindingsResultSupport = { bindings: true };
export type VoidResultSupport = { void: true };
export type QuadsResultSupport = { quads: true };
export type BooleanResultSupport = { boolean: true };
