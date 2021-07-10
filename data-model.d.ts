/* Data Model Interfaces */
/* https://rdf.js.org/data-model-spec/ */

/**
 * Contains an Iri, RDF blank Node, RDF literal, variable name, default graph, or a quad
 * @see NamedNode
 * @see BlankNode
 * @see Literal
 * @see Variable
 * @see DefaultGraph
 * @see PlainQuad
 */
export type Term = NamedNode | BlankNode | Literal | Variable | DefaultGraph | StarQuad;

/**
 * Contains an IRI.
 */
export interface NamedNode<Iri extends string = string> {
    /**
     * Contains the constant "NamedNode".
     */
    termType: "NamedNode";
    /**
     * The IRI of the named node (example: `http://example.org/resource`)
     */
    value: Iri;

    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "NamedNode" and the same `value`.
     */
    equals(other: Term | null | undefined): boolean;
}

/**
 * Contains an RDF blank node.
 */
export interface BlankNode {
    /**
     * Contains the constant "BlankNode".
     */
    termType: "BlankNode";
    /**
     * Blank node name as a string, without any serialization specific prefixes,
     * e.g. when parsing,
     * if the data was sourced from Turtle, remove _:,
     * if it was sourced from RDF/XML, do not change the blank node name (example: blank3).
     */
    value: string;

    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "BlankNode" and the same `value`.
     */
    equals(other: Term | null | undefined): boolean;
}

/**
 * An RDF literal, containing a string with an optional language tag and/or datatype.
 */
export interface Literal<Datatype extends StarRole.Datatype=StarRole.Datatype> {
    /**
     * Contains the constant "Literal".
     */
    termType: "Literal";
    /**
     * The text value, unescaped, without language or type (example: Brad Pitt).
     */
    value: string;
    /**
     * the language as lowercase BCP47 string (examples: en, en-gb)
     * or an empty string if the literal has no language.
     * @link http://tools.ietf.org/html/bcp47
     */
    language: string;
    /**
     * A NamedNode whose IRI represents the datatype of the literal.
     */
    datatype: Datatype;

    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "Literal"
     *                   and the same `value`, `language`, and `datatype`.
     */
    equals(other: Term | null | undefined): boolean;
}

/**
 * A variable name.
 */
export interface Variable {
    /**
     * Contains the constant "Variable".
     */
    termType: "Variable";
    /**
     * The name of the variable *without* leading ? (example: a).
     */
    value: string;

    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "Variable" and the same `value`.
     */
    equals(other: Term | null | undefined): boolean;
}

/**
 * An instance of DefaultGraph represents the default graph.
 * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
 */
export interface DefaultGraph {
    /**
     * Contains the constant "DefaultGraph".
     */
    termType: "DefaultGraph";
    /**
     * Contains an empty string as constant value.
     */
    value: "";

    /**
     * @param other The term to compare with.
     * @return True if and only if other has termType "DefaultGraph".
     */
    equals(other: Term | null | undefined): boolean;
}


/**
 * Type to be unioned with term types for forming role-specific pattern types
 */
export type TermPattern = Variable | null;


/**
 * Unions of Term types for the various roles they play in 'plain' RDF 1.1 Data
 */
 export namespace PlainRole {
    export type Subject = NamedNode | BlankNode;
    export type Predicate = NamedNode;
    export type Object = NamedNode | BlankNode | Literal<Datatype>;
    export type Graph = DefaultGraph | NamedNode | BlankNode;
    export type Datatype = NamedNode;
    export type Quad = PlainQuad;
 }

/**
 * Unions of Term types for the various
 */
 export namespace PlainPatern {
    export type Subject = PlainRole.Subject | TermPattern;
    export type Predicate = PlainRole.Predicate | TermPattern;
    export type Object = PlainRole.Object | TermPattern;
    export type Graph = PlainRole.Graph | TermPattern;
    export type Datatype = PlainRole.Datatype | TermPattern;
    export type Quad = PlainQuad | TermPattern;
 }


/**
 * Unions of Term types for the various roles they play in RDF-star data
 */
 export namespace StarRole {
    export type Subject = PlainRole.Subject | StarQuad;
    export type Predicate = PlainRole.Predicate;
    export type Object = NamedNode | BlankNode | Literal<Datatype> | StarQuad;
    export type Graph = PlainRole.Graph;
    export type Datatype = PlainRole.Datatype;
    export type Quad = StarQuad;
 }
 
/**
 * Unions of Term types for the various
 */
export namespace StarPatern {
    export type Subject = StarRole.Subject | TermPattern;
    export type Predicate = StarRole.Predicate | TermPattern;
    export type Object = StarRole.Object | TermPattern;
    export type Graph = StarRole.Graph | TermPattern;
    export type Datatype = StarRole.Datatype | TermPattern;
    export type Quad = StarQuad | TermPattern;
}


/**
 * The subject, which is a NamedNode, BlankNode or Variable.
 * @deprecated Consider using one of the following types instead: @see StarRole.Subject, @see StarPattern.Subject, @see PlainRole.Subject, or @see PlainPatern.Subject
 */
