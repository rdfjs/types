import { BlankNode, DataFactory, Dataset, DatasetCore, DatasetCoreFactory, DatasetFactory, DefaultGraph, Literal,
  NamedNode, Quad, BaseQuad, StarQuad, PlainQuad, StarRole, PlainRole, Sink, Source, Store, Stream, Term, Variable, Quad_Graph } from ".";
import { EventEmitter } from "events";

function test_terms() {
    // Only types are checked in this tests,
    // so this does not have to be functional.
    const someTerm: Term = <any> {};

    if (someTerm.termType === 'Literal') {
      console.log(someTerm.datatype);
    }
    const namedNode: NamedNode = <any> {};
    const termType1: string = namedNode.termType;
    const value1: string = namedNode.value;
    let namedNodeEqual: boolean = namedNode.equals(someTerm);
    namedNodeEqual = namedNode.equals(null);
    namedNodeEqual = namedNode.equals(undefined);

    const namedNodeConstant: NamedNode<'http://example.org'> = <any> {};
    const constantIri: 'http://example.org' = namedNodeConstant.value;
    // @ts-expect-error
    const otherConstantIri: 'http://not-example.org' = namedNodeConstant.value;
    // @ts-expect-error
    const otherNamedNodeConstant: NamedNode<'http://not-example.org'> = namedNodeConstant;
    const regularNamedNode: NamedNode = namedNodeConstant;

    const blankNode: BlankNode = <any> {};
    const termType2: string = blankNode.termType;
    const value2: string = blankNode.value;
    let blankNodeEqual: boolean = blankNode.equals(someTerm);
    blankNodeEqual = blankNode.equals(null);
    blankNodeEqual = blankNode.equals(undefined);

    const literal: Literal = <any> {};
    const termType3: string = literal.termType;
    const value3: string = literal.value;
    const language3: string = literal.language;
    const datatype3: NamedNode = literal.datatype;
    let literalEqual: boolean = literal.equals(someTerm);
    literalEqual = literal.equals(null);
    literalEqual = literal.equals(undefined);

    const variable: Variable = <any> {};
    const termType4: string = variable.termType;
    const value4: string = variable.value;
    let variableEqual = variable.equals(someTerm);
    variableEqual = variable.equals(null);
    variableEqual = variable.equals(undefined);

    const defaultGraph: DefaultGraph = <any> {};
    const termType5: string = defaultGraph.termType;
    const value5: string = defaultGraph.value;
    let defaultGraphEqual: boolean = defaultGraph.equals(someTerm);
    defaultGraphEqual = defaultGraph.equals(null);
    defaultGraphEqual = defaultGraph.equals(undefined);
}

function test_quads() {
    {
        const quad: BaseQuad = <any> {};
        const s1: Term = quad.subject;
        const p1: Term = quad.predicate;
        const o1: Term = quad.object;
        const g1: Term = quad.graph;
        quad.equals(quad);
    }
    {
        const quad: StarQuad = <any> {};
        const s1: StarRole.Subject = quad.subject;
        const p1: StarRole.Predicate = quad.predicate;
        const o1: StarRole.Object = quad.object;
        const g1: StarRole.Graph = quad.graph;
        quad.equals(quad);
    }
    {
        const quad: PlainQuad = <any> {};
        const s1: PlainRole.Subject = quad.subject;
        const p1: PlainRole.Predicate = quad.predicate;
        const o1: PlainRole.Object = quad.object;
        const g1: PlainRole.Graph = quad.graph;
        quad.equals(quad);
    }
}

function test_datafactory() {
    const dataFactory: DataFactory = <any> {};

    const namedNode: NamedNode = dataFactory.namedNode('http://example.org');
    const constantValue: 'http://example.org' = dataFactory.namedNode('http://example.org').value;
    // @ts-expect-error
    const otherConstantValue: 'http://not-example.org' = dataFactory.namedNode('http://example.org').value;
    // @ts-expect-error
    const otherConstantNamedNode: NamedNode<'http://not-example.org'> = dataFactory.namedNode('http://example.org');

    const blankNode1: BlankNode = dataFactory.blankNode('b1');
    const blankNode2: BlankNode = dataFactory.blankNode();

    const literal1: Literal = dataFactory.literal('abc');
    const literal2: Literal = dataFactory.literal('abc', 'en-us');
    const literal3: Literal = dataFactory.literal('abc', namedNode);

    const variable: Variable = dataFactory.variable ? dataFactory.variable('v1') : <any> {};

    const term: NamedNode = <any> {};
    interface QuadBnode extends BaseQuad {
      subject: Term;
      predicate: Term;
      object: Term;
      graph: Term;
    }

    const quadBnodeFactory: DataFactory<QuadBnode, QuadBnode> = <any> {};
    const quad = quadBnodeFactory.quad(literal1, blankNode1, term, term);
    const hasBnode = quad.predicate.termType === "BlankNode";
}

