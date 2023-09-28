import { readFile } from 'fs/promises';

import { execa } from 'execa';
import { globby } from 'globby';
import prompt from 'prompts';

const jsLibs = ['React', 'Solid', 'Svelte', 'Vue', 'Web Components'];

async function main() {
  const jsLibIndex = /** @type {any} */ (
      await prompt.prompts.select({
        type: 'select',
        name: 'lib',
        message: 'Pick a JS library',
        choices: jsLibs.map((lib) => ({ title: lib })),
      })
    ),
    jsLib = jsLibs[jsLibIndex],
    jsLibId = jsLib.replace(' ', '-').toLowerCase();

  const examples = await globby(`player/${jsLibId}/*/package.json`);

  const exampleIndex = /** @type {any} */ (
      await prompt.prompts.select({
        type: 'select',
        name: 'lib',
        message: 'Pick an example',
        choices: examples.map((example) => ({
          title: example
            .split('/')[2]
            .replace('css', 'CSS')
            .split('-')
            .filter((c) => c.length)
            .map(capitalizeFirstLetter)
            .join(' ')
            .split('+')
            .map(capitalizeFirstLetter)
            .join(' + '),
        })),
      })
    ),
    example = examples[exampleIndex];

  const pkg = JSON.parse(await readFile(example, 'utf8'));

  await execa('pnpm', ['-F', pkg.name, 'dev'], { stdio: 'inherit' });
}

main().catch((e) => {
  if (e.exitCode === 1) return;
  console.error(e);
  process.exit(1);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