export type Quad_Subject = StarRole.Subject | Variable;

 /**
  * The predicate, which is a NamedNode or Variable.
 * @deprecated Consider using one of the following types instead: @see StarRole.Predicate, @see StarPattern.Predicate, @see PlainRole.Predicate, or @see PlainPatern.Predicate
  */
export type Quad_Predicate = StarRole.Predicate | Variable;
 
 /**
  * The object, which is a NamedNode, Literal, BlankNode or Variable.
 * @deprecated Consider using one of the following types instead: @see StarRole.Object, @see StarPattern.Object, @see PlainRole.Object, or @see PlainPatern.Object
  */
export type Quad_Object = StarRole.Object | Variable;
 
 /**
  * The named graph, which is a DefaultGraph, NamedNode, BlankNode or Variable.
 * @deprecated Consider using one of the following types instead: @see StarRole.Graph, @see StarPattern.Graph, @see PlainRole.Graph, or @see PlainPatern.Graph
  */
export type Quad_Graph = StarRole.Graph | Variable;

/**
 * An RDF quad, taking any Term in its positions, containing the subject, predicate, object and graph terms.
 */
export interface BaseQuad {
    /**
     * Contains the constant "Quad".
     */
    termType: "Quad";
    /**
     * Contains an empty string as constant value.
     */
    value: "";

    /**
     * The subject.
     */
    subject: Term;
    /**
     * The predicate.
     */
    predicate: Term;
    /**
     * The object.
     */
    object: Term;
    /**
     * The named graph.
     */
    graph: Term;

    /**
     * @param other The term to compare with.
     * @return True if and only if the argument is a) of the same type b) has all components equal.
     */
    equals(other: Term | null | undefined): boolean;
}

/**
 * @deprecated This interface allows for `Variable` term types in the quad components. Consider using either @see StarQuad or @see PlainQuad instead
 */
 export interface Quad extends BaseQuad {
    /**
     * The subject.
     * @see Quad_Subject
     */
    subject: Quad_Subject;
    /**
     * The predicate.
     * @see Quad_Predicate
     */
    predicate: Quad_Predicate;
    /**
     * The object.
     * @see Quad_Object
     */
    object: Quad_Object;
    /**
     * The named graph.
     * @see Quad_Graph
     */
    graph: Quad_Graph;
}

/**
 * An RDF quad, containing the subject, predicate, object and graph terms.
 */
export interface StarQuad extends BaseQuad {
    /**
     * The subject.
     * @see StarRole.Subject
     */
    subject: StarRole.Subject;
    /**
     * The predicate.
     * @see StarRole.Predicate
     */
    predicate: StarRole.Predicate;
    /**
     * The object.
     * @see StarRole.Object
     */
    object: StarRole.Object;
    /**
     * The named graph.
     * @see StarRole.Graph
     */
    graph: StarRole.Graph;
}

/**
 * An RDF quad, containing the subject, predicate, object and graph terms.
 */
export interface PlainQuad extends StarQuad {
    /**
     * The subject.
     * @see PlainRole.Subject
     */
    subject: PlainRole.Subject;
    /**
     * The predicate.
     * @see PlainRole.Predicate
     */
    predicate: PlainRole.Predicate;
    /**
     * The object.
     * @see PlainRole.Object
     */
    object: PlainRole.Object;
    /**
     * The named graph.
     * @see PlainRole.Graph
     */
    graph: PlainRole.Graph;
}


/**
 * A factory for instantiating RDF terms and quads.
 */
export interface DataFactory<OutQuad extends BaseQuad = StarQuad, InQuad extends BaseQuad = StarQuad> {
    /**
     * @param value The IRI for the named node.
     * @return A new instance of NamedNode.
     * @see NamedNode
     */
    namedNode<Iri extends string = string>(value: Iri): NamedNode<Iri>;

    /**
     * @param value The optional blank node identifier.
     * @return A new instance of BlankNode.
     *                         If the `value` parameter is undefined a new identifier
     *                         for the blank node is generated for each call.
     * @see BlankNode
     */
    blankNode(value?: string): BlankNode;

    /**
     * @param                 value              The literal value.
     * @param languageOrDatatype The optional language or datatype.
     *    If `languageOrDatatype` is a NamedNode,
     *    then it is used for the value of `NamedNode.datatype`.
     *    Otherwise `languageOrDatatype` is used for the value
     *    of `NamedNode.language`.
     * @return A new instance of Literal.
     * @see Literal
     */
    literal(value: string, languageOrDatatype?: string | NamedNode): Literal;

    /**
     * This method is optional.
     * @param value The variable name
     * @return A new instance of Variable.
     * @see Variable
     */
    variable?(value: string): Variable;

    /**
     * @return An instance of DefaultGraph.
     */
    defaultGraph(): DefaultGraph;

    /**
     * @param subject   The quad subject term.
     * @param predicate The quad predicate term.
     * @param object    The quad object term.
     * @param graph     The quad graph term.
     * @return A new instance of Quad.
     * @see PlainQuad
     */
    quad(subject: InQuad['subject'], predicate: InQuad['predicate'], object: InQuad['object'], graph?: InQuad['graph']): OutQuad;
}
