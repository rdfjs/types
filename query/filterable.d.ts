/* Query Interfaces - Filterable */
/* https://rdf.js.org/query-spec/ */

import * as RDF from '../data-model';
import { QueryQuads } from './common';

/**
 * Expression is an abstract interface that represents a generic expression over a stream of quads.
 */
export interface Expression {
  /**
   * Value that identifies the concrete interface of the expression,
   * since the Expression itself is not directly instantiated.
   * Possible values include "operator" and "term".
   */
  expressionType: string;
}

/**
 * An OperatorExpression is represents an expression that applies a given operator on given sub-expressions.
 *
 * The WebIDL definition of the Filterable spec contains a list of supported
 * operators: https://rdf.js.org/query-spec/#expression-operators
 */
export interface OperatorExpression extends Expression {

  /**
   * Contains the constant "operator".
   */
  expressionType: 'operator';

  /**
   * Value that identifies an operator. Possible values can be found in the list of operators.
   */
  operator: string;

  /**
   * Array of Expression's on to which the given operator applies.
   * The length of this array depends on the operator.
   */
  args: Expression[];
}

/**
 * A TermExpression is an expression that contains a Term.
 */
export interface TermExpression {

  /**
   * The constant "term".
   */
  expressionType: 'term';

  /**
   * an RDF Term.
   */
  term: RDF.Term;
}

/**
 * ExpressionFactory enables expressions to be created in an idiomatic manner.
 */
export interface ExpressionFactory {

  /**
   * Creates a new OperatorExpression instance for the given operator and array of arguments.
   */
  operatorExpression(operator: string, args: Expression[]): OperatorExpression;

  /**
   * Creates a new TermExpression instance for the given term.
   */
  termExpression(term: RDF.Term): TermExpression;
}

/**
 * A FilterableSource is an object that emits quads based on a quad pattern and filter expression.
 *
 * The emitted quads can be directly contained in this object, or they can be generated on the fly.
 *
 * FilterableSource is not necessarily an extension of the RDF/JS Source
 * interface, but implementers MAY decide to implement both at the same time.
 *
 * matchExpression() Returns a QueryQuads future that can produce a quad
 * stream that contains all quads matching the quad pattern and the expression.
 *
 * When a Term parameter is defined, and is a NamedNode, Literal or BlankNode,
 * it must match each produced quad, according to the Quad.equals semantics.
 * When a Term parameter is a Variable, or it is undefined, it acts as a
 * wildcard, and can match with any Term.
 *
 * NOTES:
 * - When matching with graph set to undefined or null it MUST match all the
 *   graphs (sometimes called the union graph). To match only the default graph
 *   set graph to a DefaultGraph.
 * - When an Expression parameter is defined, the complete quad stream is
 *   filtered according to this expression. When it is undefined, no filter is
 *   applied.
 *
 * If parameters of type Variable with an equal variable name are in place,
 * then the corresponding quad components in the resulting quad stream MUST be
 * equal.
 * Expression's MAY contain Variable Term's. If their variable names are equal
 * to Variable's in the given quad pattern, then the Expression MUST be
 * instantiated for each variable's binding in the resulting quad stream when
 * applying the Expression filter.
 */
export interface FilterableSource<SupportedMetadataType> {
  /**
   * May reject given an unsupported expression.
   */
  matchExpression(
    subject?: RDF.Term,
    predicate?: RDF.Term,
    obj?: RDF.Term,
    graph?: RDF.Term,
    expression?: Expression,
    opts?: {
      length?: number;
      start?: number;
    },
  ): Promise<QueryQuads<SupportedMetadataType>>;
}
