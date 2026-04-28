import { Command } from 'jsr:@cliffy/command@1.0.0';

const NEUMA_BASE = 'https://neuma.huma-num.fr';

async function fetchNeumaOpera(url: string) {
    const response = await fetch(url);
    return await response.json();
}

const { options } = await new Command()
    .name('SHERLOCK Grist to Nakala')
    .description('🌴')
    .version('v1.0.0')
    .option('--neuma-corpus-id <neuma-corpus-id:string>')
    .option('--out <out:string>')
    .parse();

const operas = []
let url = `${NEUMA_BASE}/rest/collections/${options.neumaCorpusId}/_opera/`
while (url) {
    console.log(url);
    const r = await fetchNeumaOpera(url);
    url = r.next;
    operas.push(...r.results);
}

for (const opera of operas) {
    console.log(opera);
    await Deno.writeTextFile(options.out + '/' + opera.local_ref + '.json', JSON.stringify(opera, null, 4));

    const fileUrl1 = opera.files.find((f: { name: string, url: string }) => f.name === "mei.xml").url;
    const response1 = await fetch(fileUrl1);
    const data1 = new Uint8Array(await response1.arrayBuffer());
    await Deno.writeFile(options.out + '/' + opera.local_ref + '.mei', data1);

    const fileurl2 = opera.files.find((f: { name: string, url: string }) => f.name === "score.xml").url;
    const response2 = await fetch(fileurl2);
    const data2 = new Uint8Array(await response2.arrayBuffer());
    await Deno.writeFile(options.out + '/' + opera.local_ref + '.xml', data2);
}