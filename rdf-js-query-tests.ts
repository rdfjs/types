/* eslint-disable no-case-declarations */
import {
    DataFactory,
    BindingsFactory,
    Bindings,
    Term,
    Queryable,
    SparqlResultSupport,
    MetadataOpts,
    QueryStringContext,
    QueryAlgebraContext,
    AllMetadataSupport, Query, Variable, ResultStream, Quad, SparqlQueryable, BindingsResultSupport, QuadsResultSupport
} from ".";

function test_bindings() {
    const df: DataFactory = <any> {};
    const bf: BindingsFactory = <any> {};

    const b1: Bindings = bf.bindings([
        [ df.variable!('varA'), df.namedNode('ex:a'), ],
        [ df.variable!('varB'), df.literal('B'), ],
    ]);

    const valueA: Term | undefined = b1.get('varA');
    const valueB: Term | undefined = b1.get(df.variable!('varB'));

    const b2: Bindings = b1
      .set('varA', df.namedNode('ex:2'))
      .delete('varB')
      .set(df.variable!('varB'), df.literal('B2'));

    for (const [ key, value ] of b2) {
        const keytype: 'Variable' = key.termType;
        const valuetype: string = value.termType;
    }
    for (const key of b2.keys()) {
        const type: 'Variable' = key.termType;
    }
}

async function test_queryable() {
    const engine: Queryable<string, string, AllMetadataSupport, Query<SparqlResultSupport>, QueryStringContext<string>, QueryAlgebraContext<string>> = <any> {};

    const query: Query<SparqlResultSupport> = await engine.query('SELECT * WHERE { ... }');
    switch (query.resultType) {
        case 'bindings':
            const metadata = await query.metadata();
            const variables: Variable[] = metadata.variables;
            const bindings: ResultStream<Bindings> = await query.execute();
            bindings.on('data', (bindings: Bindings) => console.log(bindings));
            break;
        case 'quads':
            const quads: ResultStream<Quad> = await query.execute();
            break;
        case 'boolean':
            const bool: boolean = await query.execute();
            break;
        case 'void':
            const done: void = await query.execute();
            break;
    }
}

async function test_sparqlqueryable() {
    const engine: SparqlQueryable<string, string, QueryStringContext<string>, QueryAlgebraContext<string>, SparqlResultSupport> = <any> {};

    const bindings: ResultStream<Bindings> = await engine.queryBindings('SELECT * WHERE { ... }');
    const quads: ResultStream<Quad> = await engine.queryQuads('CONSTRUCT WHERE { ... }');
    const bool: boolean = await engine.queryBoolean('ASK WHERE { ... }');
    const done: void = await engine.queryVoid('INSERT WHERE { ... }');
}

async function test_sparqlqueryable_partial() {
    const engine: SparqlQueryable<string, string, QueryStringContext<string>, QueryAlgebraContext<string>, BindingsResultSupport & QuadsResultSupport> = <any> {};

    const bindings: ResultStream<Bindings> = await engine.queryBindings('SELECT * WHERE { ... }');
    const quads: ResultStream<Quad> = await engine.queryQuads('CONSTRUCT WHERE { ... }');
    // @ts-ignore
    const bool: boolean = await engine.queryBoolean('ASK WHERE { ... }'); // Unsupported
    // @ts-ignore
    const done: void = await engine.queryVoid('INSERT WHERE { ... }'); // Unsupported
}