function test_datafactory_star() {
    const dataFactory: DataFactory<StarQuad> = <any> {};

    // Compose the triple "<<ex:bob ex:age 23>> ex:certainty 0.9."
    const quadBobAge: StarQuad = dataFactory.quad(
        dataFactory.namedNode('ex:bob'),
        dataFactory.namedNode('ex:age'),
        dataFactory.literal('23'),
    );
    const quadBobAgeCertainty: StarQuad = dataFactory.quad(
        quadBobAge,
        dataFactory.namedNode('ex:certainty'),
        dataFactory.literal('0.9'),
    );

    // Decompose the triple
    if (quadBobAgeCertainty.subject.termType === 'Quad') {
        const quadBobAge2: StarQuad = quadBobAgeCertainty.subject;

        const equalToSelf: boolean = quadBobAge2.equals(quadBobAge);
        const notEqualToOtherType: boolean = quadBobAge2.equals(dataFactory.namedNode('ex:something:else'));
    }
}

function test_datafactory_star_basequad() {
    const dataFactory: DataFactory<StarQuad, BaseQuad> = <any> {};

    // Compose the triple "<<ex:bob ex:age 23>> ex:certainty 0.9."
    const quadBobAge: StarQuad = dataFactory.quad(
        dataFactory.namedNode('ex:bob'),
        dataFactory.namedNode('ex:age'),
        dataFactory.literal('23'),
    );
    const quadBobAgeCertainty: BaseQuad = dataFactory.quad(
        quadBobAge,
        dataFactory.namedNode('ex:certainty'),
        dataFactory.literal('0.9'),
    );

    // Decompose the triple
    if (quadBobAgeCertainty.subject.termType === 'Quad') {
        const quadBobAge2: BaseQuad = quadBobAgeCertainty.subject;

        const equalToSelf: boolean = quadBobAge2.equals(quadBobAge);
        const notEqualToOtherType: boolean = quadBobAge2.equals(dataFactory.namedNode('ex:something:else'));
    }
}

function test_stream() {
    const stream: Stream<BaseQuad> = <any> {};
    const quad: BaseQuad | null = stream.read();

    const term: Term = <any> {};
    const source: Source<BaseQuad, BaseQuad> = <any> {};
    const matchStream1: Stream<BaseQuad> = source.match();
    const matchStream2: Stream<BaseQuad> = source.match(term);
    const matchStream4: Stream<BaseQuad> = source.match(term, term);
    const matchStream6: Stream<BaseQuad> = source.match(term, term, term);
    const matchStream8: Stream<BaseQuad> = source.match(term, term, term, term);

    const sink: Sink<Stream<BaseQuad>, EventEmitter> = <any> {};
    const graph: StarRole.Graph = <any> {};
    const eventEmitter1: EventEmitter = sink.import(stream);

    const store: Store<BaseQuad, BaseQuad> = <any> {};
    const storeSource: Source<BaseQuad> = store;
    const storeSink: Sink<Stream<BaseQuad>, EventEmitter> = store;
    const eventEmitter2: EventEmitter = store.remove(stream);
    const eventEmitter3: EventEmitter = store.removeMatches();
    const eventEmitter4: EventEmitter = store.removeMatches(term);
    const eventEmitter6: EventEmitter = store.removeMatches(term, term);
    const eventEmitter8: EventEmitter = store.removeMatches(term, term, term);
    const eventEmitter10: EventEmitter = store.removeMatches(term, term, term, term);
    const eventEmitter12: EventEmitter = store.deleteGraph(graph);
    const eventEmitter13: EventEmitter = store.deleteGraph('http://example.org');
}

