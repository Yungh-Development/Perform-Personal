const outDir = "./dist";

await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: outDir,
    format: "esm",
    target: "bun",
    drop: ["debugger"]
});

console.log(`> Build done: Files exported to ${outDir}\n`);