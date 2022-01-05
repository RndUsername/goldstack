import { exec, pwd, commandExists } from '@goldstack/utils-sh';
import {
  assertDocker,
  hasDocker,
  imageTerraform,
} from '@goldstack/utils-docker';
import { fatal } from '@goldstack/utils-log';
import { CloudProvider } from './cloudProvider';

export type Variables = [string, string][];

const renderVariables = (variables: Variables): string => {
  if (variables.length === 0) {
    return '';
  }
  return variables.map(([key, value]) => `-var \"${key}=${value}\" `).join('');
};

const renderBackendConfig = (variables: Variables): string => {
  if (variables.length === 0) {
    return '';
  }
  return variables
    .map(([key, value]) => `-backend-config=\"${key}=${value}\" `)
    .join('');
};
interface TerraformOptions {
  dir?: string;
  provider: CloudProvider;
  variables?: Variables;
  backendConfig?: Variables;
  options?: string[];
}

const execWithDocker = (cmd: string, options: TerraformOptions): string => {
  if (!options.dir) {
    options.dir = pwd();
  }

  assertDocker();

  const cmd3 =
    `docker run --rm -v "${options.dir}":/app ` +
    ` ${options.provider.generateEnvVariableString()} ` +
    '-w /app ' +
    `${imageTerraform()} ${cmd} ` +
    ` ${renderBackendConfig(options.backendConfig || [])} ` +
    ` ${renderVariables(options.variables || [])} ` +
    ` ${options.options?.join(' ') || ''} `;

  console.debug('Running Terraform in Docker');
  console.debug(cmd3);
  return exec(cmd3);
};

export const assertTerraform = (): void => {
  if (!commandExists('terraform')) {
    fatal(
      'Terraform is not installed.\n\n' +
        'Install terraform CLI or Docker (preferred).'
    );
    throw new Error();
  }
};

const execWithCli = (cmd: string, options: TerraformOptions): string => {
  if (!options.dir) {
    options.dir = pwd();
  }

  assertTerraform();

  options.provider.setEnvVariables();

  const execCmd =
    `terraform ${cmd} ` +
    ` ${renderBackendConfig(options.backendConfig || [])} ` +
    ` ${renderVariables(options.variables || [])} ` +
    ` ${options.options?.join(' ') || ''} `;

  console.debug('Running Terraform in cli');
  console.debug(execCmd);
  return exec(execCmd);
};

export const tf = (cmd: string, options: TerraformOptions): string => {
  // always prefer running with Docker
  if (hasDocker()) {
    return execWithDocker(cmd, options);
  }

  return execWithCli(cmd, options);
};
