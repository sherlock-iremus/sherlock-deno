import { Command } from "jsr:@cliffy/command@1.0.0";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

await new Command()
    .name("SHERLOCK Grist to Nakala")
    .description("🌴")
    .version("v1.0.0")
    .option("-e, --env-file <path:string>", "Public env file", { default: ".env" })
    .option("-s, --secret-env-file <path:string>", "Private env file", { default: ".secret.env" })
    .action(async ({ envFile, secretEnvFile }) => {
        const env = await load({ envPath: envFile });
        console.log(env);
        const secretEnv = await load({ envPath: secretEnvFile });
        console.log(secretEnv);
    })
    .parse();