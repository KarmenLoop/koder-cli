// A bounded, synthetic delayed-EOF producer; no network, files or credentials.
const delay=Number(process.argv[2] ?? 250);
if(!Number.isFinite(delay)||delay<0||delay>5000){console.error('Usage: node stdin-producer.mjs <delay-ms:0..5000>');process.exitCode=2;}
else {process.stdout.write('Synthetic report: two checks passed.\n');setTimeout(()=>{},delay);}