function test_stream_components() {
    const stream: Stream = <any> {};
    const quad: StarQuad | null = stream.read();

    const subject: StarRole.Subject = <any> {};
    const predicate: StarRole.Predicate = <any> {};
    const object: StarRole.Object = <any> {};
    const graph: StarRole.Graph = <any> {};
    const source: Source = <any> {};
    const matchStream1: Stream = source.match();
    const matchStream2: Stream = source.match(subject);
    const matchStream4: Stream = source.match(subject, predicate);
    const matchStream6: Stream = source.match(subject, predicate, object);
    const matchStream8: Stream = source.match(subject, predicate, object, graph);

    const sink: Sink<Stream, EventEmitter> = <any> {};
    const eventEmitter1: EventEmitter = sink.import(stream);

    const store: Store = <any> {};
    const storeSource: Source = store;
    const storeSink: Sink<Stream, EventEmitter> = store;
    const eventEmitter2: EventEmitter = store.remove(stream);
    const eventEmitter3: EventEmitter = store.removeMatches();
    const eventEmitter4: EventEmitter = store.removeMatches(subject);
    const eventEmitter6: EventEmitter = store.removeMatches(subject, predicate);
    const eventEmitter8: EventEmitter = store.removeMatches(subject, predicate, object);
    const eventEmitter10: EventEmitter = store.removeMatches(subject, predicate, object, graph);
    const eventEmitter12: EventEmitter = store.deleteGraph(graph);
    const eventEmitter13: EventEmitter = store.deleteGraph('http://example.org');
}

function test_datasetcore() {
    interface QuadBnode extends BaseQuad {
        subject: Term;
        predicate: Term;
        object: Term;
        graph: Term;
    }

    const quad: BaseQuad = <any> {};
    const quadBnode: QuadBnode = <any> {};
    const term: Term = <any> {};

    const datasetCoreFactory1: DatasetCoreFactory<BaseQuad, BaseQuad> = <any> {};
    const datasetCoreFactory2: DatasetCoreFactory<QuadBnode, BaseQuad> = <any> {};

    const dataset1: DatasetCore<BaseQuad> = datasetCoreFactory1.dataset();
    const dataset2: DatasetCore<BaseQuad, BaseQuad> = datasetCoreFactory1.dataset([quad, quad]);
    const dataset3: DatasetCore<QuadBnode, QuadBnode> = datasetCoreFactory2.dataset([quadBnode, quad]);

    const dataset2Size: number = dataset2.size;
    const dataset2Add: DatasetCore<BaseQuad> = dataset2.add(quad);
    const dataset2Delete: DatasetCore<BaseQuad> = dataset2.delete(quad);
    const dataset2Has: boolean = dataset2.has(quad);
    const dataset2Match1: DatasetCore<BaseQuad> = dataset2.match();
    const dataset2Match2: DatasetCore<BaseQuad> = dataset2.match(term);
    const dataset2Match3: DatasetCore<BaseQuad> = dataset2.match(term, term);
    const dataset2Match4: DatasetCore<BaseQuad> = dataset2.match(term, term, term);
    const dataset2Match5: DatasetCore<BaseQuad> = dataset2.match(term, term, term, term);
    const dataset2MatchWithNull1: DatasetCore<BaseQuad> = dataset2.match(term);
    const dataset2MatchWithNull2: DatasetCore<BaseQuad> = dataset2.match(null, term);
    const dataset2MatchWithNull3: DatasetCore<BaseQuad> = dataset2.match(term, null, term);
    const dataset2MatchWithNull4: DatasetCore<BaseQuad> = dataset2.match(term, term, null, term);
    const dataset2Iterable: Iterable<BaseQuad> = dataset2;

    const dataset3Size: number = dataset3.size;
    const dataset3Add: DatasetCore<QuadBnode> = dataset3.add(quadBnode);
    const dataset3Delete: DatasetCore<QuadBnode> = dataset3.delete(quadBnode);
    const dataset3Has: boolean = dataset3.has(quadBnode);
    const dataset3Match1: DatasetCore<QuadBnode> = dataset3.match();
    const dataset3Match2: DatasetCore<QuadBnode> = dataset3.match(term);
    const dataset3Match3: DatasetCore<QuadBnode> = dataset3.match(term, term);
    const dataset3Match4: DatasetCore<QuadBnode> = dataset3.match(term, term, term);
    const dataset3Match5: DatasetCore<QuadBnode> = dataset3.match(term, term, term, term);
    const dataset3Iterable: Iterable<QuadBnode> = dataset3;
}

