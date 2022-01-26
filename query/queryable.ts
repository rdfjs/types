/* Query Interfaces - Queryable */
/* https://rdf.js.org/query-spec/ */

import * as RDF from '../data-model';
import { Bindings, Query, ResultStream } from './common';

// TODO: we may consider defining some standards, like 'string', RDF.Source, ...
/**
 * Context objects provide a way to pass additional bits information to the query engine when executing a query.
 */
export interface QueryContext<SourceType> {
  /**
   * An array of data sources the query engine must use.
   */
  sources: [SourceType, ...SourceType[]];
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
   * Defaults to { language: 'SPARQL', version: '1.1' }
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
   * The query language, e.g. 'SPARQL'.
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
export interface Queryable<QueryFormatType extends string | Algebra, SourceType, QueryType extends Query> {
  /**
   * Initiate a given query.
   *
   * This will produce a future to a query result, which has to be executed to obtain the query results.
   *
   * This can reject given an unsupported or invalid query.
   *
   * @see Query
   */
  query(query: QueryFormatType, context?: QueryStringContext<SourceType>): Promise<QueryType>;
}

/**
 * SPARQL-constrainted query interface.
 *
 * This interface guarantees that result objects are of the expected type as defined by the SPARQL spec.
 */
export type SparqlQueryable<QueryFormatType extends string | Algebra, SourceType, SupportedResultType> = unknown
  & (SupportedResultType extends BindingsResult ? {
  queryBindings(query: QueryFormatType, context?: QueryStringContext<SourceType>): Promise<ResultStream<Bindings>>;
} : unknown)
  & (SupportedResultType extends BooleanResult ? {
  queryBoolean(query: QueryFormatType, context?: QueryStringContext<SourceType>): Promise<boolean>;
} : unknown)
  & (SupportedResultType extends QuadsResult ? {
  queryQuads(query: QueryFormatType, context?: QueryStringContext<SourceType>): Promise<ResultStream<RDF.Quad>>;
} : unknown)
  & (SupportedResultType extends VoidResult ? {
  queryVoid(query: QueryFormatType, context?: QueryStringContext<SourceType>): Promise<void>;
} : unknown)
  ;

export type BindingsResult = { bindings: true };
export type VoidResult = { void: true };
export type QuadsResult = { quads: true };
export type BooleanResult = { boolean: true };