function test_dataset() {
    interface QuadBnode extends BaseQuad {
        subject: Term;
        predicate: Term;
        object: Term;
        graph: Term;
    }

    interface QuadBnodeStar extends StarQuad {
        subject: StarRole.Subject;
        predicate: StarRole.Predicate;
        object: StarRole.Object;
        graph: StarRole.Graph;
    }

    const quad: BaseQuad = <any> {};
    const quadStar: StarQuad = <any> {};
    const quadBnode: QuadBnode = <any> {};
    const quadBnodeStar: QuadBnodeStar = <any> {};
    const term: Term = <any> {};
    const subject: StarRole.Subject = <any> {};
    const predicate: StarRole.Predicate = <any> {};
    const object: StarRole.Object = <any> {};
    const graph: StarRole.Graph = <any> {};

    const stream1: Stream<BaseQuad> = <any> {};
    const stream2: Stream<QuadBnode> = <any> {};
    const stream3: Stream = <any> {};
    const stream4: Stream<QuadBnodeStar> = <any> {};

    const datasetFactory1: DatasetFactory<BaseQuad, BaseQuad> = <any> {};
    const datasetFactory2: DatasetFactory<QuadBnode, BaseQuad> = <any> {};
    const datasetFactory3: DatasetFactory = <any> {};
    const datasetFactory4: DatasetFactory<QuadBnodeStar> = <any> {};

    const dataset1: Dataset<BaseQuad, BaseQuad> = datasetFactory1.dataset();
    const dataset2: Dataset<BaseQuad, BaseQuad> = datasetFactory1.dataset([quad, quad]);
    const dataset3: Dataset<QuadBnode, BaseQuad> = datasetFactory2.dataset();
    const dataset4: Dataset<QuadBnode, BaseQuad> = datasetFactory2.dataset([quadBnode, quad]);
    const dataset5: Dataset = datasetFactory3.dataset();
    const dataset6: Dataset = datasetFactory3.dataset([quadStar, quadStar]);
    const dataset7: Dataset<QuadBnodeStar> = datasetFactory4.dataset();
    const dataset8: Dataset<QuadBnodeStar> = datasetFactory4.dataset([quadBnodeStar, quadStar]);

    const datasetFactory1Core: DatasetCoreFactory<BaseQuad> = datasetFactory1;
    const datasetFactory2Core: DatasetCoreFactory<QuadBnode, BaseQuad> = datasetFactory2;
    const datasetFactory3Core: DatasetCoreFactory = datasetFactory3;
    const datasetFactory4Core: DatasetCoreFactory<QuadBnode> = datasetFactory4;

    const dataset2Size: number = dataset2.size;
    const dataset2Add: Dataset<BaseQuad> = dataset2.add(quad);
    const dataset2AddAllDataset: Dataset<BaseQuad> = dataset2.addAll(dataset1);
    const dataset2AddAllArray: Dataset<BaseQuad> = dataset2.addAll([quad]);
    const dataset2Contains: boolean = dataset2.contains(dataset1);
    const dataset2Delete: Dataset<BaseQuad> = dataset2.delete(quad);
    const dataset2DeleteMatches1: Dataset<BaseQuad> = dataset2.deleteMatches();
    const dataset2DeleteMatches2: Dataset<BaseQuad> = dataset2.deleteMatches(term);
    const dataset2DeleteMatches3: Dataset<BaseQuad> = dataset2.deleteMatches(term, term);
    const dataset2DeleteMatches4: Dataset<BaseQuad> = dataset2.deleteMatches(term, term, term);
    const dataset2DeleteMatches5: Dataset<BaseQuad> = dataset2.deleteMatches(term, term, term, term);
    const dataset2Difference: Dataset<BaseQuad> = dataset2.difference(dataset1);
    const dataset2Equals: boolean = dataset2.equals(dataset1);
    const dataset2Every: boolean = dataset2.every((quad: BaseQuad, dataset: Dataset<BaseQuad>) => true);
    const dataset2Filter: Dataset<BaseQuad> = dataset2.filter((quad: BaseQuad, dataset: Dataset<BaseQuad>) => true);
    dataset2.forEach((quad: BaseQuad, dataset: Dataset<BaseQuad>) => {
        return
    });
    const dataset2Has: boolean = dataset2.has(quad);
    const dataset2Import: Promise<Dataset<BaseQuad>> = dataset2.import(stream1);
    const dataset2Intersection: Dataset<BaseQuad> = dataset2.intersection(dataset1);
    const dataset2Map: Dataset<BaseQuad> = dataset2.map((quad: BaseQuad, dataset: Dataset<BaseQuad>) => quad);
    const dataset2Match1: Dataset<BaseQuad, BaseQuad> = dataset2.match();
    const dataset2Match2: Dataset<BaseQuad, BaseQuad> = dataset2.match(term);
    const dataset2Match3: Dataset<BaseQuad, BaseQuad> = dataset2.match(term, term);
    const dataset2Match4: Dataset<BaseQuad, BaseQuad> = dataset2.match(term, term, term);
    const dataset2Match5: Dataset<BaseQuad, BaseQuad> = dataset2.match(term, term, term, term);
    const dataset2Reduce1: string = dataset2.reduce((acc: string, quad: BaseQuad, dataset: Dataset<BaseQuad>) => acc);
    const dataset2Reduce2: boolean[] = dataset2.reduce((acc: boolean[], quad: BaseQuad, dataset: Dataset<BaseQuad>) => acc, []);
    const dataset2Reduce3: string = dataset2.reduce((acc: string, quad: BaseQuad, dataset: Dataset<BaseQuad>) => acc, '');
    const dataset2Some: boolean = dataset2.some((quad: BaseQuad, dataset: Dataset<BaseQuad>) => true);
    const dataset2ToArray: BaseQuad[] = [...dataset2];
    const dataset2ToCanonical: string = dataset2.toCanonical();
    const dataset2ToStream: Stream<BaseQuad> = dataset2.toStream();
    const dataset2ToString: string = dataset2.toString();
    const dataset2Union: Dataset<BaseQuad> = dataset2.union(dataset1);
    const dataset2Iterable: Iterable<BaseQuad> = dataset2;
    const dataset2Core: DatasetCore<BaseQuad> = dataset2;


    const dataset4Size: number = dataset4.size;
    const dataset4Add: Dataset<QuadBnode> = dataset4.add(quadBnode);
    const dataset4AddAllDataset: Dataset<QuadBnode> = dataset4.addAll(dataset3);
    const dataset4AddAllArray: Dataset<QuadBnode> = dataset4.addAll([quadBnode]);
    const dataset4Contains: boolean = dataset4.contains(dataset3);
    const dataset4Delete: Dataset<QuadBnode> = dataset4.delete(quadBnode);
    const dataset4DeleteMatches1: Dataset<QuadBnode> = dataset4.deleteMatches();
    const dataset4DeleteMatches2: Dataset<QuadBnode> = dataset4.deleteMatches(term);
    const dataset4DeleteMatches3: Dataset<QuadBnode> = dataset4.deleteMatches(term, term);
    const dataset4DeleteMatches4: Dataset<QuadBnode> = dataset4.deleteMatches(term, term, term);
    const dataset4DeleteMatches5: Dataset<QuadBnode> = dataset4.deleteMatches(term, term, term, term);
    const dataset4Difference: Dataset<QuadBnode> = dataset4.difference(dataset3);
    const dataset4Equals: boolean = dataset4.equals(dataset3);
    const dataset4Every: boolean = dataset4.every((quad: QuadBnode, dataset: Dataset<QuadBnode>) => true);
    const dataset4Filter: Dataset<QuadBnode> = dataset4.filter((quad: QuadBnode, dataset: Dataset<QuadBnode>) => true);
    dataset4.forEach((quad: QuadBnode, dataset: Dataset<QuadBnode>) => {
        return
    });
    const dataset4Has: boolean = dataset4.has(quadBnode);
    const dataset4Import: Promise<Dataset<QuadBnode>> = dataset4.import(stream2);
    const dataset4Intersection: Dataset<QuadBnode> = dataset4.intersection(dataset3);
    const dataset4Map: Dataset<QuadBnode> = dataset4.map((quad: QuadBnode, dataset: Dataset<QuadBnode>) => quad);
    const dataset4Match1: Dataset<QuadBnode> = dataset4.match();
    const dataset4Match2: Dataset<QuadBnode> = dataset4.match(term);
    const dataset4Match3: Dataset<QuadBnode> = dataset4.match(term, term);
    const dataset4Match4: Dataset<QuadBnode> = dataset4.match(term, term, term);
    const dataset4Match5: Dataset<QuadBnode> = dataset4.match(term, term, term, term);
    const dataset4Reduce1: string = dataset4.reduce((acc: string, quad: QuadBnode, dataset: Dataset<QuadBnode>) => acc);
    const dataset4Reduce2: boolean[] = dataset4.reduce((acc: boolean[], quad: QuadBnode, dataset: Dataset<QuadBnode>) => acc, []);
    const dataset4Reduce3: string = dataset4.reduce((acc: string, quad: QuadBnode, dataset: Dataset<QuadBnode>) => acc, '');
    const dataset4Some: boolean = dataset4.some((quad: QuadBnode, dataset: Dataset<QuadBnode>) => true);
    const dataset4ToArray: QuadBnode[] = [...dataset4];
    const dataset4ToCanonical: string = dataset4.toCanonical();
    const dataset4ToStream: Stream<QuadBnode> = dataset4.toStream();
    const dataset4ToString: string = dataset4.toString();
    const dataset4Union: Dataset<QuadBnode> = dataset4.union(dataset3);
    const dataset4Iterable: Iterable<QuadBnode> = dataset4;
    const dataset4Core: DatasetCore<QuadBnode> = dataset4;

    const dataset6Size: number = dataset6.size;
    const dataset6Add: Dataset = dataset6.add(quadStar);
    const dataset6AddAllDataset: Dataset = dataset6.addAll(dataset5);
    const dataset6AddAllArray: Dataset = dataset6.addAll([quadStar]);
    const dataset6Contains: boolean = dataset6.contains(dataset5);
    const dataset6Delete: Dataset = dataset6.delete(quadStar);
    const dataset6DeleteMatches1: Dataset = dataset6.deleteMatches();
    const dataset6DeleteMatches2: Dataset = dataset6.deleteMatches(subject);
    const dataset6DeleteMatches3: Dataset = dataset6.deleteMatches(subject, predicate);
    const dataset6DeleteMatches4: Dataset = dataset6.deleteMatches(subject, predicate, object);
    const dataset6DeleteMatches5: Dataset = dataset6.deleteMatches(subject, predicate, object, graph);
    const dataset6Difference: Dataset = dataset6.difference(dataset5);
    const dataset6Equals: boolean = dataset6.equals(dataset5);
    const dataset6Every: boolean = dataset6.every((quad: StarQuad, dataset: Dataset) => true);
    const dataset6Filter: Dataset = dataset6.filter((quad: StarQuad, dataset: Dataset) => true);
    dataset6.forEach((quad: StarQuad, dataset: Dataset) => {
        return
    });
    const dataset6Has: boolean = dataset6.has(quadStar);
    const dataset6Import: Promise<Dataset> = dataset6.import(stream3);
    const dataset6Intersection: Dataset = dataset6.intersection(dataset5);
    const dataset6Map: Dataset = dataset6.map((quad: StarQuad, dataset: Dataset) => quad);
    const dataset6Match1: Dataset = dataset6.match();
    const dataset6Match2: Dataset = dataset6.match(subject);
    const dataset6Match3: Dataset = dataset6.match(subject, predicate);
    const dataset6Match4: Dataset = dataset6.match(subject, predicate, object);
    const dataset6Match5: Dataset = dataset6.match(subject, predicate, object, graph);
    const dataset6Reduce1: string = dataset6.reduce((acc: string, quad: StarQuad, dataset: Dataset) => acc);
    const dataset6Reduce2: boolean[] = dataset6.reduce((acc: boolean[], quad: StarQuad, dataset: Dataset) => acc, []);
    const dataset6Reduce3: string = dataset6.reduce((acc: string, quad: StarQuad, dataset: Dataset) => acc, '');
    const dataset6Some: boolean = dataset6.some((quad: StarQuad, dataset: Dataset) => true);
    const dataset6ToArray: StarQuad[] = [...dataset6];
    const dataset6ToCanonical: string = dataset6.toCanonical();
    const dataset6ToStream: Stream = dataset6.toStream();
    const dataset6ToString: string = dataset6.toString();
    const dataset6Union: Dataset = dataset6.union(dataset5);
    const dataset6Iterable: Iterable<StarQuad> = dataset6;
    const dataset6Core: DatasetCore = dataset6;


    const dataset8Size: number = dataset8.size;
    const dataset8Add: Dataset<QuadBnodeStar> = dataset8.add(quadBnodeStar);
    const dataset8AddAllDataset: Dataset<QuadBnodeStar> = dataset8.addAll(dataset7);
    const dataset8AddAllArray: Dataset<QuadBnodeStar> = dataset8.addAll([quadBnodeStar]);
    const dataset8Contains: boolean = dataset8.contains(dataset7);
    const dataset8Delete: Dataset<QuadBnodeStar> = dataset8.delete(quadBnodeStar);
    const dataset8DeleteMatches1: Dataset<QuadBnodeStar> = dataset8.deleteMatches();
    const dataset8DeleteMatches2: Dataset<QuadBnodeStar> = dataset8.deleteMatches(subject);
    const dataset8DeleteMatches3: Dataset<QuadBnodeStar> = dataset8.deleteMatches(subject, predicate);
    const dataset8DeleteMatches4: Dataset<QuadBnodeStar> = dataset8.deleteMatches(subject, predicate, object);
    const dataset8DeleteMatches5: Dataset<QuadBnodeStar> = dataset8.deleteMatches(subject, predicate, object, graph);
    const dataset8Difference: Dataset<QuadBnodeStar> = dataset8.difference(dataset7);
    const dataset8Equals: boolean = dataset8.equals(dataset7);
    const dataset8Every: boolean = dataset8.every((quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => true);
    const dataset8Filter: Dataset<QuadBnodeStar> = dataset8.filter((quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => true);
    dataset8.forEach((quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => {
        return
    });
    const dataset8Has: boolean = dataset8.has(quadBnodeStar);
    const dataset8Import: Promise<Dataset<QuadBnodeStar>> = dataset8.import(stream4);
    const dataset8Intersection: Dataset<QuadBnodeStar> = dataset8.intersection(dataset7);
    const dataset8Map: Dataset<QuadBnodeStar> = dataset8.map((quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => quad);
    const dataset8Match1: Dataset<QuadBnodeStar> = dataset8.match();
    const dataset8Match2: Dataset<QuadBnodeStar> = dataset8.match(subject);
    const dataset8Match3: Dataset<QuadBnodeStar> = dataset8.match(subject, predicate);
    const dataset8Match4: Dataset<QuadBnodeStar> = dataset8.match(subject, predicate, object);
    const dataset8Match5: Dataset<QuadBnodeStar> = dataset8.match(subject, predicate, object, graph);
    const dataset8Reduce1: string = dataset8.reduce((acc: string, quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => acc);
    const dataset8Reduce2: boolean[] = dataset8.reduce((acc: boolean[], quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => acc, []);
    const dataset8Reduce3: string = dataset8.reduce((acc: string, quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => acc, '');
    const dataset8Some: boolean = dataset8.some((quad: QuadBnodeStar, dataset: Dataset<QuadBnodeStar>) => true);
    const dataset8ToArray: QuadBnodeStar[] = [...dataset8];
    const dataset8ToCanonical: string = dataset8.toCanonical();
    const dataset8ToStream: Stream<QuadBnodeStar> = dataset8.toStream();
    const dataset8ToString: string = dataset8.toString();
    const dataset8Union: Dataset<QuadBnodeStar> = dataset8.union(dataset7);
    const dataset8Iterable: Iterable<QuadBnodeStar> = dataset8;
    const dataset8Core: DatasetCore<QuadBnodeStar> = dataset8;

}

function test_datasetCoreFactory_covariance() {
    const quad: BaseQuad = <any> {};
    const factory: DatasetCoreFactory<Quad, BaseQuad> = <any> {};

    const fromQuads = factory.dataset([quad, quad]);
}

function test_datasetFactory_covariance() {
    const quad: BaseQuad = <any> {};
    const dataset: Dataset = <any> {};
    const factory: DatasetFactory<Quad, BaseQuad> = <any> {};

    const fromQuads = factory.dataset([quad, quad]);
    const fromDataset = factory.dataset(dataset);
}

async function test_dataset_covariance(): Promise<Dataset> {
    const quad: StarQuad = <any> {};
    const dataset: Dataset = <any> {};

    // rdf-ext-like quad
    interface QuadExt extends StarQuad {
        toCanonical(): string;
    }
    let datasetExt: Dataset<QuadExt, StarQuad> = <any> {};

    // stream coming from a generic parser
    const stream: Stream = <any> {};

    datasetExt = datasetExt.add(quad);
    datasetExt = datasetExt.delete(quad);
    datasetExt = datasetExt.addAll([quad, quad]);
    datasetExt = datasetExt.addAll(dataset);
    datasetExt.contains(dataset);
    datasetExt = datasetExt.difference(dataset);
    datasetExt.equals(dataset);
    datasetExt.has(quad);
    datasetExt.intersection(dataset);
    datasetExt.union(dataset);
    return datasetExt.import(stream);
}

class DatasetCoreExt implements DatasetCore {
    size!: number;

    add(): this {
        throw new Error("Method not implemented.");
    }

    delete(): this {
        throw new Error("Method not implemented.");
    }

    has(): boolean {
        throw new Error("Method not implemented.");
    }

    match(): DatasetCore {
        const newInstance: DatasetCoreExt = <any> {};
        return newInstance;
    }

    [Symbol.iterator](): Iterator<StarQuad> {
        throw new Error("Method not implemented.");
    }
}

class DatasetExt extends DatasetCoreExt implements Dataset {
    addAll(): this {
        throw new Error("Method not implemented.");
    }

    contains(): boolean {
        throw new Error("Method not implemented.");
    }

    deleteMatches(): this {
        throw new Error("Method not implemented.");
    }

    difference(): Dataset {
        const newInstance: DatasetExt = <any> {};
        return newInstance;
    }

    equals(): boolean {
        throw new Error("Method not implemented.");
    }

    every(): boolean {
        throw new Error("Method not implemented.");
    }

    filter(): Dataset {
        const newInstance: DatasetExt = <any> {};
        return newInstance;
    }

    forEach(): void {
        throw new Error("Method not implemented.");
    }

    import(): Promise<this> {
        throw new Error("Method not implemented.");
    }

    intersection(): this {
        throw new Error("Method not implemented.");
    }

    map(): Dataset {
        const newInstance: DatasetExt = <any> {};
        return newInstance;
    }

    match(): Dataset {
        const newInstance: DatasetExt = <any> {};
        return newInstance;
    }

    reduce(): any {
        throw new Error("Method not implemented.");
    }

    some(): boolean {
        throw new Error("Method not implemented.");
    }

    toCanonical(): string {
        throw new Error("Method not implemented.");
    }

    toStream(): Stream {
        throw new Error("Method not implemented.");
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }

    union(): Dataset {
        const newInstance: DatasetExt = <any> {};
        return newInstance;
    }
}


async function test_dataset_covariance_plain(): Promise<Dataset> {
    const quad: PlainQuad = <any> {};
    const dataset: Dataset<PlainQuad> = <any> {};

    // rdf-ext-like quad
    interface QuadExt extends PlainQuad {
        toCanonical(): string;
    }
    let datasetExt: Dataset<QuadExt, PlainQuad> = <any> {};

    // stream coming from a generic parser
    const stream: Stream<PlainQuad> = <any> {};

    datasetExt = datasetExt.add(quad);
    datasetExt = datasetExt.delete(quad);
    datasetExt = datasetExt.addAll([quad, quad]);
    datasetExt = datasetExt.addAll(dataset);
    datasetExt.contains(dataset);
    datasetExt = datasetExt.difference(dataset);
    datasetExt.equals(dataset);
    datasetExt.has(quad);
    datasetExt.intersection(dataset);
    datasetExt.union(dataset);
    return datasetExt.import(stream);
}

class DatasetCoreExtPlain extends DatasetCoreExt {
    match(): DatasetCore {
        const newInstance: DatasetCoreExtPlain = <any> {};
        return newInstance;
    }

    [Symbol.iterator](): Iterator<PlainQuad> {
        throw new Error("Method not implemented.");
    }
}

class DatasetExtPlain extends DatasetExt implements Dataset {
    filter(): Dataset {
        const newInstance: DatasetExtPlain = <any> {};
        return newInstance;
    }

    map(): Dataset {
        const newInstance: DatasetExtPlain = <any> {};
        return newInstance;
    }

    match(): Dataset {
        const newInstance: DatasetExtPlain = <any> {};
        return newInstance;
    }

    union(): Dataset {
        const newInstance: DatasetExtPlain = <any> {};
        return newInstance;
    }
}

function testInheritance() {
    const datasetCoreExt: DatasetCoreExt = new DatasetCoreExt();
    const datasetCoreMatch: DatasetCore = datasetCoreExt.match();

    const datasetCoreExtPlain: DatasetCoreExtPlain = new DatasetCoreExtPlain();
    const datasetCorePlainMatch: DatasetCore = datasetCoreExtPlain.match();

    const datasetExt: DatasetExt = new DatasetExt();
    const datasetMatch: Dataset = datasetExt.match();
    const datasetMap: Dataset = datasetExt.map();
    const datasetUnion: Dataset = datasetExt.union();
    const datasetFilter: Dataset = datasetExt.filter();
    const datasetDifference: Dataset = datasetExt.difference();

    const datasetExtPlain: DatasetExtPlain = new DatasetExtPlain();
    const datasetPlainMatch: Dataset = datasetExtPlain.match();
    const datasetPlainMap: Dataset = datasetExtPlain.map();
    const datasetPlainUnion: Dataset = datasetExtPlain.union();
    const datasetPlainFilter: Dataset = datasetExtPlain.filter();
    const datasetPlainDifference: Dataset = datasetExtPlain.difference();
}
